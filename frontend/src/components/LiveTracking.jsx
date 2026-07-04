import { useEffect, useRef, useContext } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SocketDataContext } from "../context/SocketContext";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const LiveTracking = ({ pickup }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const captainMarker = useRef(null);
    const pickupMarker = useRef(null);
    const { socket } = useContext(SocketDataContext);

    useEffect(() => {
        if (map.current || !pickup?.lat || !pickup?.lng) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [pickup.lng, pickup.lat],
            zoom: 14,
        });

        map.current.addControl(new mapboxgl.NavigationControl());

        pickupMarker.current = new mapboxgl.Marker({ color: "#000000" })
            .setLngLat([pickup.lng, pickup.lat])
            .addTo(map.current);

    }, [pickup]);

    useEffect(() => {
        if (!map.current || !pickup?.lat) return;
        if (pickupMarker.current) {
            pickupMarker.current.setLngLat([pickup.lng, pickup.lat]);
        }
        map.current.flyTo({ center: [pickup.lng, pickup.lat], zoom: 14 });
    }, [pickup]);

    useEffect(() => {
        if (!socket || !map.current) return;

        const handleCaptainLocation = ({ lat, lng }) => {
            if (!lat || !lng) return;

            if (!captainMarker.current) {
                captainMarker.current = new mapboxgl.Marker({ color: "#22c55e" })
                    .setLngLat([lng, lat])
                    .addTo(map.current);
            } else {
                captainMarker.current.setLngLat([lng, lat]);
            }

            map.current.flyTo({ center: [lng, lat], zoom: 15 });
        };

        socket.on("captain-location-update", handleCaptainLocation);
        return () => socket.off("captain-location-update", handleCaptainLocation);
    }, [socket]);

    return (
        <div ref={mapContainer} style={{ height: "100%", width: "100%" }} />
    );
};

export default LiveTracking;