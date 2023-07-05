import { useState } from 'react';
import Config from './components/Config.jsx'
import MapDisplay from './components/MapDisplay.jsx'
import "./index.css";

function App() {
	var [latitude, setLatitude] = useState(51.16464197468807);
	var [longitude, setLongitude] = useState(7.091874926571654);
	var [distance, setDistance] = useState(1000);
	var [online, setOnline] = useState(false);

	const start = () => {
        const lat = document.querySelector('#inLat').value;
		if (lat === '') return;
		const long = document.querySelector('#inLong').value;
		if (long === '') return;
		const dist = document.querySelector('#inDistance').value;
        if (dist === '') return;
		setLatitude(lat);
		setLongitude(long);
		setDistance(dist);
        setCommunication(true);
    }

	const setCommunication = (state) => {
        if (online !== state) setOnline(state);
    }

	return (
		<>
			<div className="header">
				<span className="title">Route Reverse Engineer</span>
				<span className="author">By DetKewlDog</span>
			</div>
			<div className="body">
				<Config
					start={start}
					setLatitude={setLatitude}
					setLongitude={setLongitude}
					setDistance={setDistance}
					latitude={latitude}
					longitude={longitude}
					distance={distance}
					isOnline={online}
				/>
				<MapDisplay
					latitude={latitude}
					longitude={longitude}
					distance={distance}
					isOnline={online}
				/>
			</div>
		</>
    );
}

export default App;
