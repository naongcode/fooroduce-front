const MessageModal = ({ isOpen, message, onClose}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-lg font-medium mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageModal;