import axios from 'axios';

class APIAccess {
    static async fetchPositionsAroundDest(destination, maxDistance) {
        const query = `[out:json];
        (
        node["highway"="building"](around:${maxDistance},${destination[0]},${destination[1]});
        way["highway"="building"](around:${maxDistance},${destination[0]},${destination[1]});
        rel["highway"="building"](around:${maxDistance},${destination[0]},${destination[1]});
        );
        out center;`
        return axios.get("https://lz4.overpass-api.de/api/interpreter", { params: { data: query } })
            .then(result => result.data)
            .then(data => {
                const positions = new Set(data.elements
                    .filter(element => element.center)
                    .map(element => ({
                        lat: element.center.lat,
                        lon: element.center.lon
                    })));
                return positions;
            })
            .catch(error => console.error(error));
    }

    static async validatePosition(coords, origin, destinationStr, walkDistance) {
        const originStr = `${origin.lon},${origin.lat}`;

        if (coords.includes(originStr)) return undefined;

        try {
            const response = await axios.get(`https://router.project-osrm.org/route/v1/walking/${originStr};${destinationStr}?overview=full`);
            const data = response.data;

            if (!data.routes || data.routes.length <= 0) return undefined;

            const distance = (data.routes[0].distance / 1000).toFixed(3);;

            if (Math.abs(distance - walkDistance) > 0.25) return undefined;

            console.log(distance, walkDistance);
            coords.push(originStr);
            return {
                marker: [origin.lat, origin.lon],
                route: APIAccess.decodePolyline(data.routes[0].geometry),
                distance: data.routes[0].distance
            };
        } catch (error) {
            console.error(error);
        }
    }

    static decodePolyline(polyline) {
        const coordinates = [];
        let lat = 0, lng = 0;
        let index = 0;

        while (index < polyline.length) {
            let byte, shift = 0, result = 0;

            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
            lat += deltaLat;

            shift = 0;
            result = 0;

            do {
                byte = polyline.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
            lng += deltaLng;

            coordinates.push([lat * 1e-5, lng * 1e-5]);
        }

        return coordinates;
    }
}

export default APIAccess;