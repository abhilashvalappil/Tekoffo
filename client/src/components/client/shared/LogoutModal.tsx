import ReactDOM from 'react-dom';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ onConfirm, onCancel }) => {
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md text-center space-y-6">
        <h2 className="text-xl font-semibold text-gray-800">Are you sure you want to logout?</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Yes, Logout
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default LogoutModal;
