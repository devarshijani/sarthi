import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState, useContext } from "react";
import { SocketDataContext } from "../context/SocketContext";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const LiveTracking = ({ pickup }) => {
    const { socket } = useContext(SocketDataContext);
    const [captainPosition, setCaptainPosition] = useState(null);
    const [route, setRoute] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleCaptainLocation = ({ lat, lng }) => {
            if (!lat || !lng) return;
            const pos = [lat, lng];
            setCaptainPosition(pos);
            setRoute((prev) => [...prev, pos]);
        };

        socket.on("captain-location-update", handleCaptainLocation);

        return () => {
            socket.off("captain-location-update", handleCaptainLocation);
        };
    }, [socket]);

    if (!pickup) return null;

    return (
        <MapContainer
            center={[pickup.lat, pickup.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {captainPosition && <Marker position={captainPosition} />}
            {route.length > 1 && <Polyline positions={route} />}
        </MapContainer>
    );
};

export default LiveTracking;
