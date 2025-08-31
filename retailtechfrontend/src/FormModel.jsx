import React, { useState, useEffect } from 'react';

const FormModal = ({ show, onClose, type, onSubmit, customers, products, loading }) => {
  const [formData, setFormData] = useState({});
  const [saleItems, setSaleItems] = useState([{ productId: '', qty: 1 }]);

  useEffect(() => {
    if (show) {
      setFormData({});
      setSaleItems([{ productId: '', qty: 1 }]);
    }
  }, [show, type]);

  if (!show) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleSaleItemChange = (index, field, value) => {
    const updatedItems = [...saleItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'qty' ? Number(value) : Number(value)
    };
    setSaleItems(updatedItems);
  };

  const addSaleItem = () => {
    setSaleItems([...saleItems, { productId: '', qty: 1 }]);
  };

  const removeSaleItem = (index) => {
    if (saleItems.length > 1) {
      setSaleItems(saleItems.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (type === 'sales') {
      const validItems = saleItems.filter(item => item.productId && item.qty > 0);
      if (validItems.length === 0) {
        alert('Please add at least one valid item');
        return;
      }
      onSubmit({
        customerId: Number(formData.customerId),
        items: validItems
      });
    } else {
      onSubmit(formData);
    }
  };

  const renderCustomerForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Customer Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter customer name"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter email address"
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-submit">
          {loading ? 'Adding...' : 'Add Customer'}
        </button>
      </div>
    </form>
  );

  const renderProductForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          required
          placeholder="Enter product name"
        />
      </div>
      <div className="form-group">
        <label>Price (₹)</label>
        <input
          type="number"
          name="price"
          value={formData.price || ''}
          onChange={handleInputChange}
          required
          min="0"
          step="0.01"
          placeholder="Enter price"
        />
      </div>
      <div className="form-group">
        <label>Stock Quantity</label>
        <input
          type="number"
          name="stock"
          value={formData.stock || ''}
          onChange={handleInputChange}
          required
          min="0"
          placeholder="Enter stock quantity"
        />
      </div>
      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-submit">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </div>
    </form>
  );

  const renderSalesForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Customer</label>
        <select
          name="customerId"
          value={formData.customerId || ''}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} ({customer.email})
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Items</label>
        {saleItems.map((item, index) => (
          <div key={index} className="sale-item-row">
            <select
              value={item.productId}
              onChange={(e) => handleSaleItemChange(index, 'productId', e.target.value)}
              required
            >
              <option value="">Select product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price}) - Stock: {product.stock}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.qty}
              onChange={(e) => handleSaleItemChange(index, 'qty', e.target.value)}
              min="1"
              placeholder="Qty"
              required
            />
            {saleItems.length > 1 && (
              <button
                type="button"
                onClick={() => removeSaleItem(index)}
                className="btn btn-remove"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addSaleItem}
          className="btn btn-add-item"
        >
          + Add Item
        </button>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onClose} className="btn btn-cancel">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="btn btn-submit">
          {loading ? 'Creating...' : 'Create Sale'}
        </button>
      </div>
    </form>
  );

  const getFormTitle = () => {
    switch (type) {
      case 'customers':
        return '👥 Add New Customer';
      case 'products':
        return '📦 Add New Product';
      case 'sales':
        return '💰 Create New Sale';
      default:
        return 'Add New';
    }
  };

  const renderForm = () => {
    switch (type) {
      case 'customers':
        return renderCustomerForm();
      case 'products':
        return renderProductForm();
      case 'sales':
        return renderSalesForm();
      default:
        return <p>Invalid form type</p>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{getFormTitle()}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default FormModal;