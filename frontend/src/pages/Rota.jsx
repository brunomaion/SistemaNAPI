import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import HeaderRotas from "../components/HeaderRotas";

import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "./Rota.css";

function Rota() {
    const { id } = useParams();
    const [rota, setRota] = useState(null);

    useEffect(() => {
        buscarRota();
    }, []);

    const buscarRota = async () => {
        const response = await fetch(`http://localhost:8080/rotas/${id}`);
        const data = await response.json();
        setRota(data);
    };

    if (!rota) {
        return <div>Carregando...</div>;
    }

    // 📍 converte pontos com proteção contra NaN
    const pontos = (rota.pontos || [])
        .map(p => ({
            lat: Number(p.latitude),
            lng: Number(p.longitude)
        }))
        .filter(p => !isNaN(p.lat) && !isNaN(p.lng));

    // 📌 centro automático do mapa (evita erro NaN)
    const center = pontos.length > 0
        ? [pontos[0].lat, pontos[0].lng]
        : [0, 0];

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">
                    <h1>{rota.nomeRota}</h1>

                    <p>ID: {rota.id}</p>
                    <p>Pontos: {rota.pontos?.join(" → ")}</p>
                    <p>Clusters: {rota.clusters?.join(", ")}</p>
                    <p>Custo: {rota.custoTotal}</p>
                    <p>Tempo: {rota.tempoTotal}</p>
                </div>

                {/* 🗺️ MINIMAPA */}
                <div className="mapa-mini">
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: "300px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />

                        {pontos.map((p, index) => (
                            <Marker key={index} position={p} />
                        ))}

                        {pontos.length > 1 && (
                            <Polyline positions={pontos} color="blue" />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Rota;