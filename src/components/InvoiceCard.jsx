import { useNavigate } from 'react-router-dom'
import StatusBadge from '../components/statusbadge/StatusBadge'
import ArrowRight from '../assets/ArrowRight.svg?react' 

export default function InvoiceCard({ invoice }) {
    const navigate = useNavigate()

    // Date format
    const formatDate = (dateStr) => {
    if (!dateStr) return 'No date'
    const date = new Date(dateStr)
    // isNaN checks if the date is invalid
    if (isNaN(date.getTime())) return 'Invalid date'
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
    }

    // FORMAT CURRENCY
    const formatAmount = (amount) => {
    const num = Number(amount)
    if (isNaN(num)) return '£ 0.00'
    return `£ ${num.toLocaleString('en-GB', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
    }

    return(
        <div
        onClick={() => navigate(`/invoice/${invoice.id}`)}
        role='button'
        tabIndex={0}
        // onKeyDown={(e) => e.key === 'Error' && navigate(`/invoice/${invoice.id}`)}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/invoice/${invoice.id}`)}
        className="
        w-full bg-bg-card border border-line rounded-lg
        px-6 py-4 mb-4 cursor-pointer
        hover:border-purple transition-colors duration-200
        focus:outline-none focus:border-purple"
        >
            <div className='hidden md:flex items-center justify-between gap-4'>
                <span className="font-bold text-sm text-heading w-24">
                    <span className="text-purple">#</span>
                    {invoice.id}
                </span>

                <span className="text-sm text-body-text w-32">
                    Due {formatDate(invoice.paymentDue)}
                </span>

                <span className="text-sm text-body-text flex-1">
                {invoice.clientName}
                </span>

                <span className="font-bold text-base text-heading w-28 text-right">
                    {formatAmount(invoice.total)}
                </span>

                <StatusBadge status={invoice.status} />

                <ArrowRight />
            </div>  


            {/* Mobile View */}
            <div className='flex flex-col md:hidden  gap-6'>
                <div className='flex items-center justify-between'>
                    <span className="font-bold text-sm text-heading w-24">
                        <span className="text-purple">#</span>
                        {invoice.id}
                    </span>

                    <span className="text-sm text-body-text">
                        {invoice.clientName}
                    </span>
                </div>
                {/* 2nd row */}
                <div className='flex items-center justify-between'>
                    <div className='flex flex-col items-center justify-between gap-2'>
                        <span className="text-sm text-body-text">
                        Due {formatDate(invoice.paymentDue)}
                        </span>
                        <span className="font-bold text-base text-heading">
                            {formatAmount(invoice.total)}
                        </span>
                    </div>
                    <StatusBadge status={invoice.status} />
                </div>
                
            </div>

        </div>
    )

}