import { Marker, Popup, Polyline } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import _markerIcon from '../images/marker-icon.png';
import _markerIconDest from '../images/marker-icon-dest.png';

const markerIcon = new L.Icon({
    iconUrl: _markerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

const markerIconDest = new L.Icon({
    iconUrl: _markerIconDest,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

export default function MapMarker({ marker, route, distance }) {
    const [isPressed, setIsPressed] = useState(false);

    const handlePress = () => setIsPressed(true);
    const handleUnpress = () => setIsPressed(false);

    let url = `https://www.google.com/maps?q=${marker[0]},${marker[1]}`;

    if (distance !== undefined) {
        const destination = route[route.length - 1];
        url = `https://www.google.com/maps/dir/?api=1&origin=${marker[0]},${marker[1]}&destination=${destination[0]},${destination[1]}&travelmode=walking&units=metric`;
    }
    const icon = distance !== undefined ? markerIcon : markerIconDest;
    return (
        <Marker position={marker} eventHandlers={{ popupopen: handlePress, popupclose: handleUnpress }} icon={icon}>
            <Popup>
                <a href={url} target="_blank">Google Maps link</a>
                <br />
                {distance !== undefined && `Distance: ${distance}m`}
            </Popup>
            {distance !== undefined && isPressed && <Polyline pathOptions={{ color: 'red' }} positions={route} />}
        </Marker>
    );
}