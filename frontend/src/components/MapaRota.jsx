import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapaRota({ pontos = [] }) {
    const position =
        pontos.length > 0
            ? [pontos[0].lat, pontos[0].lng]
            : [-25, -53];

    return (
        <MapContainer
            center={position}
            zoom={8}
            scrollWheelZoom={true}
            className="mapa-rota"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pontos.map((ponto, i) => (
                <Marker
                    key={i}
                    position={[ponto.lat, ponto.lng]}
                >
                    <Popup>
                        {ponto.nome || `Ponto ${i + 1}`}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}