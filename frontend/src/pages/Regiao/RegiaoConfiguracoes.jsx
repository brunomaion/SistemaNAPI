import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRegioes from "../../components/HeaderRegioes";
import "./Regiao.css";

function RegiaoConfiguracoes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [regiao, setRegiao] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        async function carregarRegiao() {
            try {
                const response = await fetch(`http://localhost:8080/regioes/${id}`);

                if (!response.ok) {
                    throw new Error("Erro ao buscar região");
                }

                setRegiao(await response.json());
            } catch (error) {
                console.error("Erro ao buscar região:", error);
            }
        }

        if (id) {
            carregarRegiao();
        }
    }, [id]);

    const excluirRegiao = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                alert("Erro ao excluir Região");
                return;
            }

            navigate("/home");

        } catch {
            alert("Erro ao excluir Região");
        }
    };

    return (
        <div className="regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />

                <div className="regiao-subcontainer">

                    <h4>Gerencie as ações disponíveis para a  região: {regiao?.nomeRegiao || id}</h4>
                    <br></br>
                    <button
                    className="btn-delete btn-excluirRegiao"
                    onClick={() => setMostrarModal(true)}
                    >
                        Excluir Região
                    </button>
                </div>


            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Excluir região</h2>

                        <p>
                            Tem certeza que deseja excluir a região <br />
                            <strong>{regiao?.nomeRegiao || `Região ${id}`}</strong>?
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
                                onClick={excluirRegiao}
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

export default RegiaoConfiguracoes;
