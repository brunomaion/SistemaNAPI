import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./HeaderRegioes.css";

function HeaderRegioes() {
    const { id } = useParams();
    const [regiao, setRegiao] = useState(null);

    useEffect(() => {
        async function carregarRegiao() {
            try {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar região");
                }

                const data = await response.json();

                setRegiao(data);
            } catch (error) {
                console.error("Erro ao buscar região:", error);
            }
        }

        if (id) {
            carregarRegiao();
        }
    }, [id]);

    return (
        <div className="header-regioes">

            <div className="regioes-header regiao-title">
                <h1>
                    {regiao?.nomeRegiao || `Região ${id}`}
                </h1>
            </div>

            <nav className="regioes-header">

                <NavLink
                    to="/home"
                    className="regiao-link"
                >
                    Voltar
                </NavLink>

                <NavLink
                    to={`/regiao/${id}`}
                    className="regiao-link"
                    end
                >
                    Início
                </NavLink>

                <NavLink
                    to={`/regiao/${id}/grupos`}
                    className="regiao-link"
                >
                    Grupos
                </NavLink>

                <NavLink
                    to={`/regiao/${id}/otimizacao`}
                    className="regiao-link"
                >
                    Otimização
                </NavLink>

                <NavLink
                    to={`/regiao/${id}/configuracoes`}
                    className="regiao-link"
                >
                    Configurações
                </NavLink>

            </nav>

        </div>
    );
}

export default HeaderRegioes;
