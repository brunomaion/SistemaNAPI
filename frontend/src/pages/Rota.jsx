import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import HeaderRotas from "../components/HeaderRotas";
import MapaRota from "../components/MapaRota";

import "./Rota.css";

function Rota() {
    const { id } = useParams();

    const [rota, setRota] = useState(null);

    useEffect(() => {
        buscarRota();
    }, []);

    const buscarRota = async () => {
        const response = await fetch(
            `http://localhost:8080/rotas/${id}`
        );

        const data = await response.json();
        setRota(data);
    };

    if (!rota) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">
                    <MapaRota pontos={rota.pontos} />
                </div>

            </div>
        </div>
    );
}

export default Rota;