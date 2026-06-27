import { useEffect, useMemo, useState } from 'react'
import { Modal, Button, Table, Form, Badge, Alert, Spinner } from 'react-bootstrap'

const TOKEN_KEY = 'authToken'
const GAME_CLASS = 'App\\Models\\Game'
const PROGRAM_CLASS = 'App\\Models\\Program'

function PackageItemsModal({ show, onHide, pkg, onChanged }) {
  const [items, setItems] = useState([])
  const [games, setGames] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState('game')
  const [selectedId, setSelectedId] = useState('')

  const token = localStorage.getItem(TOKEN_KEY)
  const authHeaders = { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' }

  const selectedSource = selectedType === 'game' ? games : programs

  const selectedName = useMemo(() => {
    const idNum = Number(selectedId)
    const found = selectedSource.find((x) => Number(x.id) === idNum)
    return found?.name_en || found?.name_ar || ''
  }, [selectedId, selectedSource])

  const loadAll = async () => {
    if (!pkg?.id) return
    setLoading(true)
    setError(null)
    try {
      const [itemsRes, gamesRes, programsRes] = await Promise.all([
        fetch(`/api/packages/${pkg.id}/items`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/games?per_page=100&show_all=1', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/programs?per_page=100&show_all=1', { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (!itemsRes.ok) throw new Error('Failed to load package items')
      if (!gamesRes.ok) throw new Error('Failed to load games')
      if (!programsRes.ok) throw new Error('Failed to load programs')

      const [itemsJson, gamesJson, programsJson] = await Promise.all([
        itemsRes.json(),
        gamesRes.json(),
        programsRes.json(),
      ])

      setItems(Array.isArray(itemsJson) ? itemsJson : (itemsJson.data ?? []))
      setGames(gamesJson.data ?? gamesJson ?? [])
      setPrograms(programsJson.data ?? programsJson ?? [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!show) return
    loadAll()
  }, [show, pkg?.id])

  const handleAdd = async () => {
    if (!pkg?.id || !selectedId) return
    setSaving(true)
    setError(null)
    try {
      const payload = {
        itemable_type: selectedType === 'game' ? GAME_CLASS : PROGRAM_CLASS,
        itemable_id: Number(selectedId),
      }
      const res = await fetch(`/api/packages/${pkg.id}/items`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add item')
      setSelectedId('')
      await loadAll()
      onChanged?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async (itemId) => {
    if (!pkg?.id) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/packages/${pkg.id}/items/${itemId}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      if (!res.ok) throw new Error('Failed to remove item')
      await loadAll()
      onChanged?.()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Manage Package Items {pkg ? `- ${pkg.name_en}` : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <div className="row g-2 align-items-end mb-3">
          <div className="col-md-3">
            <Form.Label>Type</Form.Label>
            <Form.Select value={selectedType} onChange={(e) => { setSelectedType(e.target.value); setSelectedId('') }}>
              <option value="game">Game</option>
              <option value="program">Program</option>
            </Form.Select>
          </div>
          <div className="col-md-7">
            <Form.Label>Select item</Form.Label>
            <Form.Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Select...</option>
              {selectedSource.map((src) => (
                <option key={src.id} value={src.id}>{src.name_en} {src.name_ar ? `(${src.name_ar})` : ''}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-2 d-grid">
            <Button onClick={handleAdd} disabled={!selectedId || saving}>Add</Button>
          </div>
        </div>

        {selectedId && selectedName && (
          <div className="small text-muted mb-2">Selected: {selectedName}</div>
        )}

        {loading ? (
          <div className="text-center py-3"><Spinner animation="border" size="sm" /></div>
        ) : (
          <div className="table-responsive">
            <Table striped hover size="sm" className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Item</th>
                  <th style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-muted py-3">No items in this package.</td></tr>
                )}
                {items.map((item) => {
                  const isGame = String(item.itemable_type || '').includes('Game')
                  const title = item.itemable?.name_en || item.itemable?.name_ar || `#${item.itemable_id}`
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td><Badge bg={isGame ? 'primary' : 'success'}>{isGame ? 'Game' : 'Program'}</Badge></td>
                      <td>{title}</td>
                      <td>
                        <Button size="sm" variant="outline-danger" disabled={saving} onClick={() => handleRemove(item.id)}>Remove</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PackageItemsModal
