const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, showCancel = true }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg font-medium mb-4 text-black">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            확인
          </button>
          {showCancel && (
            <button
              onClick={onCancel}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              취소
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
