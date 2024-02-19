import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const storedPlaces = storedIDs.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  //stato per prendere i nostri punti disponibili
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  //il riordinamento dei posti, vengono messi in ordine dopo che il componente App viene VALUTATO LA SECONDA VOLTA. DOPO l'esecuzione del componente App
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setAvailablePlaces(sortedPlaces);
    });
  }, []);
  //l'array delle dipendenze, React lo va ad esaminare e va ad eseguire di nuovo lo useEffect, solo se scoprirà che i valori che passiamo come dipendenze sono diversi da quelli precedenti
  //mettendo l'array di dipendenze vuoto, forziamo il sistema di React di eseguire lo useEffect una volta solamente, quando l'array di dipendenze non ha valori.

  function handleStartRemovePlace(id) {
    setModalOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedIDs.indexOf(id) === -1)
      localStorage.setItem(
        "selectedPlaces",
        JSON.stringify([id, ...storedIDs])
      );
  }

  //funzione per rimuovere i posti
  //wrappiamo la funzione con useCallback() a cui passeremo comunque una dipendenza
  //usiamo useCallBack per evitare la rivalutazione della funzione (eseguita ad ogni ciclo di rendering)
  //se usiamo una funzione che triggera un cambio di stato come dipendenza all'interno di un useEffect, bisogna wrapparla tramite useCallBack a cui dovremo passare cmq dipendenza vuota
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalOpen(false);
    const storedIDs = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIDs.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal onClose={handleStopRemovePlace} open={modalOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          fallbackText={"Sorting places by distance..."}
          places={availablePlaces}
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
