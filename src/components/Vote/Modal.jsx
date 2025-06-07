const VoteAfterModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg border-2 border-indigo-500 transform transition-all duration-300 animate-bounce">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-indigo-600 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-indigo-800 mb-2">투표 완료!</h3>
          <p className="text-gray-600">소중한 의견 감사합니다.</p>
        </div>
      </div>
    </div>
  )
}

export default VoteAfterModal
