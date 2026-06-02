import { NavLink, useParams } from "react-router-dom";
import "./HeaderRotas.css";

function HeaderRotas() {
    const { id } = useParams();

    return (
        <div className="rotas-header">
            <NavLink
                to={`/rota/${id}`}
                className={({ isActive }) =>
                    isActive ? "rota-link active" : "rota-link"
                }
                end
            >
                Início
            </NavLink>

            <NavLink
                to={`/rota/${id}/pontos`}
                className={({ isActive }) =>
                    isActive ? "rota-link active" : "rota-link"
                }
            >
                Pontos
            </NavLink>

            <NavLink
                to={`/rota/${id}/clusters`}
                className={({ isActive }) =>
                    isActive ? "rota-link active" : "rota-link"
                }
            >
                Clusters
            </NavLink>

            <NavLink
                to={`/rota/${id}/otimizacao`}
                className={({ isActive }) =>
                    isActive ? "rota-link active" : "rota-link"
                }
            >
                Otimização
            </NavLink>

            <NavLink
                to={`/rota/${id}/configuracoes`}
                className={({ isActive }) =>
                    isActive ? "rota-link active" : "rota-link"
                }
            >
                Configurações da Rota
            </NavLink>
        </div>
    );
}

export default HeaderRotas;