import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRegioes from "../../components/HeaderRegioes";
import "./Regiao.css";

function RegiaoOtimizacao() {
    const { id } = useParams();

    return (
        <div className="Regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />

                <div className="regiao-subcontainer">
                    <div className="Regiao-info">
                        <h1>Clusters</h1>
                        <p>Região ID: {id}</p>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default RegiaoOtimizacao;
