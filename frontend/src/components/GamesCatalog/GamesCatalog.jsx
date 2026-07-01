import { useState } from 'react'
import { Row, Col, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faList, faLayerGroup, faFolderOpen, faGamepad, faCode } from '@fortawesome/free-solid-svg-icons'
import GameCard from '../GameCard/GameCard.jsx'
import CustomPagination from '../CustomPagination/CustomPagination.jsx'
import CustomDropdown from '../CustomDropdown/CustomDropdown.jsx'
import { PER_PAGE_OPTIONS } from '../../config'
import './GamesCatalog.css'

function GamesCatalog({
  items,
  loading,
  error,
  search,
  catalogType,
  platformId,
  categoryId,
  perPage,
  page,
  meta,
  platforms,
  categories,
  viewMode,
  selectedIds,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onTypeChange,
  onPlatformChange,
  onCategoryChange,
  onPerPageChange,
  onPageChange,
  onViewModeChange,
  onViewItemDetails,
  onAddItem,
  locale
}) {
  const typeOptions = [
    { value: 'all', labelEn: 'All', labelAr: 'الكل', icon: null },
    { value: 'game', labelEn: 'Games', labelAr: 'ألعاب', icon: faGamepad },
    { value: 'program', labelEn: 'Programs', labelAr: 'برامج', icon: faCode },
  ]

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">
          {locale === 'ar' ? 'جارٍ تحميل العناصر...' : 'Loading items...'}
        </p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  const filteredCategories = catalogType === 'all'
    ? categories
    : categories.filter(c => c.type === catalogType)

  const visibleItems = items.filter((item) => item.active !== false)

  return (
    <div className="games-catalog">
      {/* Filters */}
      <div className="games-catalog__filters mb-4">
        <Row className="g-3">
          <Col xs={12} md={3}>
            <div className="gc-search-row">
              <div className="gc-search">
                <span className="gc-search__icon">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  className="gc-search__input"
                  type="text"
                  placeholder={locale === 'ar' ? 'ابحث بالاسم...' : 'Search by name...'}
                  value={search}
                  onChange={onSearchChange}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onSearchSubmit?.() } }}
                />
                {search && (
                  <button className="gc-search__clear" onClick={onSearchClear} type="button" aria-label="Clear search">
                    ✕
                  </button>
                )}
              </div>
              <button className="gc-search-btn" onClick={onSearchSubmit} type="button" aria-label="Search">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </Col>

          <Col xs={12} md={3}>
            <CustomDropdown
              icon={faFilter}
              placeholder={locale === 'ar' ? 'كل الأنواع' : 'All types'}
              value={catalogType}
              onChange={onTypeChange}
              locale={locale}
              options={typeOptions.map(o => ({ value: o.value, label: locale === 'ar' ? o.labelAr : o.labelEn }))}
            />
          </Col>

          <Col xs={12} md={3}>
            <CustomDropdown
              icon={faFilter}
              placeholder={locale === 'ar' ? 'كل المنصات' : 'All platforms'}
              value={platformId}
              onChange={onPlatformChange}
              locale={locale}
              options={[
                { value: '', label: locale === 'ar' ? 'الكل' : 'All' },
                ...platforms.map(p => ({ value: String(p.id), label: locale === 'ar' ? p.name_ar || p.name_en : p.name_en || p.name_ar })),
              ]}
            />
          </Col>

          <Col xs={12} md={3}>
            <CustomDropdown
              icon={faList}
              placeholder={locale === 'ar' ? 'كل التصنيفات' : 'All categories'}
              value={categoryId}
              onChange={onCategoryChange}
              locale={locale}
              options={[
                { value: '', label: locale === 'ar' ? 'الكل' : 'All' },
                ...filteredCategories.map(c => ({
                  value: String(c.id),
                  label: `${locale === 'ar' ? c.name_ar || c.name_en : c.name_en || c.name_ar}${catalogType === 'all' ? ` [${c.type === 'game' ? (locale === 'ar' ? 'لعبة' : 'Game') : (locale === 'ar' ? 'برنامج' : 'App')}]` : ''}`,
                })),
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Items Grid */}
      {visibleItems.length === 0 ? (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faFolderOpen} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
          <h5>{locale === 'ar' ? 'لم يتم العثور على عناصر' : 'No items found'}</h5>
        </div>
      ) : (
        <Row xs={1} md={viewMode === 'grid' ? 2 : 1} lg={viewMode === 'grid' ? 3 : 1} className="g-4">
          {visibleItems.map((item) => (
            <Col key={`${item.type}-${item.id}`}>
              <GameCard
                item={item}
                locale={locale}
                viewMode={viewMode}
                onView={onViewItemDetails}
                onAdd={onAddItem}
                added={selectedIds.includes(`${item.type}-${item.id}`)}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Bottom Controls */}
      <div className="games-catalog__controls d-flex flex-row justify-content-between align-items-center mt-4 gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small text-nowrap">{locale === 'ar' ? 'عرض' : 'Show'}</span>
          <div style={{ width: '90px' }}>
            <CustomDropdown
              value={perPage}
              onChange={onPerPageChange}
              locale={locale}
              options={PER_PAGE_OPTIONS.map(n => ({ value: String(n), label: String(n) }))}
            />
          </div>
        </div>

        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-mode-toggle__btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => onViewModeChange('grid')}
            aria-label="Grid view"
            title={locale === 'ar' ? 'عرض شبكة' : 'Grid view'}
          >
            <FontAwesomeIcon icon={faLayerGroup} />
          </button>
          <button
            type="button"
            className={`view-mode-toggle__btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => onViewModeChange('list')}
            aria-label="List view"
            title={locale === 'ar' ? 'عرض قائمة' : 'List view'}
          >
            <FontAwesomeIcon icon={faList} />
          </button>
        </div>
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <CustomPagination
          page={page}
          lastPage={meta.last_page}
          onPageChange={onPageChange}
          locale={locale}
        />
      )}
    </div>
  )
}

export default GamesCatalog
