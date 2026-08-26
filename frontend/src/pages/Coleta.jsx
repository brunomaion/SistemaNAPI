import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import HeaderColetas from "../components/HeaderColetas";
import "./Coleta/Coleta.css";

function Coleta() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coleta, setColeta] = useState(null);
    const [grupos, setGrupos] = useState([]);

    useEffect(() => {
        carregarColeta();
    }, [id]);

    async function carregarColeta() {
        try {
            const resposta = await fetch(`http://localhost:8080/coletas/${id}`);

            if (!resposta.ok) {
                throw new Error("Erro ao buscar coleta");
            }

            const dados = await resposta.json();

            setColeta(dados);
            setGrupos(dados.grupos || []);
        } catch (erro) {
            console.error("Erro:", erro);
        }
    }

    async function adicionarGrupo() {
        try {
            const resposta = await fetch(
                `http://localhost:8080/coletas/${id}/grupos`,
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

    if (!coleta) {
        return (
            <div className="coleta-container">
                <Header />
                <div className="coleta-content">
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="coleta-container">
            <Header />

            <div className="coleta-content">
                <HeaderColetas />


                <div className="coleta-subcontainer">
                    <p>
                        <strong>Data de início:</strong>{" "}
                        {coleta.dataInicio}
                    </p>

                    <p>
                        <strong>Data de término:</strong>{" "}
                        {coleta.dataFim}
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
                                Esta coleta ainda não possui grupos.
                            </p>
                        ) : (
                            grupos.map((grupo) => (
                                <div
                                    className="grupo-card"
                                    key={grupo.id}
                                    onClick={() => abrirGrupo(grupo)}
                                >
                                    <h3>
                                        Grupo {grupo.id}
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

export default Coleta;