import { useState } from 'react';
import Config from './components/Config.jsx'
import MapDisplay from './components/MapDisplay.jsx'
import "./index.css";

function App() {
	var [latitude, setLatitude] = useState(localStorage.getItem('latitude') || 51.16464197468807);
	var [longitude, setLongitude] = useState(localStorage.getItem('longitude') || 7.091874926571654);
	var [distance, setDistance] = useState(localStorage.getItem('distance') || 1000);
	var [online, setOnline] = useState(false);

	const updateLatitude = (lat) => localStorage.setItem('latitude', lat) & setLatitude(lat);
	const updateLongitude = (long) => localStorage.setItem('longitude', long) & setLongitude(long);
	const updateDistance = (dist) => localStorage.setItem('distance', dist) & setDistance(dist);

	const start = () => {
        const lat = document.querySelector('#inLat').value;
		if (lat === '') return;
		const long = document.querySelector('#inLong').value;
		if (long === '') return;
		const dist = document.querySelector('#inDistance').value;
		if (dist === '') return;
		updateLatitude(lat);
		updateLongitude(long);
		updateDistance(dist);
        setCommunication(true);
	}

	const setCommunication = (state) => {
        if (online !== state) setOnline(state);
	}

	function setCoords(coords) {
		updateLatitude(coords[0]);
		updateLongitude(coords[1]);

		document.querySelector('#inLat').value = coords[0];
		document.querySelector('#inLong').value = coords[1];
	}

	return (
		<>
			<div className="header">
				<span className="title">Route Reverse Engineer</span>
				<span className="author"><a href="https://detkewldog.netlify.app" target="_blank">By DetKewlDog</a></span>
			</div>
			<div className="body">
				<Config
					start={start}
					setLatitude={updateLatitude}
					setLongitude={updateLongitude}
					setDistance={updateDistance}
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
					setCoords={setCoords}
				/>
			</div>
		</>
    );
}

export default App;
