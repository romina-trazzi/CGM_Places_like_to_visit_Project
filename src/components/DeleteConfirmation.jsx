import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";

//evitare di inserire funzioni che sono nel corpo dello useEffect come dipendenze
//mai mettere nelle dipendenze un oggetto con id, name, ecc, siccome sono oggetti nuovi ad ogni ciclo di rendering
//codice con .map(), filter(), find(), MAI includere metodi del genere COME dipendenze
//attenzione quando aggiungiamo funzioni come dipendenze, perchè rischiamo di creare un ciclo infinito

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  
   const [remainingTime, setRemainingTime] = useState(TIMER);

    useEffect(() => {
      //set timer
      console.log("TIMER SET");

      const timer = setTimeout(() => {
      onConfirm();
      }, TIMER);


      //clean up, viene eseguito quando il componente sta per venire
      return () => {
      console.log("CLEAN UP");
      clearTimeout(timer);
      };
    }, [onConfirm]);

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
     <ProgressBar props={TIMER}/>
    </div>
  );
}
