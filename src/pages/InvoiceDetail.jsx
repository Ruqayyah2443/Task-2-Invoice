import { useParams, useNavigate } from 'react-router-dom'
import { useInvoice } from '../context/InvoiceContext'
import { useState } from 'react'
import Button from '../components/button/Button'
import DeleteModal from '../components/deleteModal/DeleteModal'
import Navbar from '../components/navbar/Navbar'
import StatusBadge from '../components/statusbadge/StatusBadge'
import InvoiceForm from '../components/InvoiceForm'
import Arrowleft from '../assets/ArrowLeft.svg?react'

export default function InvoiceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { invoices, deleteInvoice, markAsPaid } = useInvoice()

  const invoice = invoices.find(inv => inv.id === id)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  // MUST return early — without return the rest of the component
  // still tries to render and crashes because invoice is undefined
  if (!invoice) {
    return (
      <div className="min-h-screen bg-bg-body flex items-center justify-center">
        <p className="text-body-text">Invoice not found</p>
      </div>
    )
  }

  // Format "2021-08-19" → "19 Aug 2021"
  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium'
    }).format(new Date(dateStr))
  }

  // Format 1800.9 → "£1,800.90"
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg-body">

      {/* Navbar — mobile and tablet only, hidden on desktop */}
      <div className="lg:hidden">
        <Navbar />
      </div>

      {/* Page content — this is OUTSIDE lg:hidden so it shows on ALL sizes */}
      <div className="max-w-3xl mx-auto px-6 py-14">

        {/* ── GO BACK ── */}
        <button
          onClick={() => navigate('/')}
          className="
            flex items-center gap-4 mb-8
            font-bold text-sm text-heading
            hover:text-body-text transition-colors
          "
        >
          <Arrowleft />
          Go back
        </button>

        {/* ── STATUS BAR ── */}
        <div className="
          bg-bg-card border border-line rounded-lg
          px-8 py-5 mb-6
          flex flex-col gap-4
          md:flex-row md:items-center md:justify-between
        ">
          {/* Left — status label + badge */}
          <div className="flex items-center gap-4">
            <span className="text-body-text text-sm">Status</span>
            <StatusBadge status={invoice.status} />
          </div>

          {/* Right — action buttons */}
          <div className="flex items-center gap-2">

            {/* Edit — hidden when invoice is already paid */}
            {invoice.status !== 'paid' && (
              <Button
                variant="edit"
                onClick={() => setShowEditForm(true)}
              >
                Edit
              </Button>
            )}

            {/* Delete — always visible */}
            <Button
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>

            {/* Mark as Paid — only when status is pending */}
            {invoice.status === 'pending' && (
              <Button
                variant="primary"
                onClick={() => markAsPaid(invoice.id)}
              >
                Mark as Paid
              </Button>
            )}

          </div>
        </div>

        {/* ── INVOICE INFO CARD ── */}
        <div className="bg-bg-card border border-line rounded-lg p-8">

          {/* TOP — ID + description on left, sender address on right */}
          <div className="flex flex-col gap-1 md:flex-row md:justify-between mb-10">
            <div>
              <h2 className="font-bold text-base text-heading">
                <span className="text-purple">#</span>
                {invoice.id}
              </h2>
              <p className="text-body-text text-sm mt-1">
                {invoice.description}
              </p>
            </div>
            <div className="text-sm text-body-text md:text-right mt-4 md:mt-0">
              <p>{invoice.senderAddress.street}</p>
              <p>{invoice.senderAddress.city}</p>
              <p>{invoice.senderAddress.postCode}</p>
              <p>{invoice.senderAddress.country}</p>
            </div>
          </div>

          {/* MIDDLE — dates, client info, email */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10">

            {/* Column 1 — invoice date + payment due */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-body-text text-sm mb-2">Invoice Date</p>
                <p className="font-bold text-sm text-heading">
                  {formatDate(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-body-text text-sm mb-2">Payment Due</p>
                <p className="font-bold text-sm text-heading">
                  {formatDate(invoice.paymentDue)}
                </p>
              </div>
            </div>

            {/* Column 2 — bill to */}
            <div>
              <p className="text-body-text text-sm mb-2">Bill To</p>
              <p className="font-bold text-sm text-heading mb-2">
                {invoice.clientName}
              </p>
              <div className="text-sm text-body-text">
                <p>{invoice.clientAddress.street}</p>
                <p>{invoice.clientAddress.city}</p>
                <p>{invoice.clientAddress.postCode}</p>
                <p>{invoice.clientAddress.country}</p>
              </div>
            </div>

            {/* Column 3 — sent to (email) */}
            <div>
              <p className="text-body-text text-sm mb-2">Sent To</p>
              <p className="font-bold text-sm text-heading break-all">
                {invoice.clientEmail}
              </p>
            </div>

          </div>

          {/* BOTTOM — items table + grand total */}
          <div className="rounded-lg overflow-hidden">

            {/* Items area — light gray background */}
            <div className="bg-[#F9FAFE] dark:bg-[#252945] p-8">

              {/* Table headers — desktop only */}
              <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
                <p className="text-body-text text-sm">Item Name</p>
                <p className="text-body-text text-sm text-center">QTY.</p>
                <p className="text-body-text text-sm text-right">Price</p>
                <p className="text-body-text text-sm text-right">Total</p>
              </div>

              {/* Each item */}
              {invoice.items.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex justify-between items-center mb-4
                    md:grid md:grid-cols-4 md:gap-4
                  "
                >
                  {/* Name + mobile qty x price */}
                  <div>
                    <p className="font-bold text-sm text-heading">
                      {item.name}
                    </p>
                    {/* Only visible on mobile */}
                    <p className="text-body-text text-sm md:hidden">
                      {item.quantity} x {formatAmount(item.price)}
                    </p>
                  </div>

                  {/* Qty — desktop only */}
                  <p className="hidden md:block font-bold text-sm text-body-text text-center">
                    {item.quantity}
                  </p>

                  {/* Price — desktop only */}
                  <p className="hidden md:block text-sm text-body-text text-right">
                    {formatAmount(item.price)}
                  </p>

                  {/* Total — always visible */}
                  <p className="font-bold text-sm text-heading text-right">
                    {formatAmount(item.total)}
                  </p>
                </div>
              ))}
            </div>

            {/* Grand total bar — dark background */}
            <div className="
              bg-[#373B53] dark:bg-[#0C0E16]
              p-8 flex items-center justify-between
            ">
              <p className="text-white text-sm">Amount Due</p>
              <p className="text-white font-bold text-2xl">
                {formatAmount(invoice.total)}
              </p>
            </div>

          </div>
        </div>
        {/* end invoice info card */}

      </div>

      {/* ── DELETE MODAL ── */}
      {showDeleteModal && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* ── EDIT FORM ── */}
      {/* Passes invoice prop so InvoiceForm knows it is in edit mode */}
      {showEditForm && (
        <InvoiceForm
          invoice={invoice}
          onClose={() => setShowEditForm(false)}
        />
      )}

    </div>
  )
}