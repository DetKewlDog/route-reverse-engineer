import { useState, useEffect } from 'react';
import "../index.css";
import APIAccess from '../services/APIAccess.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapMarker from './MapMarker';

function MapDisplay({ latitude, longitude, distance, isOnline }) {
    var [markers, setMarkers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (!isOnline) return;
            const positions = await APIAccess.fetchPositionsAroundDest([latitude, longitude], distance);
            distance /= 1000;
            const destinationStr = `${longitude},${latitude}`;
            var coords = [];

            for await (const origin of positions) {
                if (!isOnline) break;
                const point = await APIAccess.validatePosition(coords, origin, destinationStr, distance);
                if (point === undefined) continue;
                setMarkers(prevMarkers => [...prevMarkers, point]);
            }
        }
        document.querySelectorAll('div').forEach(x => x.addEventListener('wheel', preventScroll, {passive: false}));

        function preventScroll(e){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        fetchData();
    }, [latitude, longitude, isOnline]);

    return (
        <div className="output">
            <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapMarker key='dest' marker={[latitude, longitude]} />
                {markers.map((marker, index) => (
                    <MapMarker {...marker} key={index} />
                ))}
            </MapContainer>
        </div>
    );
}

export default MapDisplay;