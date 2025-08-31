import React, { useState, useEffect } from 'react';
import { api } from './api';
import FormModal from './FormModel';
import DataModal from './DataModal';
import './App.css';

const App = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  
  const [showDataModal, setShowDataModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [currentType, setCurrentType] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [customersRes, productsRes, salesRes] = await Promise.all([
        api.get('/customers'),
        api.get('/products'),
        api.get('/sales')
      ]);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please check your connection.');
    }
  };

  const handleShowData = (type) => {
    let data = [];
    switch (type) {
      case 'customers':
        data = customers;
        break;
      case 'products':
        data = products;
        break;
      case 'sales':
        // Enhance sales data with customer and product names
        data = sales.map(sale => {
          const customer = customers.find(c => c.id === sale.customerId);
          const enhancedItems = sale.items.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              ...item,
              productName: product ? product.name : 'Unknown Product',
              price: product ? product.price : 0
            };
          });
          return {
            ...sale,
            customerName: customer ? customer.name : 'Unknown Customer',
            items: enhancedItems
          };
        });
        break;
      default:
        data = [];
    }
    setCurrentData(data);
    setCurrentType(type);
    setShowDataModal(true);
  };

  const handleAddNew = (type) => {
    setCurrentType(type);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      let response;
      switch (currentType) {
        case 'customers':
          response = await api.post('/customers', formData);
          setCustomers([...customers, response.data]);
          break;
        case 'products':
          response = await api.post('/products', formData);
          setProducts([...products, response.data]);
          break;
        case 'sales':
          response = await api.post('/sales', formData);
          setSales([...sales, response.data]);
          // Refresh products to update stock
          const productsRes = await api.get('/products');
          setProducts(productsRes.data);
          break;
      }
      setShowFormModal(false);
      alert(`${currentType.slice(0, -1)} added successfully!`);
    } catch (error) {
      console.error('Error adding data:', error);
      alert(error.response?.data?.error || 'Error adding data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏪 Store Management System</h1>
        <p>Manage your customers, products, and sales efficiently</p>
      </header>

      <main className="main-content">
        {/* Customers Section */}
        <section className="section">
          <div className="section-header">
            <h2>👥 Customers</h2>
            <p>Manage customer information</p>
          </div>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => handleShowData('customers')}
            >
              📋 Show Customer Details
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleAddNew('customers')}
            >
              ➕ Add New Customer
            </button>
          </div>
        </section>

        {/* Products Section */}
        <section className="section">
          <div className="section-header">
            <h2>📦 Products</h2>
            <p>Manage product inventory</p>
          </div>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => handleShowData('products')}
            >
              📋 Show Product Details
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleAddNew('products')}
            >
              ➕ Add New Product
            </button>
          </div>
        </section>

        {/* Sales Section */}
        <section className="section">
          <div className="section-header">
            <h2>💰 Sales</h2>
            <p>Track and create sales transactions</p>
          </div>
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={() => handleShowData('sales')}
            >
              📋 Show Sales Details
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleAddNew('sales')}
            >
              ➕ Add New Sale
            </button>
          </div>
        </section>
      </main>

      {/* Modals */}
      <DataModal 
        show={showDataModal}
        onClose={() => setShowDataModal(false)}
        data={currentData}
        type={currentType}
      />
      
      <FormModal 
        show={showFormModal}
        onClose={() => setShowFormModal(false)}
        type={currentType}
        onSubmit={handleFormSubmit}
        customers={customers}
        products={products}
        loading={loading}
      />
    </div>
  );
};

export default App;