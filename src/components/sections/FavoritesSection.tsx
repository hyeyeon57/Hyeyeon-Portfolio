'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Navigation } from 'lucide-react';

export const FavoritesSection: React.FC = () => {
  const favorites = [
    {
      id: 1,
      name: '집',
      address: '서울시 강남구 테헤란로 123',
      icon: '🏠',
      distance: '0.5km',
      estimatedTime: '2분'
    },
    {
      id: 2,
      name: '회사',
      address: '서울시 서초구 서초대로 456',
      icon: '🏢',
      distance: '3.2km',
      estimatedTime: '15분'
    },
    {
      id: 3,
      name: '카페',
      address: '서울시 홍대입구역 근처',
      icon: '☕',
      distance: '1.8km',
      estimatedTime: '8분'
    },
    {
      id: 4,
      name: '헬스장',
      address: '서울시 마포구 홍대역 789',
      icon: '💪',
      distance: '2.1km',
      estimatedTime: '10분'
    }
  ];

  return (
    <section id="favorites" className="py-20 bg-dark-bg">
      <div className="max-w-container mx-auto px-container-x">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Star className="text-point-yellow" size={32} />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              즐겨찾기 설정
            </h2>
          </div>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            자주 가는 장소를 등록하고 빠르게 경로를 확인하세요
          </p>
        </motion.div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((favorite, index) => (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="bg-dark-surface rounded-2xl p-6 border border-dark-border hover:border-point-yellow/50 transition-all duration-300 shadow-glow-yellow hover:shadow-glow-yellow-lg h-full">
                {/* Icon */}
                <div className="text-4xl mb-4 text-center">
                  {favorite.icon}
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-point-yellow transition-colors">
                    {favorite.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {favorite.address}
                  </p>

                  {/* Distance & Time */}
                  <div className="flex items-center justify-center gap-4 text-xs text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Navigation size={12} />
                      {favorite.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {favorite.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 text-center">
                  <button className="w-full px-4 py-2 bg-point-yellow/10 text-point-yellow rounded-xl hover:bg-point-yellow hover:text-dark-bg transition-all duration-300 font-semibold">
                    경로 보기
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add New Favorite */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-point-yellow to-point-yellow-dark text-dark-bg rounded-2xl font-semibold hover:from-point-yellow-light hover:to-point-yellow transition-all duration-300 shadow-glow-yellow">
            <MapPin size={20} />
            새로운 즐겨찾기 추가
          </button>
        </motion.div>
      </div>
    </section>
  );
};
