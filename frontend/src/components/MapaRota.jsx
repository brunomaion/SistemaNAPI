import { MapContainer, TileLayer, Marker, CircleMarker, Popup } from "react-leaflet";
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

            {pontos.map((ponto, i) =>
                ponto.cor ? (
                    <CircleMarker
                        key={i}
                        center={[ponto.lat, ponto.lng]}
                        radius={9}
                        pathOptions={{
                            color: ponto.cor,
                            fillColor: ponto.cor,
                            fillOpacity: 0.85
                        }}
                    >
                        <Popup>
                            {ponto.grupoLabel
                                ? `${ponto.grupoLabel} — ${ponto.nome || `Ponto ${i + 1}`}`
                                : ponto.nome || `Ponto ${i + 1}`}
                        </Popup>
                    </CircleMarker>
                ) : (
                    <Marker
                        key={i}
                        position={[ponto.lat, ponto.lng]}
                    >
                        <Popup>
                            {ponto.nome || `Ponto ${i + 1}`}
                        </Popup>
                    </Marker>
                )
            )}
        </MapContainer>
    );
}