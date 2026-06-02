import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HeaderRotas.css";

function HeaderRotas() {
    const { id } = useParams();
    const [rota, setRota] = useState(null);

    useEffect(() => {
        const buscarRota = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/rotas/${id}`
                );

                const data = await response.json();
                setRota(data);
            } catch (error) {
                console.log("Erro ao buscar rota");
            }
        };

        buscarRota();
    }, [id]);

    return (
        <div>
            <div className="rotas-header">
                <h1>{rota?.nomeRota}</h1>
            </div>

            <div className="rotas-header">
                <NavLink to="/home" className="rota-link">
                    Voltar
                </NavLink>

                <NavLink to={`/rota/${id}`} className="rota-link" end>
                    Início
                </NavLink>

                <NavLink to={`/rota/${id}/pontos`} className="rota-link">
                    Pontos
                </NavLink>

                <NavLink to={`/rota/${id}/clusters`} className="rota-link">
                    Clusters
                </NavLink>

                <NavLink to={`/rota/${id}/otimizacao`} className="rota-link">
                    Otimização
                </NavLink>

                <NavLink to={`/rota/${id}/configuracoes`} className="rota-link">
                    Configurações
                </NavLink>
            </div>
        </div>
    );
}

export default HeaderRotas;