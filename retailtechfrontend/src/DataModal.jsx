import React from 'react';

const DataModal = ({ show, onClose, data, type }) => {
  if (!show) return null;

  const renderCustomers = () => (
    <div className="data-grid">
      {data.map(customer => (
        <div key={customer.id} className="data-card">
          <h4>Customer #{customer.id}</h4>
          <p><strong>Name:</strong> {customer.name}</p>
          <p><strong>Email:</strong> {customer.email}</p>
        </div>
      ))}
    </div>
  );

  const renderProducts = () => (
    <div className="data-grid">
      {data.map(product => (
        <div key={product.id} className="data-card">
          <h4>Product #{product.id}</h4>
          <p><strong>Name:</strong> {product.name}</p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          <p><strong>Stock:</strong> {product.stock} units</p>
        </div>
      ))}
    </div>
  );

  const renderSales = () => (
    <div className="data-grid">
      {data.map(sale => (
        <div key={sale.id} className="data-card">
          <h4>Sale #{sale.id}</h4>
          <p><strong>Customer:</strong> {sale.customerName}</p>
          <p><strong>Total:</strong> ₹{sale.total}</p>
          <p><strong>Date:</strong> {new Date(sale.timestamp).toLocaleDateString()}</p>
          <div className="sale-items">
            <strong>Items:</strong>
            {sale.items.map((item, idx) => (
              <div key={idx} className="sale-item">
                • {item.productName} (Qty: {item.qty}) - ₹{item.price * item.qty}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (data.length === 0) {
      return <p className="no-data">No {type} found.</p>;
    }

    switch (type) {
      case 'customers':
        return renderCustomers();
      case 'products':
        return renderProducts();
      case 'sales':
        return renderSales();
      default:
        return <p>Invalid data type</p>;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'customers':
        return '👥 Customer Details';
      case 'products':
        return '📦 Product Details';
      case 'sales':
        return '💰 Sales Details';
      default:
        return 'Details';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getTitle()}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DataModal;