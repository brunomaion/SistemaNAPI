import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import HeaderRegioes from "../components/HeaderRegioes";
import "./Regiao/Regiao.css";

function Regiao() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [regiao, setRegiao] = useState(null);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        carregarRegiao();
    }, [id]);

    async function carregarRegiao() {
        try {
            const resposta = await fetch(`http://localhost:8080/regioes/${id}`);

            if (!resposta.ok) {
                throw new Error("Erro ao buscar região");
            }

            const dados = await resposta.json();

            setRegiao(dados);
            setGrupos(dados.grupos || []);
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    async function adicionarGrupo() {
        try {
            const resposta = await fetch(
                `http://localhost:8080/regioes/${id}/grupos`,
                {
                    method: "POST"
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao criar grupo");
            }

            const novoGrupo = await resposta.json();

            setGrupos([...grupos, novoGrupo]);
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    function abrirGrupo(grupo) {
        navigate(`/grupo/${grupo.id}`);
    }

    if (!regiao) {
        return (
            <div className="regiao-container">
                <Header />
                <div className="regiao-content">
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />


                <div className="regiao-subcontainer">
                    <p>
                        <strong>Data de início:</strong>{" "}
                        {regiao.dataInicio}
                    </p>

                    <p>
                        <strong>Data de término:</strong>{" "}
                        {regiao.dataFim}
                    </p>

                    <div className="grupos-header">
                        <h2>Grupos</h2>

                        <button
                            className="btn-add"
                            onClick={adicionarGrupo}
                        >
                            Adicionar Grupo
                        </button>
                    </div>

                    <div className="grupos-container">
                        {grupos.length === 0 ? (
                            <p>
                                Esta região ainda não possui grupos.
                            </p>
                        ) : (
                            grupos.map((grupo) => (
                                <div
                                    className="grupo-card"
                                    key={grupo.id}
                                    onClick={() => abrirGrupo(grupo)}
                                >
                                    <h3>
                                        Grupo {grupo.numero}
                                    </h3>

                                    <p>
                                        Pontos:{" "}
                                        {grupo.pontos?.length || 0}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>



            </div>
        </div>
    );
}

export default Regiao;
