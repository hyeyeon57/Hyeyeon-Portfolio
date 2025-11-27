const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-coding-portfolio';
    
    // 디버깅: 환경 변수 확인 (비밀번호는 마스킹)
    const isVercel = process.env.VERCEL === '1';
    const hasMongoURI = !!process.env.MONGODB_URI;
    const mongoURIPreview = hasMongoURI 
      ? process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@') // 비밀번호 마스킹
      : '없음 (기본값 사용)';
    
    console.log('🔍 MongoDB 연결 시도:');
    console.log(`   - Vercel 환경: ${isVercel ? '예' : '아니오'}`);
    console.log(`   - MONGODB_URI 설정: ${hasMongoURI ? '예' : '아니오'}`);
    console.log(`   - 연결 문자열: ${mongoURIPreview}`);
    
    // MongoDB 연결 옵션 (타임아웃 단축)
    const options = {
      serverSelectionTimeoutMS: 5000, // 5초로 단축 (빠른 실패)
      connectTimeoutMS: 5000, // 5초로 단축
      socketTimeoutMS: 5000, // 소켓 타임아웃 추가
      maxPoolSize: 1, // 서버리스 환경에서는 연결 풀 크기 최소화
    };
    
    const conn = await mongoose.connect(mongoURI, options);
    console.log(`✅ MongoDB 연결 성공: ${conn.connection.host}`);
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
    // MongoDB 연결 실패해도 서버는 계속 실행 (개발 환경)
    return false;
  }
};

module.exports = { connectDB };

