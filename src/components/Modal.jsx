import { useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ children, open, onClose }) {
  const dialog = useRef();

  //qui utilizziamo la dependency per sincronizzare la props open con la dialog
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]);
  //tutto ciò che scatena la rivalutazione del componente, va inserito nelle dipendenze
  //se non mettiamo la dipendenza non viene rivalutato lo useEffect

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {open ? children : null}
    </dialog>,
    document.getElementById("modal")
  );
}

export default Modal;
