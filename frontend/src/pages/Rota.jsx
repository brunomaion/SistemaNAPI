import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import HeaderRotas from "../components/HeaderRotas";
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
                    <h1>{rota.nomeRota}</h1>

                    <p>ID: {rota.id}</p>
                    <p>Origem: {rota.pontoOrigem?.join(", ")}</p>
                    <p>Pontos: {rota.pontos?.join(" → ")}</p>
                    <p>Clusters: {rota.clusters?.join(", ")}</p>
                    <p>Custo: {rota.custoTotal}</p>
                    <p>Tempo: {rota.tempoTotal}</p>
                </div>
            </div>
        </div>
    );
}

export default Rota;