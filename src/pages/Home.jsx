import Navbar from "../components/navbar/Navbar";
import EmptyState from "../components/EmptyState";
import { useInvoice } from "../context/InvoiceContext";
import Button from "../components/button/Button"
import InvoiceCard from "../components/InvoiceCard";
import FilterDropdown from "../components/filter/FilterDropdown";
import InvoiceForm from "../components/InvoiceForm";
import { useState } from "react";
export default function Home() {
  const { filteredInvoices, invoices } = useInvoice()
  const [isFormOpen, setIsFormOpen] = useState(false);
  return (
    <div className="min-h-screen bg-bg-body">
      <div className="lg:hidden">
        <Navbar />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* header */}
        <div className=" mb-10 flex items-center justify-between">
          {/* left */}
          <div>
            <h1 className="text-3xl font-bold 
            text-heading">
              Invoices
            </h1>
            <p className="color-body-text text-sm mt-1">
              {filteredInvoices.length === 0
                ? 'No invoices'
                : `There are ${filteredInvoices.length}
                total invoices`}
            </p>
          </div>
            
            {/* right */}
          <div className="flex items-center justify-center gap-6">
            <FilterDropdown />

            <Button variant="primary" prefix={true}
            onClick={() => setIsFormOpen(true)}
            >
              New Invoice
            </Button>
          </div>
        </div>

        {filteredInvoices.length === 0
          ? <EmptyState />
          : filteredInvoices.map(inv => (
            <InvoiceCard key={inv.id} invoice={inv} />
            ))
        }

        {isFormOpen && (
          <InvoiceForm onClose={() => setIsFormOpen(false)} />
        )}

      </div>
    </div>
  );
}