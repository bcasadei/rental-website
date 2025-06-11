import React from 'react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void; 
    children: React.ReactNode;
}
const Modal: React.FC<ModalProps>=({isOpen, onClose, children}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export default Modal;