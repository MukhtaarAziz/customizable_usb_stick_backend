import { Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faGamepad, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import './OrderReceipt.css'

function OrderReceipt({ selectedUsb, selectedGames, totalGamesSize, locale, langText }) {
  return (
    <Card className="order-receipt-card h-100">
      <Card.Body className="p-4">
        <h5 className="fw-bold mb-3 pb-2 border-bottom">{langText.receiptTitle}</h5>
        
        <div className="order-receipt">
          <div className="receipt-item">
            <span className="text-muted">{langText.stickLabel}</span>
            <span className="fw-bold">
              {selectedUsb ? (locale === 'ar' ? selectedUsb.name_ar || selectedUsb.name_en : selectedUsb.name_en || selectedUsb.name_ar) : ''}
            </span>
          </div>
          
          <div className="receipt-item">
            <span className="text-muted">{locale === 'ar' ? 'المنفذ' : 'Interface'}</span>
            <span>USB {selectedUsb?.interface || '3.0'}</span>
          </div>

          <div className="receipt-item">
            <span className="text-muted">{locale === 'ar' ? 'سعة الفلاشة' : 'USB Capacity'}</span>
            <span className="fw-bold">{selectedUsb?.size_gb} GB</span>
          </div>

          <div className="receipt-item">
            <span className="text-muted">{langText.totalSize}</span>
            <span className="text-info fw-bold">{totalGamesSize.toFixed(1)} GB</span>
          </div>

          <div className="receipt-item">
            <span className="text-muted">{langText.capacityUsed}</span>
            <span>{Math.round((totalGamesSize / (selectedUsb?.size_gb || 1)) * 100)}%</span>
          </div>

          <div className="receipt-item total">
            <span>{locale === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</span>
            <span className="receipt-price">
              {selectedUsb?.price_iqd ? `${selectedUsb.price_iqd.toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
            </span>
          </div>
        </div>

        <h6 className="fw-bold mt-4 mb-2">
          {locale === 'ar' ? 'قائمة الألعاب المضمنة' : 'Included Games'} ({selectedGames.length})
        </h6>
        <div className="receipt-games-list" style={{ maxHeight: '250px' }}>
          {selectedGames.map((game, index) => (
            <div key={game.id} className="receipt-game-item">
              <span className="receipt-game-number">{index + 1}.</span>
              <span className="receipt-game-name flex-grow-1">
                {locale === 'ar' ? game.name_ar || game.name_en : game.name_en || game.name_ar}
              </span>
              <span className="receipt-game-size text-muted">
                {Number(game.size_gb).toFixed(1)} GB
              </span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  )
}

export default OrderReceipt