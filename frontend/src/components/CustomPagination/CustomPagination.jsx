import React from 'react'
import { Pagination } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons'
import './CustomPagination.css'

export default function CustomPagination({ page, lastPage, onPageChange, locale }) {
  if (!lastPage || lastPage <= 1) return null

  const isRtl = locale === 'ar'

  // Decide arrow icons dynamically based on direction
  const iconFirst = isRtl ? faAngleDoubleRight : faAngleDoubleLeft
  const iconPrev = isRtl ? faAngleRight : faAngleLeft
  const iconNext = isRtl ? faAngleLeft : faAngleRight
  const iconLast = isRtl ? faAngleDoubleLeft : faAngleDoubleRight

  const items = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1)

  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  if (startPage > 1) {
    items.push(
      <Pagination.Item key={1} active={page === 1} onClick={() => onPageChange(1)}>
        1
      </Pagination.Item>
    )
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />)
    }
  }

  for (let pageIndex = startPage; pageIndex <= endPage; pageIndex += 1) {
    items.push(
      <Pagination.Item key={pageIndex} active={pageIndex === page} onClick={() => onPageChange(pageIndex)}>
        {pageIndex}
      </Pagination.Item>
    )
  }

  if (endPage < lastPage) {
    if (endPage < lastPage - 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />)
    }
    items.push(
      <Pagination.Item key={lastPage} active={page === lastPage} onClick={() => onPageChange(lastPage)}>
        {lastPage}
      </Pagination.Item>
    )
  }

  return (
    <div
      className="custom-pagination-container"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ direction: isRtl ? 'rtl' : 'ltr', textAlign: 'center' }}
    >
      <Pagination className="custom-pagination">
        {/* First Page */}
        <Pagination.Item 
          disabled={page === 1} 
          onClick={() => onPageChange(1)}
          aria-label="First page"
          className="custom-pagination__arrow"
        >
          <FontAwesomeIcon icon={iconFirst} />
        </Pagination.Item>

        {/* Previous Page */}
        <Pagination.Item 
          disabled={page === 1} 
          onClick={() => onPageChange(Math.max(1, page - 1))}
          aria-label="Previous page"
          className="custom-pagination__arrow"
        >
          <FontAwesomeIcon icon={iconPrev} />
        </Pagination.Item>

        {/* Page Numbers */}
        {items}

        {/* Next Page */}
        <Pagination.Item 
          disabled={page === lastPage} 
          onClick={() => onPageChange(Math.min(lastPage, page + 1))}
          aria-label="Next page"
          className="custom-pagination__arrow"
        >
          <FontAwesomeIcon icon={iconNext} />
        </Pagination.Item>

        {/* Last Page */}
        <Pagination.Item 
          disabled={page === lastPage} 
          onClick={() => onPageChange(lastPage)}
          aria-label="Last page"
          className="custom-pagination__arrow"
        >
          <FontAwesomeIcon icon={iconLast} />
        </Pagination.Item>
      </Pagination>
    </div>
  )
}
