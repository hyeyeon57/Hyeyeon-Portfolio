'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projects as initialProjects } from '@/data/portfolio';
import { Project } from '@/types/portfolio';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { Edit3, Trash2, Plus, Eye, Star, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    if (typeof window !== 'undefined') {
      loadProjects();
    } else {
      setLoading(false);
    }
  }, []);

  const loadProjects = () => {
    try {
      if (typeof window === 'undefined') return;
      
      const savedProjects = localStorage.getItem('customProjects');
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        setProjects(parsed);
      } else {
        // 초기 데이터를 localStorage에 저장
        localStorage.setItem('customProjects', JSON.stringify(initialProjects));
        setProjects(initialProjects);
      }
    } catch (error) {
      console.error('프로젝트 로드 오류:', error);
      setProjects(initialProjects);
    } finally {
      setLoading(false);
    }
  };

  const saveProjects = (newProjects: Project[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customProjects', JSON.stringify(newProjects));
    }
    setProjects(newProjects);
  };

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      fullDescription: projectData.fullDescription || projectData.description,
      achievements: projectData.achievements || [],
      featured: false,
    };
    const updatedProjects = [...projects, newProject];
    saveProjects(updatedProjects);
    setShowAddModal(false);
    alert('프로젝트가 추가되었습니다!');
  };

  const handleEditProject = (projectData: Project | Omit<Project, 'id'>) => {
    if (!editingProject) return;
    
    // projectData에 id가 있으면 사용, 없으면 editingProject의 id 사용
    const projectId = 'id' in projectData && projectData.id ? projectData.id : editingProject.id;
    
    const updatedProject: Project = {
      ...editingProject,
      ...projectData,
      id: projectId,
    };
    
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id ? updatedProject : p
    );
    saveProjects(updatedProjects);
    setShowEditModal(false);
    setEditingProject(null);
    alert('프로젝트가 수정되었습니다!');
  };

  const handleDeleteProject = (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
    alert('프로젝트가 삭제되었습니다!');
  };

  const handleToggleFeatured = (id: string) => {
    const updatedProjects = projects.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    saveProjects(updatedProjects);
  };

  const handleViewDetail = (project: Project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const categoryLabels: Record<string, string> = {
    'new': '신규',
    'renewal': '리뉴얼',
    'app': '앱',
    'web': '웹',
    'proposal': '기획안',
    'usability': '사용성평가',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
              <p className="text-gray-500 mt-1">BO화면</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                홈으로
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={16} />
                새 프로젝트
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 통계 카드 */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">총 프로젝트</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">대표 프로젝트</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {projects.filter(p => p.featured).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">카테고리</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {new Set(projects.map(p => p.category)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏷️</span>
              </div>
            </div>
          </div>
        </div>

        {/* 프로젝트 목록 */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">프로젝트 목록</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">카테고리</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">태그</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">대표</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <p className="text-4xl mb-4">📦</p>
                        <p className="text-lg">프로젝트가 없습니다</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
                        >
                          첫 프로젝트를 만들어보세요 →
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.subtitle}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {categoryLabels[project.category] || project.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 2 && (
                            <span className="px-2 py-1 text-xs text-gray-400">
                              +{project.tags.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className="text-2xl hover:scale-110 transition-transform"
                          title={project.featured ? '대표 프로젝트 해제' : '대표 프로젝트로 설정'}
                        >
                          {project.featured ? (
                            <Star className="w-6 h-6 text-yellow-500" fill="currentColor" />
                          ) : (
                            <Star className="w-6 h-6 text-gray-300" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewDetail(project)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="상세 보기"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="수정"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 프로젝트 상세 모달 */}
      <AnimatePresence>
        {showDetailModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">부제목</h3>
                  <p className="text-lg text-gray-900">{selectedProject.subtitle}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">설명</h3>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>

                {selectedProject.fullDescription && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">상세 설명</h3>
                    <p className="text-gray-700 whitespace-pre-line">{selectedProject.fullDescription}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">카테고리</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {categoryLabels[selectedProject.category] || selectedProject.category}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">날짜</h3>
                    <p className="text-gray-700">{selectedProject.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">역할</h3>
                    <p className="text-gray-700">{selectedProject.role}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">기간</h3>
                    <p className="text-gray-700">{selectedProject.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">팀 구성</h3>
                    <p className="text-gray-700">{selectedProject.team}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">대표 프로젝트</h3>
                    <p className="text-gray-700">{selectedProject.featured ? '✓ 예' : '✗ 아니오'}</p>
                  </div>
                </div>

                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">태그</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.achievements && selectedProject.achievements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">주요 성과</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {selectedProject.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.link && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">링크</h3>
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedProject.link}
                    </a>
                  </div>
                )}

                {selectedProject.image && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">이미지</h3>
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEdit(selectedProject);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  수정하기
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 프로젝트 추가 모달 */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">새 프로젝트 추가</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <ProjectForm
                  onSave={handleAddProject}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 프로젝트 수정 모달 */}
      <AnimatePresence>
        {showEditModal && editingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowEditModal(false);
              setEditingProject(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">프로젝트 수정</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                <ProjectForm
                  project={editingProject}
                  onSave={handleEditProject}
                  onCancel={() => {
                    setShowEditModal(false);
                    setEditingProject(null);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
