import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderColetas from "../../components/HeaderColetas";
import ".././Coleta.css";

function ColetaOtimizacao() {
    const { id } = useParams();

    return (
        <div className="Coleta-container">
            <Header />

            <div className="home-content">
                <HeaderColetas />

                <div className="Coleta-info">
                    <h1>Clusters</h1>
                    <p>Coleta ID: {id}</p>
                </div>
            </div>
        </div>
    );
}

export default ColetaOtimizacao;