const path = require('path');
const { existsSync, readFileSync } = require('fs');
const mongoose = require('mongoose');
const Project = require('../models/Project.cjs');
const { DATA_DIR } = require('../utils/pathHelpers.cjs');

const migrateStaticProjects = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️  MongoDB 연결되지 않음, 마이그레이션 건너뜀');
      return false;
    }

    const existingCount = await Project.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ MongoDB에 이미 ${existingCount}개의 프로젝트가 있습니다. 마이그레이션 건너뜀`);
      return true;
    }

    const projectsJsonPath = path.join(DATA_DIR, 'projects.json');
    if (!existsSync(projectsJsonPath)) {
      console.log('⚠️  data/projects.json 파일을 찾을 수 없습니다. 마이그레이션 건너뜀');
      return false;
    }

    const projectsData = JSON.parse(readFileSync(projectsJsonPath, 'utf-8'));
    if (projectsData.length === 0) {
      console.log('⚠️  마이그레이션할 프로젝트 데이터가 없습니다.');
      return false;
    }

    console.log(`\n📦 ${projectsData.length}개의 정적 프로젝트를 MongoDB로 마이그레이션합니다...\n`);

    let added = 0;
    let updated = 0;
    let skipped = 0;

    for (const projectData of projectsData) {
      try {
        const existing = await Project.findOne({ id: projectData.id });

        if (existing) {
          await Project.findOneAndUpdate(
            { id: projectData.id },
            projectData,
            { new: true, runValidators: true }
          );
          updated++;
        } else {
          await Project.create(projectData);
          added++;
        }
      } catch (error) {
        console.error(`❌ 프로젝트 "${projectData.title}" (ID: ${projectData.id}) 처리 실패:`, error.message);
        skipped++;
      }
    }

    console.log(`✨ 마이그레이션 완료! (추가: ${added}개, 업데이트: ${updated}개, 실패: ${skipped}개)\n`);
    return true;
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error.message);
    return false;
  }
};

module.exports = { migrateStaticProjects };
