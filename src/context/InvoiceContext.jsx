import { createContext, useContext, useState, useEffect} from 'react'
import generateId from '../utils/generateId'


const InvoiceContext = createContext()

export default function InvoiceProvider({ children }) {
        const [invoices, setInvoices] = useState(
    () => JSON.parse(localStorage.getItem('invoices') || '[]')
  )
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (data) =>
    setInvoices(prev => [{ ...data, id: generateId() }, ...prev])

  const updateInvoice = (id, data) =>
    setInvoices(prev =>
      prev.map(inv => (inv.id === id ? { ...inv, ...data } : inv))
    )

  const deleteInvoice = (id) =>
    setInvoices(prev => prev.filter(inv => inv.id !== id))

  const markAsPaid = (id) => updateInvoice(id, { status: 'paid' })

  const filteredInvoices =
    filter === 'all' ? invoices : invoices.filter(inv => inv.status === filter)

    return (
        <InvoiceContext.Provider
        value={{
            invoices,
            filteredInvoices,
            filter,
            setFilter,
            addInvoice,
            updateInvoice,
            deleteInvoice,
            markAsPaid,
        }}
        >
        {children}
        </InvoiceContext.Provider>
    )
    
}

export function useInvoice() {
    return useContext(InvoiceContext)
}