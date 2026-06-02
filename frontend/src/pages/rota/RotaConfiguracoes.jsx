import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRotas from "../../components/HeaderRotas";
import ".././Rota.css";

function RotaConfiguracoes() {
    const { id } = useParams();


    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">
                    <h1>Configurações da Rota {id}</h1>
                    <p>Implementar: Adicionar outros usuarios</p>
                    <p>Dependente: Backend fitlro por usuario, endpoint para adicionar usuario na rota</p>
                    <p>Implementar: Remover usuarios da rota</p>
                </div>

                <button className="btn btn-deleterota">
                    Excluir Rota
                </button>
            </div>
        </div>
    );
}

export default RotaConfiguracoes;