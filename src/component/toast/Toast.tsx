interface toastProps {
  modalText: string;
  modalType: string;
}

const Toast: React.FC<toastProps> = ({ modalText, modalType }) => {
  return (
    <>
      <div className="toast toast-center toast-middle z-[100] select-none">
        <div className={`alert alert-${modalType}`}>
          <span className="text-sm">{modalText}</span>
        </div>
      </div>
    </>
  );
};

export default Toast;
