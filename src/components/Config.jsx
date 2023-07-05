function Config({ start, setLatitude, setLongitude, setDistance, latitude, longitude, distance, isOnline }) {
    return (
        <>
            <div>
                <input id='inLat'
                    type="number"
                    placeholder="Enter latitude here..."
                    defaultValue={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                />
                <input id='inLong'
                    type="number"
                    placeholder="Enter longitude here..."
                    defaultValue={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                />
                <input id='inDistance'
                    type="number"
                    placeholder="Enter distance here..."
                    defaultValue={distance}
                    onChange={(e) => setDistance(e.target.value)}
                />
                <button onClick={start} className={isOnline ? 'on' : ''}>Start</button>
                <button onClick={() => window.location.reload()}>Refresh</button>
            </div>
        </>
    );   
}

export default Config;