interface toastProps {
  toastText: string;
  toastType: string;
}

const Toast: React.FC<toastProps> = ({ toastText, toastType }) => {
  return (
    <>
      <div className="toast toast-center toast-middle z-[100] select-none">
        <div className={`alert ${toastType}`}>
          <span className="text-sm">{toastText}</span>
        </div>
      </div>
    </>
  );
};

export default Toast;
