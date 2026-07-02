import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faArrowRightFromBracket, faTimes } from '@fortawesome/free-solid-svg-icons'
import './LeaveConfirmationModal.css'

function LeaveConfirmationModal({ show, onHide, onConfirm, locale }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdropClassName="leave-modal-backdrop"
      contentClassName="leave-modal-content"
    >
      <div className="leave-modal-header">
        <div className="leave-modal-title">
          <span className="leave-modal-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </span>
          {locale === 'ar' ? 'تأكيد الخروج' : 'Leave Confirmation'}
        </div>
        <button className="leave-modal-close" onClick={onHide} aria-label={locale === 'ar' ? 'إغلاق' : 'Close'}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="leave-modal-body">
        <p className="leave-modal-message">
          {locale === 'ar'
            ? 'لديك تكوين USB نشط. سيؤدي مغادرة هذه الصفحة إلى مسح اختيارك. هل أنت متأكد أنك تريد المغادرة؟'
            : 'You have an active USB configuration. Leaving this page will clear your selection. Are you sure you want to leave?'}
        </p>
      </div>

      <div className="leave-modal-footer">
        <button className="leave-modal-btn leave-modal-btn--cancel" onClick={onHide}>
          {locale === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
        <button className="leave-modal-btn leave-modal-btn--leave" onClick={onConfirm}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          {locale === 'ar' ? 'مغادرة' : 'Leave'}
        </button>
      </div>
    </Modal>
  )
}

export default LeaveConfirmationModal
