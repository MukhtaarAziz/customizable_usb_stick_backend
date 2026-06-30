import { Modal, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTriangleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons'

function ConfirmDeleteModal({ show, onHide, onConfirm, title, message, loading }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{title || 'Confirm Delete'}</Modal.Title>
        <button className="modal-close-btn" onClick={onHide} disabled={loading}>&times;</button>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <FontAwesomeIcon icon={faTriangleExclamation} className="text-danger mb-3" style={{ fontSize: '3rem' }} />
        <p className="mb-0">{message || 'Are you sure you want to delete this item? This action cannot be undone.'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide} disabled={loading}>Cancel</Button>
        <Button variant="danger" size="sm" onClick={onConfirm} disabled={loading}>
          {loading ? <><FontAwesomeIcon icon={faSpinner} spin className="me-1" />Deleting...</> : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmDeleteModal
