import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRotas from "../../components/HeaderRotas";

function RotaPontos() {
    const { id } = useParams();

    const [rota, setRota] = useState(null);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        buscarRota();
    }, []);

    const buscarRota = async () => {
        try {
            const response = await fetch(`http://localhost:8080/rotas/${id}`);
            const data = await response.json();
            setRota(data);
        } catch (err) {
            console.log("Erro ao buscar rota", err);
        }
    };

    const salvarRota = async (rotaAtualizada) => {
        try {
            await fetch(`http://localhost:8080/rotas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(rotaAtualizada)
            });

            buscarRota();
        } catch (err) {
            console.log("Erro ao salvar rota", err);
        }
    };

    const adicionarPonto = () => {
        const novosPontos = [
            ...rota.pontos,
            {
                nome: "",
                lat: "",
                lng: ""
            }
        ];

        const rotaAtualizada = {
            ...rota,
            pontos: novosPontos
        };

        setRota(rotaAtualizada);
        setEditIndex(novosPontos.length - 1);
    };

    const atualizarPonto = (index, field, value) => {
        const novosPontos = [...rota.pontos];

        novosPontos[index] = {
            ...novosPontos[index],
            [field]: value
        };

        setRota({
            ...rota,
            pontos: novosPontos
        });
    };

    const salvar = () => {
        salvarRota(rota);
        setEditIndex(null);
    };


    const removerPonto = (index) => {
        const novosPontos = rota.pontos.filter((_, i) => i !== index);

        const rotaAtualizada = {
            ...rota,
            pontos: novosPontos
        };

        setRota(rotaAtualizada);
        salvarRota(rotaAtualizada);

        setEditIndex(null);
    };

    const carregarCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const text = event.target.result;

            // detecta separador automaticamente
            const linhas = text.split("\n").filter(l => l.trim() !== "");

            const novosPontos = linhas.map((linha) => {
                const separador = linha.includes(";") ? ";" : ",";

                const [nome, lat, lng] = linha.split(separador).map(v => v.trim());

                return {
                    nome: nome || "",
                    lat: lat || "",
                    lng: lng || ""
                };
            });

            const rotaAtualizada = {
                ...rota,
                pontos: [...(rota.pontos || []), ...novosPontos]
            };

            setRota(rotaAtualizada);
            salvarRota(rotaAtualizada);
        };

        reader.readAsText(file);
    };
        

    if (!rota) return <div>Carregando...</div>;

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderRotas />

                <div className="rota-info">

                    <div className="rota-info-header">
                        <button className="btn" onClick={adicionarPonto}>
                            + Adicionar ponto
                        </button>

                        <input
                            type="file"
                            accept=".csv"
                            id="csvUpload"
                            style={{ display: "none" }}
                            onChange={carregarCSV}
                        />

                        <button className="btn" onClick={() => document.getElementById("csvUpload").click()}>
                            Carregar CSV
                        </button>
                    </div>

                    <ul>
                        <div className="pontos-table">
                            <div className="pontos-header">
                                <span>Nome</span>
                                <span>Latitude</span>
                                <span>Longitude</span>
                                <span>Ações</span>
                            </div>

                            {rota.pontos?.map((ponto, index) => (
                                <div className="pontos-row" key={index}>
                                    {editIndex === index ? (
                                        <>
                                            <input
                                                value={ponto.nome || ""}
                                                onChange={(e) =>
                                                    atualizarPonto(index, "nome", e.target.value)
                                                }
                                            />

                                            <input
                                                value={ponto.lat || ""}
                                                onChange={(e) =>
                                                    atualizarPonto(index, "lat", e.target.value)
                                                }
                                            />

                                            <input
                                                value={ponto.lng || ""}
                                                onChange={(e) =>
                                                    atualizarPonto(index, "lng", e.target.value)
                                                }
                                            />

                                            <div className="actions">
                                                <button onClick={salvar}>Salvar</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span>{ponto.nome}</span>
                                            <span>{ponto.lat}</span>
                                            <span>{ponto.lng}</span>

                                            <div className="actions">
                                                <button onClick={() => setEditIndex(index)}>
                                                    Editar
                                                </button>

                                                <button
                                                    onClick={() => removerPonto(index)}
                                                    className="btn-danger"
                                                >
                                                    Excluir
                                                </button>

                                                <button
                                                    className="btn-preview"
                                                    onClick={() =>
                                                        window.open(
                                                            `https://www.openstreetmap.org/?mlat=${ponto.lat}&mlon=${ponto.lng}#map=16/${ponto.lat}/${ponto.lng}`,
                                                            "_blank"
                                                        )
                                                    }
                                                >
                                                    Preview
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default RotaPontos;