
import { useState } from 'react'
import { useInvoice } from '../../context/InvoiceContext'
import ArrowDown from '../../assets/ArrowDown.svg?react'
import './FilterDropdown.css'

export default function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const { filterByStatus } = useInvoice()
    const {filter, setFilter} = useInvoice()

    const options = ['draft', 'pending', 'paid']

    function handleCheck(value) {
    setFilter(prev => {
        return prev === value ? 'all' : value
    })
    }

    return(
        <div className='filter'>
            <button
            className='filter-trigger'
            onClick={() => setIsOpen(prev => !prev)}
            >
                <span className="filter__label-short">Filter</span>
                <span className="filter__label-long">
                    Filter by status
                </span>
                <ArrowDown className={`filter__chevron ${isOpen ? 'filter__chevron--open' : ''}`} />
            </button>

            {isOpen && (
                <div className='filter__option'>
                    {options.map(option =>(
                        <label key={option}
                        className='filter__checkbox'
                        checked={filter === option}
                        onChange={() => handleCheck(option)}
                        >
                          {option[0].toUpperCase() + option.slice(1)}  
                        </label>
                    ))}
                </div>
            )}

        </div>
    )
}

