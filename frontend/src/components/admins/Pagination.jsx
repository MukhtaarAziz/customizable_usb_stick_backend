import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import './Pagination.css'

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
    <div className="admin-pagination">
      <div className="admin-pagination__left">
        <span className="admin-pagination__info">
          {from}–{to} of {total}
        </span>
        <span className="admin-pagination__per-page">
          <label htmlFor="admin-per-page">Per page</label>
          <select
            id="admin-per-page"
            className="admin-pagination__select"
            value={perPage}
            onChange={e => onPerPageChange(Number(e.target.value))}
          >
            {PER_PAGE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </span>
      </div>
      {lastPage > 1 && (
        <div className="admin-pagination__buttons">
          <button
            className="admin-pagination__btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {getPages().map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="admin-pagination__ellipsis">...</span>
            ) : (
              <button
                key={page}
                className={`admin-pagination__btn admin-pagination__btn--page ${page === currentPage ? 'admin-pagination__btn--active' : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}
          <button
            className="admin-pagination__btn"
            disabled={currentPage >= lastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Pagination