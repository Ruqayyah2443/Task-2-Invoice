import { useReducer } from 'react'
import { useInvoice } from '../context/InvoiceContext'
import Button from './button/Button'


const addDays = (dateStr, days) => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + Number(days))
  return date.toISOString().split('T')[0]
}

const today = new Date().toISOString().split('T')[0]
const emptyItem = { name: '', quantity: 1, price: 0, total: 0 }

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────
const getInitialState = (invoice) => ({
  senderStreet:  invoice?.senderAddress?.street   || '',
  senderCity:    invoice?.senderAddress?.city     || '',
  senderPost:    invoice?.senderAddress?.postCode || '',
  senderCountry: invoice?.senderAddress?.country  || '',
  clientName:    invoice?.clientName              || '',
  clientEmail:   invoice?.clientEmail             || '',
  clientStreet:  invoice?.clientAddress?.street   || '',
  clientCity:    invoice?.clientAddress?.city     || '',
  clientPost:    invoice?.clientAddress?.postCode || '',
  clientCountry: invoice?.clientAddress?.country  || '',
  invoiceDate:   invoice?.createdAt               || today,
  paymentTerms:  invoice?.paymentTerms            || 30,
  description:   invoice?.description             || '',
  items:         invoice?.items                   || [{ ...emptyItem }],
  errors:        {},
})

// ─── REDUCER 
function reducer(state, action) {
  switch (action.type) {

    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }

    case 'UPDATE_ITEM': {
      const newItems = state.items.map((item, i) => {
        if (i !== action.index) return item
        const updated = { ...item, [action.field]: action.value }
        // Always recalculate total when any item field changes
        // Number() converts string input values to numbers safely
        updated.total = Number(updated.quantity) * Number(updated.price)
        return updated
      })
      return { ...state, items: newItems }
    }

    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { ...emptyItem }] }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index),
      }

    case 'SET_ERRORS':
      return { ...state, errors: action.errors }

    default:
      return state
  }
}

// ─── FIELD COMPONENT 
function Field({ id, label, field, type = 'text', state, setField }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-xs text-body-text">
          {label}
        </label>
        {state.errors[field] && (
          <span className="text-xs text-[#EC5757]">
            {state.errors[field]}
          </span>
        )}
      </div>
      <input
        id={id}
        type={type}
        value={state[field]}
        onChange={e => setField(field, e.target.value)}
        className={`
          w-full px-4 py-3 rounded border font-bold text-sm
          bg-bg-card text-heading outline-none
          transition-colors duration-200 focus:border-purple
          ${state.errors[field] ? 'border-[#EC5757]' : 'border-line'}
        `}
      />
    </div>
  )
}

// MAIN COMPONENT 
export default function InvoiceForm({ invoice = null, onClose }) {
  const { addInvoice, updateInvoice } = useInvoice()

  const isEdit = invoice !== null

  const [state, dispatch] = useReducer(reducer, getInitialState(invoice))

  const setField = (field, value) =>
    dispatch({ type: 'UPDATE_FIELD', field, value })

  // VALIDATION 
  const validate = () => {
    const e = {}

    if (!state.senderStreet.trim())  e.senderStreet  = "Can't be empty"
    if (!state.senderCity.trim())    e.senderCity    = "Can't be empty"
    if (!state.senderPost.trim())    e.senderPost    = "Can't be empty"
    if (!state.senderCountry.trim()) e.senderCountry = "Can't be empty"
    if (!state.clientName.trim())    e.clientName    = "Can't be empty"
    if (!state.clientStreet.trim())  e.clientStreet  = "Can't be empty"
    if (!state.clientCity.trim())    e.clientCity    = "Can't be empty"
    if (!state.clientPost.trim())    e.clientPost    = "Can't be empty"
    if (!state.clientCountry.trim()) e.clientCountry = "Can't be empty"
    if (!state.description.trim())   e.description   = "Can't be empty"

    if (!state.clientEmail.trim()) {
      e.clientEmail = "Can't be empty"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.clientEmail)) {
      e.clientEmail = 'Must be a valid email'
    }

    if (state.items.length === 0) {
      e.items = 'An item must be added'
    }

    state.items.forEach((item, i) => {
      if (!item.name.trim())          e[`item_name_${i}`]  = "Can't be empty"
      if (Number(item.quantity) <= 0) e[`item_qty_${i}`]   = 'Min 1'
      if (Number(item.price) <= 0)    e[`item_price_${i}`] = 'Min 0'
    })

    dispatch({ type: 'SET_ERRORS', errors: e })
    return Object.keys(e).length === 0
  }

  //  BUILD INVOICE OBJECT 
  const buildInvoice = (status) => {
    const items = state.items.map(item => ({
      ...item,
      quantity: Number(item.quantity) || 0,
        price:    Number(item.price)    || 0,
        total:    (Number(item.quantity) || 0) * (Number(item.price) || 0),
    }))
     const safeDate = state.invoiceDate || today
    return {
      senderAddress: {
        street:   state.senderStreet,
        city:     state.senderCity,
        postCode: state.senderPost,
        country:  state.senderCountry,
      },
      clientName:  state.clientName,
      clientEmail: state.clientEmail,
      clientAddress: {
        street:   state.clientStreet,
        city:     state.clientCity,
        postCode: state.clientPost,
        country:  state.clientCountry,
      },
      createdAt:    state.invoiceDate,
      paymentTerms: Number(state.paymentTerms),
      paymentDue:   addDays(state.invoiceDate, state.paymentTerms),
      description:  state.description,
      items,
      // Recalculate grand total from the corrected items
      total: items.reduce((sum, item) => sum + item.total, 0),
      status,
    }
  }

  // ─── SUBMIT HANDLERS 

  const handleSaveAndSend = () => {
    if (!validate()) return
    isEdit
      ? updateInvoice(invoice.id, buildInvoice('pending'))
      : addInvoice(buildInvoice('pending'))
    onClose()
  }

  // Save as Draft 
  const handleSaveDraft = () => {
    // No validation — draft can be incomplete
    const draft = buildInvoice('draft')
    isEdit
      ? updateInvoice(invoice.id, draft)
      : addInvoice(draft)
    onClose()
  }

  // Save Changes 
  const handleSaveChanges = () => {
    if (!validate()) return
    updateInvoice(invoice.id, buildInvoice(invoice.status))
    onClose()
  }

  return (
    
    <div className="fixed inset-0 z-50 overflow-hidden">

      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="
          absolute top-0 left-0 h-full
          w-full md:max-w-[616px]
          bg-bg-card
          flex flex-col
          overflow-hidden
          md:rounded-r-[20px]
          lg:left-[103px]
        "
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? `Edit Invoice ${invoice.id}` : 'New Invoice'}
      >

        {/* ── SCROLLABLE AREA  */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-10 md:px-14">

          {/* Title */}
          <h2 className="text-2xl font-bold text-heading mb-10">
            {isEdit
              ? <>Edit <span className="text-muted">#</span>{invoice.id}</>
              : 'New Invoice'
            }
          </h2>

          {/* ── BILL FROM ── */}
          <fieldset className="mb-10">
            <legend className="text-xs font-bold text-purple mb-6">
              Bill From
            </legend>
            <div className="flex flex-col gap-6">

              <Field
                id="senderStreet"
                label="Street Address"
                field="senderStreet"
                state={state}
                setField={setField}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Field
                  id="senderCity"
                  label="City"
                  field="senderCity"
                  state={state}
                  setField={setField}
                />
                <Field
                  id="senderPost"
                  label="Post Code"
                  field="senderPost"
                  state={state}
                  setField={setField}
                />
                {/* Country is full width on mobile */}
                <div className="col-span-2 md:col-span-1">
                  <Field
                    id="senderCountry"
                    label="Country"
                    field="senderCountry"
                    state={state}
                    setField={setField}
                  />
                </div>
              </div>

            </div>
          </fieldset>

          {/* ── BILL TO ── */}
          <fieldset className="mb-10">
            <legend className="text-xs font-bold text-purple mb-6">
              Bill To
            </legend>
            <div className="flex flex-col gap-6">

              <Field
                id="clientName"
                label="Client's Name"
                field="clientName"
                state={state}
                setField={setField}
              />
              <Field
                id="clientEmail"
                label="Client's Email"
                field="clientEmail"
                type="email"
                state={state}
                setField={setField}
              />
              <Field
                id="clientStreet"
                label="Street Address"
                field="clientStreet"
                state={state}
                setField={setField}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <Field
                  id="clientCity"
                  label="City"
                  field="clientCity"
                  state={state}
                  setField={setField}
                />
                <Field
                  id="clientPost"
                  label="Post Code"
                  field="clientPost"
                  state={state}
                  setField={setField}
                />
                <div className="col-span-2 md:col-span-1">
                  <Field
                    id="clientCountry"
                    label="Country"
                    field="clientCountry"
                    state={state}
                    setField={setField}
                  />
                </div>
              </div>

            </div>
          </fieldset>

          {/*INVOICE DATE & PAYMENT TERMS ── */}
          <div className="flex flex-col gap-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-2">
                <label htmlFor="invoiceDate" className="text-xs text-body-text">
                  Invoice Date
                </label>
                <input
                  id="invoiceDate"
                  type="date"
                  value={state.invoiceDate}
                  onChange={e => setField('invoiceDate', e.target.value)}
                  className="
                    w-full px-4 py-3 rounded border border-line
                    bg-bg-card text-heading font-bold text-sm
                    outline-none focus:border-purple transition-colors
                  "
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="paymentTerms" className="text-xs text-body-text">
                  Payment Terms
                </label>
                <select
                  id="paymentTerms"
                  value={state.paymentTerms}
                  onChange={e => setField('paymentTerms', e.target.value)}
                  className="
                    w-full px-4 py-3 rounded border border-line
                    bg-bg-card text-heading font-bold text-sm
                    outline-none focus:border-purple cursor-pointer
                  "
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>

            </div>

            <Field
              id="description"
              label="Project Description"
              field="description"
              state={state}
              setField={setField}
            />
          </div>

          {/* ── ITEM LIST ── */}
          <div className="mb-10">
            <h3 className="text-lg font-bold text-[#777F98] mb-6">
              Item List
            </h3>

            {state.errors.items && (
              <p className="text-xs text-[#EC5757] mb-4">
                {state.errors.items}
              </p>
            )}

            {/* Column headers — desktop only */}
            {state.items.length > 0 && (
              <div className="hidden md:grid grid-cols-[1fr_60px_100px_60px_20px] gap-4 mb-2">
                <span className="text-xs text-body-text">Item Name</span>
                <span className="text-xs text-body-text text-center">Qty.</span>
                <span className="text-xs text-body-text">Price</span>
                <span className="text-xs text-body-text">Total</span>
                <span />
              </div>
            )}

            {state.items.map((item, index) => (
              <div key={index} className="mb-6">

                {/* ── DESKTOP ROW ── */}
                <div className="hidden md:grid grid-cols-[1fr_60px_100px_60px_20px] gap-4 items-center">

                  <input
                    value={item.name}
                    onChange={e => dispatch({
                      type: 'UPDATE_ITEM', index,
                      field: 'name', value: e.target.value
                    })}
                    aria-label="Item name"
                    placeholder="Item name"
                    className={`
                      px-4 py-3 rounded border font-bold text-sm
                      bg-bg-card text-heading outline-none
                      focus:border-purple transition-colors
                      ${state.errors[`item_name_${index}`]
                        ? 'border-[#EC5757]' : 'border-line'}
                    `}
                  />

                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => dispatch({
                      type: 'UPDATE_ITEM', index,
                      field: 'quantity', value: e.target.value
                    })}
                    aria-label="Quantity"
                    className={`
                      px-2 py-3 rounded border font-bold text-sm text-center
                      bg-bg-card text-heading outline-none
                      focus:border-purple transition-colors
                      ${state.errors[`item_qty_${index}`]
                        ? 'border-[#EC5757]' : 'border-line'}
                    `}
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={e => dispatch({
                      type: 'UPDATE_ITEM', index,
                      field: 'price', value: e.target.value
                    })}
                    aria-label="Price"
                    className={`
                      px-4 py-3 rounded border font-bold text-sm
                      bg-bg-card text-heading outline-none
                      focus:border-purple transition-colors
                      ${state.errors[`item_price_${index}`]
                        ? 'border-[#EC5757]' : 'border-line'}
                    `}
                  />

                  {/* Total is read only — auto calculated */}
                  <span className="text-sm font-bold text-body-text">
                    {(Number(item.quantity) * Number(item.price)).toFixed(2)}
                  </span>

                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'REMOVE_ITEM', index })}
                    aria-label="Remove item"
                    className="text-body-text hover:text-[#EC5757] transition-colors"
                  >
                    <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                      <path
                        d="M11.583 3.556H.917M3.214 3.556V2.667A1.333 1.333 0
                           014.547 1.333h3.334a1.333 1.333 0 011.333 1.334v.889
                           M5.214 7.333v4M7.88 7.333v4M1.547 3.556l.667 9.777A1.333
                           1.333 0 003.547 14.667h5.334a1.333 1.333 0
                           001.333-1.334l.667-9.777"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                </div>

                {/* ── MOBILE ROW ── */}
                <div className="md:hidden flex flex-col gap-4">

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-body-text">Item Name</label>
                    <input
                      value={item.name}
                      onChange={e => dispatch({
                        type: 'UPDATE_ITEM', index,
                        field: 'name', value: e.target.value
                      })}
                      className={`
                        w-full px-4 py-3 rounded border font-bold text-sm
                        bg-bg-card text-heading outline-none focus:border-purple
                        ${state.errors[`item_name_${index}`]
                          ? 'border-[#EC5757]' : 'border-line'}
                      `}
                    />
                  </div>

                  <div className="grid grid-cols-[64px_1fr_80px_20px] gap-4 items-end">

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-body-text">Qty.</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={e => dispatch({
                          type: 'UPDATE_ITEM', index,
                          field: 'quantity', value: e.target.value
                        })}
                        className="
                          w-full px-2 py-3 rounded border border-line
                          font-bold text-sm text-center
                          bg-bg-card text-heading outline-none focus:border-purple
                        "
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-body-text">Price</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={e => dispatch({
                          type: 'UPDATE_ITEM', index,
                          field: 'price', value: e.target.value
                        })}
                        className="
                          w-full px-4 py-3 rounded border border-line
                          font-bold text-sm bg-bg-card text-heading
                          outline-none focus:border-purple
                        "
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-body-text">Total</label>
                      <span className="py-3 text-sm font-bold text-body-text">
                        {(Number(item.quantity) * Number(item.price)).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', index })}
                      aria-label="Remove item"
                      className="pb-3 text-body-text hover:text-[#EC5757] transition-colors"
                    >
                      <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
                        <path
                          d="M11.583 3.556H.917M3.214 3.556V2.667A1.333 1.333 0
                             014.547 1.333h3.334a1.333 1.333 0 011.333 1.334v.889
                             M5.214 7.333v4M7.88 7.333v4M1.547 3.556l.667 9.777A1.333
                             1.333 0 003.547 14.667h5.334a1.333 1.333 0
                             001.333-1.334l.667-9.777"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                  </div>
                </div>

              </div>
            ))}

            <button
              type="button"
              onClick={() => dispatch({ type: 'ADD_ITEM' })}
              className="
                w-full py-4 rounded-full font-bold text-sm
                bg-[#F9FAFE] dark:bg-[#252945]
                text-body-text dark:text-[#DFE3FA]
                hover:bg-line transition-colors mt-4
              "
            >
              + Add New Item
            </button>
          </div>

        </div>
        {/* ── END SCROLLABLE AREA ── */}

        {/* ── FOOTER — never scrolls, always visible ──
            flex-shrink-0 stops it from shrinking when content is large
        */}
        <div className="
          flex-shrink-0
          px-6 md:px-14 py-6
          bg-bg-card
          flex items-center gap-2
          shadow-[0_-8px_16px_rgba(0,0,0,0.1)]
        ">
          {isEdit ? (
            // ── EDIT MODE buttons ──
            // Cancel far left, Save Changes on right
            <>
              <div className="flex-1">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </div>
              <Button variant="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </>
          ) : (
            // ── CREATE MODE buttons 
            <>
              <div className="flex-1">
                <Button variant="ghost" onClick={onClose}>
                  Discard
                </Button>
              </div>
              <Button variant="secondary" onClick={handleSaveDraft}>
                Save as Draft
              </Button>
              <Button variant="primary" onClick={handleSaveAndSend}>
                Save &amp; Send
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}