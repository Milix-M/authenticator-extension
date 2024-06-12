interface settingsModalProps {
  modalRef: React.RefObject<HTMLDialogElement>;
}

const SettingsModal: React.FC<settingsModalProps> = ({ modalRef }) => {
  return (
    <>
      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Authenticatorの設定</h3>

          <div className="mt-1 flex justify-center">
            <label className="form-control w-full max-w-xs ">
              <div className="label py-1">
                <span className="label-text">テーマ</span>
              </div>
              <input
                type="text"
                placeholder="Key"
                className="input input-sm input-bordered w-full max-w-xs"
              />
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">キャンセル</button>
              <button className="btn btn-primary ml-2">実行</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default SettingsModal;
