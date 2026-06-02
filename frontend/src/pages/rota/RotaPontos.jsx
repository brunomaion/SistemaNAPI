import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRotas from "../../components/HeaderRotas";
import ".././Rota.css";

function RotaPontos() {
    const { id } = useParams();

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">
                    <h1>Clusters</h1>
                    <p>Rota ID: {id}</p>
                </div>
            </div>
        </div>
    );
}

export default RotaPontos;