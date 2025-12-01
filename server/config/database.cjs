const mongoose = require('mongoose');
const { DB_CONFIG } = require('./constants');

/**
 * MongoDB 기본 연결 함수
 * - 단순 연결만 수행
 * - initDB에서 호출됨
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-coding-portfolio';

    // 디버깅: 환경 변수 확인 (비밀번호는 마스킹)
    const isVercelEnv = process.env.VERCEL === '1';
    const hasMongoURI = !!process.env.MONGODB_URI;
    const mongoURIPreview = hasMongoURI
      ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@') // 비밀번호 마스킹
      : '없음 (기본값 사용)';

    console.log('🔍 MongoDB 연결 시도:');
    console.log(`   - Vercel 환경: ${isVercelEnv ? '예' : '아니오'}`);
    console.log(`   - MONGODB_URI 설정: ${hasMongoURI ? '예' : '아니오'}`);
    console.log(`   - 연결 문자열: ${mongoURIPreview}`);

    // MongoDB 연결 옵션 (서버리스 환경 최적화)
    const options = {
      serverSelectionTimeoutMS: DB_CONFIG.CONNECTION_TIMEOUT_MS,
      connectTimeoutMS: DB_CONFIG.CONNECTION_TIMEOUT_MS,
      socketTimeoutMS: DB_CONFIG.CONNECTION_TIMEOUT_MS,
      maxPoolSize: isVercelEnv ? 1 : 10, // 서버리스 환경에서는 연결 풀 크기 1
      minPoolSize: 0,
      maxIdleTimeMS: isVercelEnv ? 30000 : 300000,
    };

    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
    console.log('   - DB 이름:', conn.connection.name);
    console.log('   - readyState:', conn.connection.readyState);
    return true;
  } catch (error) {
    // 상세한 에러 정보 로깅
    console.error('❌ MongoDB 연결 실패:', {
      message: error.message,
      name: error.name,
      code: error.code,
      codeName: error.codeName,
      hasMongoURI: !!process.env.MONGODB_URI,
      mongoURIPreview: process.env.MONGODB_URI
        ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@').substring(0, 80) + '...'
        : '없음'
    });

    // 상세 오류 정보
    if (error.name === 'MongoServerSelectionError') {
      console.error('💡 네트워크 연결 문제일 수 있습니다. MongoDB Atlas의 Network Access 설정을 확인하세요.');
      console.error('   - Network Access에 0.0.0.0/0 추가 확인');
      console.error('   - 클러스터가 일시 중지되지 않았는지 확인');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('💡 인증 실패입니다. 사용자명과 비밀번호를 확인하세요.');
      console.error('   - Database Access에서 사용자 확인');
      console.error('   - 비밀번호에 특수문자가 있으면 URL 인코딩 확인');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('💡 DNS 조회 실패입니다. 클러스터 주소를 확인하세요.');
      console.error('   - 연결 문자열의 클러스터 주소 확인');
    } else if (error.message.includes('timeout')) {
      console.error('💡 연결 타임아웃입니다. 네트워크나 클러스터 상태를 확인하세요.');
    }

    console.error('💡 MongoDB를 설치하고 실행하거나, MongoDB Atlas를 사용하세요.');
    console.error('💡 Vercel 환경 변수에 MONGODB_URI가 설정되어 있는지 확인하세요.');
    return false;
  }
};

/**
 * MongoDB 연결 초기화 (재시도 로직 포함)
 * - 서버리스 환경 최적화
 * - 자동 재시도
 * - 연결 상태 관리
 *
 * @param {boolean} forceReconnect - 강제 재연결 여부
 * @returns {Promise<boolean>} 연결 성공 여부
 */
let dbConnected = false;
let connectionAttempts = 0;

const initDB = async (forceReconnect = false) => {
  const currentState = mongoose.connection.readyState;
  const isConnected = currentState === 1;
  const isVercel = process.env.VERCEL === '1';

  // 이미 연결되어 있고 서버리스가 아니면 재사용
  if (!forceReconnect && !isVercel && isConnected && dbConnected) {
    return true;
  }

  // 연결이 끊어지는 중이거나 연결 중이면 즉시 새 연결 시도
  if (currentState === 2 || currentState === 3) {
    console.log(`⚠️ MongoDB 연결 상태: ${currentState} (${currentState === 2 ? 'connecting' : 'disconnecting'}), 새 연결 시도`);
    try {
      await mongoose.connection.close().catch(() => {});
    } catch (e) {
      // 무시
    }
  }

  // 재시도 횟수 초기화
  if (forceReconnect || !dbConnected) {
    connectionAttempts = 0;
  }

  // 최대 재시도 횟수 확인
  if (connectionAttempts >= DB_CONFIG.MAX_RETRIES) {
    console.error(`❌ MongoDB 연결 실패: 최대 재시도 횟수(${DB_CONFIG.MAX_RETRIES}) 초과`);
    return false;
  }

  try {
    connectionAttempts++;
    console.log(`🔄 MongoDB 연결 시도 (${connectionAttempts}/${DB_CONFIG.MAX_RETRIES})...`);

    // 기존 연결이 있으면 먼저 닫기
    if (currentState !== 0 && currentState !== 1) {
      try {
        await Promise.race([
          mongoose.connection.close(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Close timeout')), 1000))
        ]).catch(() => {});
        console.log('   - 기존 연결 종료');
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (closeError) {
        console.log('   - 기존 연결 종료 실패 (무시)');
      }
    }

    // 새 연결 시도 (타임아웃 적용)
    const connectPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout')), DB_CONFIG.CONNECTION_TIMEOUT_MS)
    );

    dbConnected = await Promise.race([connectPromise, timeoutPromise]);

    if (dbConnected && mongoose.connection.readyState === 1) {
      connectionAttempts = 0; // 성공 시 재시도 횟수 초기화
      console.log('✅ MongoDB 연결 성공');
      return true;
    } else {
      dbConnected = false;
      if (connectionAttempts < DB_CONFIG.MAX_RETRIES) {
        console.log(`   ⏳ ${DB_CONFIG.RETRY_DELAY_MS}ms 후 재시도...`);
        await new Promise(resolve => setTimeout(resolve, DB_CONFIG.RETRY_DELAY_MS));
        return await initDB(true);
      }
      return false;
    }
  } catch (error) {
    console.error(`❌ MongoDB 연결 시도 ${connectionAttempts} 실패:`, error.message);
    dbConnected = false;

    if (connectionAttempts < DB_CONFIG.MAX_RETRIES) {
      console.log(`   ⏳ ${DB_CONFIG.RETRY_DELAY_MS}ms 후 재시도...`);
      await new Promise(resolve => setTimeout(resolve, DB_CONFIG.RETRY_DELAY_MS));
      return await initDB(true);
    }

    return false;
  }
};

module.exports = { connectDB, initDB };

