import React from "react";

interface SuccessModalProps {
  message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message }) => {
  return (
    <dialog id="success" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-green-500">{message}</h3>
        <p className="py-4">Press ESC key or click outside to close</p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>Close</button>
      </form>
    </dialog>
  );
};

export default SuccessModal;
