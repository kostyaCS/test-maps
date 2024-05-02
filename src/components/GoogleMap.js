import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import db from '../technical/firebase';
import { ref, set, push, update, remove } from 'firebase/database';

const GoogleMapComponent = () => {
    const [markers, setMarkers] = useState([]);
    const [lastMarkerKey, setLastMarkerKey] = useState(null);

    const handleMapClick = async (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const timestamp = Date.now();

        const newMarkerRef = push(ref(db, 'Quests'));
        await set(newMarkerRef, {
            Location: `${lat}, ${lng}`,
            Timestamp: timestamp,
            Next: ""
        });

        const newMarker = {
            lat,
            lng,
            timestamp,
            uid: newMarkerRef.key
        };

        setMarkers(current => [...current, newMarker]);

        if (lastMarkerKey) {
            const lastMarkerUpdateRef = ref(db, `Quests/${lastMarkerKey}`);
            await update(lastMarkerUpdateRef, {
                Next: newMarkerRef.key
            });
        }
        setLastMarkerKey(newMarkerRef.key);
    };


    const handleMarkerDragEnd = (markerIdx, event) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        const newTime = Date.now();

        const updatedMarkers = markers.map((marker, idx) => {
            if (idx === markerIdx) {
                const updatedMarker = { ...marker, lat: newLat, lng: newLng, timestamp: newTime };
                const markerRef = ref(db, `Quests/${marker.uid}`);
                update(markerRef, {
                    Location: `${newLat}, ${newLng}`,
                    Timestamp: newTime,
                });
                return updatedMarker;
            }
            return marker;
        });
        setMarkers(updatedMarkers);
    };

    const deleteMarker = async (index) => {
        const markerToDelete = markers[index];
        const nextToPoint = markers[index + 1];
        const previousMarkerIndex = markers[index - 1];
        if (previousMarkerIndex && nextToPoint) {
            const previousMarkerRef = ref(db, `Quests/${previousMarkerIndex.uid}`);
            await update(previousMarkerRef, {
                Next: nextToPoint.uid,
            });
        }
        await remove(ref(db, `Quests/${markerToDelete.uid}`));
        setMarkers(current => current.filter((_, idx) => idx !== index));
    };

    const deleteAllMarkers = async () => {
        await Promise.all(markers.map(marker => remove(ref(db, `Quests/${marker.uid}`))));
        setMarkers([]);
    };

    return (
        <LoadScript
            googleMapsApiKey="AIzaSyBphiywpnBjGTzXtkvGvb1PhTw9AJN_i6k">
            <GoogleMap
                mapContainerStyle={{width: window.innerWidth - 100,
                    height: window.innerHeight - 100,}}
                center={{
                    lat: 48.5,
                    lng: 24.5,
                }}
                zoom={5}
                onClick={handleMapClick}>
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        position={{lat: marker.lat, lng: marker.lng}}
                        label={`${index + 1}`}
                        draggable={true}
                        onDragEnd={(event) => handleMarkerDragEnd(index, event)}
                        onDblClick={() => deleteMarker(index)}
                    />
                ))}
            </GoogleMap>
            <button onClick={deleteAllMarkers}>delete all</button>
        </LoadScript>
    );
}

export default GoogleMapComponent;
