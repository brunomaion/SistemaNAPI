import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderColetas from "../../components/HeaderColetas";
import "./Coleta.css";

function ColetaConfiguracoes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [coleta, setColeta] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        async function carregarColeta() {
            try {
                const response = await fetch(`http://localhost:8080/coletas/${id}`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar coleta");
                }

                setColeta(await response.json());
            } catch (error) {
                console.error("Erro ao buscar coleta:", error);
            }
        }

        if (id) {
            carregarColeta();
        }
    }, [id]);

    const excluirColeta = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/coletas/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                alert("Erro ao excluir Coleta");
                return;
            }

            navigate("/home");

        } catch {
            alert("Erro ao excluir Coleta");
        }
    };

    return (
        <div className="coleta-container">
            <Header />

            <div className="coleta-content">
                <HeaderColetas />

                <div className="coleta-subcontainer">

                    <h4>Gerencie as ações disponíveis para a  coleta: {coleta?.nomeColeta || id}</h4>
                    <br></br>
                    <button
                    className="btn-delete btn-excluirColeta"
                    onClick={() => setMostrarModal(true)}
                    >
                        Excluir Coleta
                    </button>
                </div>


            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Excluir coleta</h2>

                        <p>
                            Tem certeza que deseja excluir a coleta <br />
                            <strong>{coleta?.nomeColeta || `Coleta ${id}`}</strong>?
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancelar"
                                onClick={() => setMostrarModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-modal-excluir"
                                onClick={excluirColeta}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ColetaConfiguracoes;