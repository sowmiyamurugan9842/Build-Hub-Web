import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StockProvider } from './store/StockContext.jsx'
import { CustomerProvider } from './store/CustomerContext.jsx'
import { CartProvider } from './store/CartContext.jsx'
import { OrdersProvider } from './store/OrdersContext.jsx'
import { AttendanceProvider } from './store/AttendanceContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StockProvider>
      <CustomerProvider>
        <OrdersProvider>
          <CartProvider>
            <AttendanceProvider>
              <App />
            </AttendanceProvider>
          </CartProvider>
        </OrdersProvider>
      </CustomerProvider>
    </StockProvider>
  </StrictMode>,
)
