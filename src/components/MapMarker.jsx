import { Marker, Popup, Polyline } from 'react-leaflet';
import { useState, useMemo, useRef } from 'react';
import L from 'leaflet';

const markerIcon = new L.Icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/801426473059614730/1131176177013366924/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

const markerIconDest = new L.Icon({
    iconUrl: 'https://cdn.discordapp.com/attachments/801426473059614730/1131176188300242985/marker-icon-dest.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [0, -41],
});

export default function MapMarker({ coords, route, distance, name, setCoords }) {
    const [isPressed, setIsPressed] = useState(false);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(() => ({
        popupopen() { setIsPressed(true); },
        popupclose() { setIsPressed(false); },
        dragend() {
            const marker = markerRef.current;
            if (marker === null || setCoords === null) return;
            const newPosition = Object.values(marker.getLatLng());
            setCoords(newPosition);
        }
    }), []);

    let url = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;

    if (distance !== undefined) {
        const destination = route[route.length - 1];
        url = `https://www.google.com/maps/dir/?api=1&origin=${coords[0]},${coords[1]}&destination=${destination[0]},${destination[1]}&travelmode=walking&units=metric`;
    }
    const icon = distance !== undefined ? markerIcon : markerIconDest;
    return (
        <Marker draggable={setCoords !== undefined} position={coords} eventHandlers={eventHandlers} ref={markerRef} icon={icon}>
            <Popup>
                {name !== undefined && name.split('|').map((x, index) => (
                    <footer key={index} footer><b>{x}</b></footer>
                ))}
                <a href={url} target="_blank">Google Maps link<br /></a>
                {distance !== undefined && `Distance: ${distance}m`}
            </Popup>
            {distance !== undefined && isPressed && <Polyline pathOptions={{ color: 'red' }} positions={route} />}
        </Marker>
    );
}