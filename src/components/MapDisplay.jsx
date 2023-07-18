import { useState, useEffect } from 'react';
import "../index.css";
import APIAccess from '../services/APIAccess.js';
import { MapContainer, TileLayer, LayersControl, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MapMarker from './MapMarker';

function MapLayer({ name, url, subdomains, checked=false }) {
    return (
        <LayersControl.BaseLayer name={name} checked={checked}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={url} subdomains={subdomains || ['a', 'b', 'c']} />
        </LayersControl.BaseLayer>
    );
}

function MapDisplay({ latitude, longitude, distance, isOnline, setCoords }) {
    var [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null)

    useEffect(() => {
        async function fetchData() {
            if (!isOnline) return;
            map.flyTo([latitude, longitude], 13);
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
        document.querySelectorAll('.output').forEach(x => x.addEventListener('wheel', preventScroll, {passive: false}));

        function preventScroll(e){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        fetchData();
    }, [latitude, longitude, isOnline]);

    return (
        <div className="output">
            <MapContainer center={[latitude, longitude]} zoom={13} ref={setMap} style={{ height: "100%", width: "100%" }}>

                <LayersControl position="topright">
                    <MapLayer name="Default" checked
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                        url='http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}' />

                    <MapLayer name="Leaflet"
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

                    <MapLayer name="Terrain"
                        subdomains={['mt0', 'mt1','mt2','mt3']}
                        url='http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}' />

                    <MapLayer name="Satellite"
                        subdomains={['mt0', 'mt1','mt2','mt3']}
                        url='http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}' />

                    <LayersControl.Overlay name='Dark Mode'>
                        <Marker></Marker>
                    </LayersControl.Overlay>
                </LayersControl>

                <MapMarker key='dest' coords={[latitude, longitude]} setCoords={!isOnline ? setCoords : undefined} />
                {markers.map((marker, index) => (
                    <MapMarker {...marker} key={index} />
                ))}
            </MapContainer>
        </div>
    );
}

export default MapDisplay;