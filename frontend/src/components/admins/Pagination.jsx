const PER_PAGE_OPTIONS = [10, 15, 25, 50, 100]

function Pagination({ currentPage, lastPage, total, perPage, onPageChange, onPerPageChange }) {
  const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1
  const to = Math.min(currentPage * perPage, total)

  const getPages = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(lastPage, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < lastPage) {
      if (end < lastPage - 1) pages.push('...')
      pages.push(lastPage)
    }

    return pages
  }

  return (
    <div className="admin-pagination-wrapper">
      <div className="admin-pagination-left">
        <span className="admin-pagination-info">
          {from}–{to} of {total}
        </span>
        <label className="admin-pagination-per-page">
          Per page
          <select
            className="admin-pagination-select"
            value={perPage}
            onChange={e => onPerPageChange(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>

      {lastPage > 1 && (
        <div className="admin-pagination-buttons">
          <button
            className="admin-pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            ‹
          </button>

          {getPages().map((page, i) =>
            page === '...' ? (
              <span key={`e-${i}`} className="admin-pagination-ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`admin-pagination-btn ${page === currentPage ? 'admin-pagination-btn--active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}

          <button
            className="admin-pagination-btn"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Pagination
