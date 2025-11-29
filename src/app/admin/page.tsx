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
