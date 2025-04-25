import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { IconX } from '@tabler/icons-react';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
      cancelButtonRef.current?.focus(); 
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-sm border border-[#C3D3DB] shadow-lg w-full max-w-md mx-auto mt-5 relative transition-all duration-300 ease-out transform  dark:bg-[#1e2022] dark:border-[#2f3235] ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className='flex items-center justify-between border-b p-4 border-[#C3D3DB] dark:border-[#2f3235]'>
            <h2 id="modal-title" className="text-[18px] font-semibold text-[#1B2124] tracking-normal dark:text-[#ebf2f5]">
                Confirm Deletion
            </h2>
            <button
                onClick={onClose}
                className=" text-[#1B2124] p-1 cursor-pointer hover:bg-[#F5F5F7] rounded-sm dark:text-[#ebf2f5] dark:hover:bg-[#2f3235]"
                aria-label="Close modal"
                >
                <IconX size={20} />
            </button>
        </div>
        <p className="mt-5 px-4 text-[15px] text-[#1B2124] tracking-normal dark:text-[#ebf2f5]">
          Are you sure you want to delete all feedback items? This action cannot be undone.
        </p>
        <div className="mt-8 flex justify-end space-x-2 p-4 border-t border-[#C3D3DB] dark:border-[#2f3235]">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            className="px-4 py-2 text-[#1B2124] border border-[#C3D3DB] rounded-sm hover:bg-[#F5F5F7] text-[14px] tracking-normal cursor-pointer dark:bg-[#202325] dark:text-[#ebf2f5] dark:border-[#2f3235] dark:hover:bg-[#1e2022]"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#FF6363] text-white rounded-sm hover:bg-[#e55a5a] text-[14px] tracking-normal cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

DeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteModal;