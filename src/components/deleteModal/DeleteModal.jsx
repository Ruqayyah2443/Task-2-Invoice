import {useEffect, useRef} from 'react';
import Button from '../button/Button';
import './DeleteModal.css'

export default function DeleteModal({invoiceId, onConfirm, onCancel}) {
    const modalRef = useRef(null);

    useEffect(()=>{

        modalRef.current?.focus()

        function handleKeyDown(event){
            if (event.key === 'Escape') {
                onCancel();
            }
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [onCancel])

    return (
        <div
        className='modal-overlay'
        onClick={onCancel}
        role='dialog'
        aria-modal='true'
        aria-labelledby='modal-title'
        >
            <div
                className="modal-box"
                ref={modalRef}
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="modal-title" className="modal-title">
                    Confirm Deletion
                </h2>
                <p className="modal-text">
                    Are you sure you want to delete invoice{' '}
                    <strong>#{invoiceId}</strong>? This action cannot be undone.
                </p>

                <div className='modal-actions'>
                    <Button 
                     variant="secondary" onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button 
                     variant="danger" onClick={onConfirm}
                    >
                        Delete
                    </Button>

                </div>
            </div>

        </div>
    )
}