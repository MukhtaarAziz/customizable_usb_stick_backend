import { useState } from 'react'
import { Row, Col, Form, InputGroup, Button, Spinner, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faFilter, faList, faLayerGroup, faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import GameCard from '../GameCard/GameCard.jsx'
import CustomPagination from '../CustomPagination/CustomPagination.jsx'
import { PER_PAGE_OPTIONS } from '../../config'
import './GamesCatalog.css'

function GamesCatalog({
  games,
  loading,
  error,
  search,
  platformId,
  categoryId,
  perPage,
  page,
  meta,
  platforms,
  categories,
  viewMode,
  selectedGameIds,
  onSearchChange,
  onPlatformChange,
  onCategoryChange,
  onPerPageChange,
  onPageChange,
  onViewModeChange,
  onViewGameDetails,
  onAddGame,
  locale
}) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">
          {locale === 'ar' ? 'جارٍ تحميل الألعاب...' : 'Loading games...'}
        </p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-5">
        <FontAwesomeIcon icon={faFolderOpen} className="text-muted mb-3" style={{ fontSize: '3rem' }} />
        <h5>{locale === 'ar' ? 'لم يتم العثور على ألعاب' : 'No games found'}</h5>
      </div>
    )
  }

  return (
    <div className="games-catalog">
      {/* Filters */}
      <div className="games-catalog__filters mb-4">
        <Row className="g-3">
          <Col xs={12} md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent">
                <FontAwesomeIcon icon={faSearch} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder={locale === 'ar' ? 'ابحث باسم اللعبة...' : 'Search by game name...'}
                value={search}
                onChange={onSearchChange}
              />
              {search && (
                <Button variant="outline-secondary" onClick={() => onSearchChange({ target: { value: '' } })}>
                  {locale === 'ar' ? 'مسح' : 'Clear'}
                </Button>
              )}
            </InputGroup>
          </Col>

          <Col xs={12} md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent">
                <FontAwesomeIcon icon={faFilter} className="text-muted" />
              </InputGroup.Text>
              <Form.Select value={platformId} onChange={onPlatformChange}>
                <option value="">{locale === 'ar' ? 'كل المنصات' : 'All platforms'}</option>
                {platforms.map((platform) => (
                  <option key={platform.id} value={platform.id}>
                    {locale === 'ar' ? platform.name_ar || platform.name_en : platform.name_en || platform.name_ar}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>

          <Col xs={12} md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent">
                <FontAwesomeIcon icon={faList} className="text-muted" />
              </InputGroup.Text>
              <Form.Select value={categoryId} onChange={onCategoryChange}>
                <option value="">{locale === 'ar' ? 'كل التصنيفات' : 'All categories'}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {locale === 'ar' ? category.name_ar || category.name_en : category.name_en || category.name_ar}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
      </div>

      {/* Games Grid */}
      <Row xs={1} md={viewMode === 'grid' ? 2 : 1} lg={viewMode === 'grid' ? 3 : 1} className="g-4">
        {games.map((game) => (
          <Col key={game.id}>
            <GameCard
              game={game}
              locale={locale}
              viewMode={viewMode}
              onView={onViewGameDetails}
              onAdd={onAddGame}
              added={selectedGameIds.includes(game.id)}
            />
          </Col>
        ))}
      </Row>

      {/* Bottom Controls */}
      <div className="games-catalog__controls d-flex flex-row justify-content-between align-items-center mt-4 gap-2">
        <Form.Group className="mb-0" style={{ minWidth: '130px' }}>
          <InputGroup size="sm">
            <InputGroup.Text className="bg-transparent text-muted small">
              {locale === 'ar' ? 'عرض' : 'Show'}
            </InputGroup.Text>
            <Form.Select value={perPage} onChange={onPerPageChange} size="sm">
              {PER_PAGE_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Form.Group>

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