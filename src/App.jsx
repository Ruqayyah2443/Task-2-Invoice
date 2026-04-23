import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import InvoiceDetail from './pages/InvoiceDetail'
import ThemeProvider from './context/ThemeContext'
import InvoiceProvider from './context/InvoiceContext'
import Sidebar from './components/aside/Sidebar'
import './App.css'

export default function App(){
return (
  <ThemeProvider>
    <InvoiceProvider>
    <div className="min-h-screen bg-[var(--color-bg-body)]">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <main className="lg:ml-[103px]">
        <Routes>
          <Route path="/" 
          element={<Home />} />
          <Route path="invoice/:id" element=
          {<InvoiceDetail />} />
        </Routes>
       
       
      </main>
      
    </div>
    </InvoiceProvider>

  </ThemeProvider>

)
}