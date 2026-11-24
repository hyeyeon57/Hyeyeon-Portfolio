const HeroSlider = require('../models/HeroSlider.cjs');

const listHeroSliders = async () => {
  try {
    const sliders = await HeroSlider.find({ active: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return {
      ok: true,
      data: sliders,
    };
  } catch (error) {
    console.error('[heroSliderService] 슬라이더 목록 조회 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더 목록을 불러오는데 실패했습니다.',
      status: 500,
    };
  }
};

const getAllHeroSliders = async () => {
  try {
    const sliders = await HeroSlider.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return {
      ok: true,
      data: sliders,
    };
  } catch (error) {
    console.error('[heroSliderService] 전체 슬라이더 목록 조회 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더 목록을 불러오는데 실패했습니다.',
      status: 500,
    };
  }
};

const getHeroSlider = async (id) => {
  try {
    const slider = await HeroSlider.findById(id).lean();
    
    if (!slider) {
      return {
        ok: false,
        message: '슬라이더를 찾을 수 없습니다.',
        status: 404,
      };
    }
    
    return {
      ok: true,
      data: slider,
    };
  } catch (error) {
    console.error('[heroSliderService] 슬라이더 조회 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더를 불러오는데 실패했습니다.',
      status: 500,
    };
  }
};

const createHeroSlider = async (data) => {
  try {
    // order가 없으면 최대값 + 1로 설정
    if (data.order === undefined || data.order === null) {
      const maxOrderSlider = await HeroSlider.findOne().sort({ order: -1 }).lean();
      data.order = maxOrderSlider ? (maxOrderSlider.order + 1) : 0;
    }
    
    const slider = new HeroSlider(data);
    await slider.save();
    
    return {
      ok: true,
      data: slider.toObject(),
    };
  } catch (error) {
    console.error('[heroSliderService] 슬라이더 생성 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더를 생성하는데 실패했습니다.',
      status: 500,
    };
  }
};

const updateHeroSlider = async (id, data) => {
  try {
    const slider = await HeroSlider.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    
    if (!slider) {
      return {
        ok: false,
        message: '슬라이더를 찾을 수 없습니다.',
        status: 404,
      };
    }
    
    return {
      ok: true,
      data: slider,
    };
  } catch (error) {
    console.error('[heroSliderService] 슬라이더 수정 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더를 수정하는데 실패했습니다.',
      status: 500,
    };
  }
};

const deleteHeroSlider = async (id) => {
  try {
    const slider = await HeroSlider.findByIdAndDelete(id).lean();
    
    if (!slider) {
      return {
        ok: false,
        message: '슬라이더를 찾을 수 없습니다.',
        status: 404,
      };
    }
    
    return {
      ok: true,
      data: slider,
    };
  } catch (error) {
    console.error('[heroSliderService] 슬라이더 삭제 실패:', error);
    return {
      ok: false,
      message: error.message || '슬라이더를 삭제하는데 실패했습니다.',
      status: 500,
    };
  }
};

module.exports = {
  listHeroSliders,
  getAllHeroSliders,
  getHeroSlider,
  createHeroSlider,
  updateHeroSlider,
  deleteHeroSlider,
};

