// Pagination.jsx
import React from 'react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages === 0) return null

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
  }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
      >
        이전
      </button>

      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1
        return (
          <button
            key={pageNum}
            onClick={() => goToPage(pageNum)}
            className={`px-3 py-1 rounded border ${
              pageNum === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
            }`}
          >
            {pageNum}
          </button>
        )
      })}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
      >
        다음
      </button>
    </div>
  )
}
