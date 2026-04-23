import EmptyIcon from "../assets/EmptyIcon.svg?react";
export default function EmptyState() {
    return(
        <div className="flex flex-col items-center 
        justify-center px-8 py-24 text-center">
            <EmptyIcon />
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mt-6">
                There is nothing here
            </h2>
            <p className="text-[var(--color-text-secondary)] mt-2">
                Create an invoice by clicking the <span className="font-bold text-[var(--color-purple)]">New Invoice</span> button and get started.
            </p>
        </div>
    )
}