import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HeaderColetas.css";

function HeaderColetas() {
    const { id } = useParams();
    const [coleta, setColeta] = useState(null);

    useEffect(() => {
        async function carregarColeta() {
            try {
                const response = await fetch(
                    `http://localhost:8080/coletas/${id}`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar coleta");
                }

                const data = await response.json();

                setColeta(data);
            } catch (error) {
                console.error("Erro ao buscar coleta:", error);
            }
        }

        if (id) {
            carregarColeta();
        }
    }, [id]);

    return (
        <div className="header-coletas">

            <div className="coletas-header coleta-title">
                <h1>
                    {coleta?.nomeColeta || `Coleta ${id}`}
                </h1>
            </div>

            <nav className="coletas-header">

                <NavLink
                    to="/home"
                    className="coleta-link"
                >
                    Voltar
                </NavLink>

                <NavLink
                    to={`/coleta/${id}`}
                    className="coleta-link"
                    end
                >
                    Início
                </NavLink>

                <NavLink
                    to={`/coleta/${id}/pontos`}
                    className="coleta-link"
                >
                    Pontos
                </NavLink>

                <NavLink
                    to={`/coleta/${id}/grupos`}
                    className="coleta-link"
                >
                    Grupos
                </NavLink>

                <NavLink
                    to={`/coleta/${id}/otimizacao`}
                    className="coleta-link"
                >
                    Otimização
                </NavLink>

                <NavLink
                    to={`/coleta/${id}/configuracoes`}
                    className="coleta-link"
                >
                    Configurações
                </NavLink>

            </nav>

        </div>
    );
}

export default HeaderColetas;