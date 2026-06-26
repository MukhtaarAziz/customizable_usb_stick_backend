import { Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHdd, faGamepad, faMapMarkerAlt, faCode } from '@fortawesome/free-solid-svg-icons'
import './OrderReceipt.css'

function OrderReceipt({ selectedUsb, selectedItems, totalItemsSize, locale, langText }) {
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
            <span className="text-info fw-bold">{totalItemsSize.toFixed(1)} GB</span>
          </div>

          <div className="receipt-item">
            <span className="text-muted">{langText.capacityUsed}</span>
            <span>{Math.round((totalItemsSize / (selectedUsb?.size_gb || 1)) * 100)}%</span>
          </div>

          <div className="receipt-item total">
            <span>{locale === 'ar' ? 'السعر الإجمالي' : 'Total Price'}</span>
            <span className="receipt-price">
              {selectedUsb?.price_iqd ? `${selectedUsb.price_iqd.toLocaleString()} IQD` : (locale === 'ar' ? 'غير محدد' : 'N/A')}
            </span>
          </div>
        </div>

        <h6 className="fw-bold mt-4 mb-2">
          {locale === 'ar' ? 'قائمة العناصر المضمنة' : 'Included Items'} ({selectedItems.length})
        </h6>
        <div className="receipt-games-list" style={{ maxHeight: '250px' }}>
          {selectedItems.map((item, index) => {
            const isGame = item.type === 'game'
            return (
              <div key={`${item.type}-${item.id}`} className="receipt-game-item">
                <span className="receipt-game-number">{index + 1}.</span>
                <span className="receipt-game-name flex-grow-1">
                  {locale === 'ar' ? item.name_ar || item.name_en : item.name_en || item.name_ar}
                </span>
                <Badge bg={isGame ? 'primary' : 'indigo'} className="me-1 py-0 px-1" style={isGame ? {} : { background: '#6366f1' }}>
                  <FontAwesomeIcon icon={isGame ? faGamepad : faCode} className="me-1" />
                  {isGame ? (locale === 'ar' ? 'لعبة' : 'Game') : (locale === 'ar' ? 'برنامج' : 'App')}
                </Badge>
                <span className="receipt-game-size text-muted ms-2">
                  {Number(item.size_gb).toFixed(1)} GB
                </span>
              </div>
            )
          })}
        </div>
      </Card.Body>
    </Card>
  )
}

export default OrderReceipt
