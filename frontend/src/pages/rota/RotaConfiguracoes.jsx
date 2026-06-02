import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRotas from "../../components/HeaderRotas";
import "../Rota.css";

function RotaConfiguracoes() {
    const { id } = useParams();

    const [mostrarModal, setMostrarModal] = useState(false);

    const excluirRota = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/rotas/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                alert("Erro ao excluir rota");
                return;
            }

            window.location.href = "/home";

        } catch (error) {
            alert("Erro ao excluir rota");
        }
    };

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">
                    <h1>Configurações da Rota {id}</h1>

                    <p>Implementar: Adicionar outros usuários</p>
                    <p>Dependente: Backend filtro por usuário e endpoint para compartilhar rota</p>
                    <p>Implementar: Remover usuários da rota</p>
                </div>

                <br />

                <button
                    className="btn-delete"
                    onClick={() => setMostrarModal(true)}
                >
                    Excluir Rota
                </button>
            </div>

            {mostrarModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Excluir rota</h2>

                        <p>
                            Tem certeza que deseja excluir a rota <br />
                            <strong>#{id}</strong>?
                        </p>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center"
                            }}
                        >
                            <button
                                onClick={() => setMostrarModal(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={excluirRota}
                                style={{
                                    background: "#ff4c4c",
                                    color: "white"
                                }}
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

export default RotaConfiguracoes;