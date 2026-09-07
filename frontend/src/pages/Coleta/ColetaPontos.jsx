import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderColetas from "../../components/HeaderColetas";
import MapaRota from "../../components/MapaRota";
import "./Coleta.css";


function ColetaPontos() {
    const { id } = useParams();
    const [previewIndex, setPreviewIndex] = useState(null);
    const [previewVersion, setPreviewVersion] = useState(0);
    const [coleta, setColeta] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    

    useEffect(() => {
        async function carregarColeta() {
            try {
                const response = await fetch(`http://localhost:8080/coletas/${id}`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar coleta");
                }
                setColeta(await response.json());
            } catch (err) {
                console.log("Erro ao buscar Coleta", err);
            }
        }

        if (id) carregarColeta();
    }, [id]);

    const salvarColeta = async (coletaAtualizada) => {
        try {
            const response = await fetch(`http://localhost:8080/coletas/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(coletaAtualizada)
            });

            if (!response.ok) {
                throw new Error("Erro ao salvar coleta");
            }

            const responseAtualizado = await fetch(`http://localhost:8080/coletas/${id}`);
            if (!responseAtualizado.ok) {
                throw new Error("Erro ao carregar coleta atualizada");
            }
            setColeta(await responseAtualizado.json());
        } catch (err) {
            console.log("Erro ao salvar Coleta", err);
        }
    };

    const adicionarPonto = () => {
        const novosPontos = [
            ...(coleta.pontos || []),
            {
                nome: "",
                latitude: "",
                longitude: ""
            }
        ];

        const ColetaAtualizada = {
            ...coleta,
            pontos: novosPontos
        };

        setColeta(ColetaAtualizada);
        setEditIndex(novosPontos.length - 1);
    };

    const atualizarPonto = (index, field, value) => {
        const novosPontos = [...(coleta.pontos || [])];

        novosPontos[index] = {
            ...novosPontos[index],
            [field]: value
        };

        setColeta({
            ...coleta,
            pontos: novosPontos
        });
    };

    const salvar = () => {
        salvarColeta(coleta);
        setEditIndex(null);
    };


    const removerPonto = (index) => {
        const novosPontos = (coleta.pontos || []).filter((_, i) => i !== index);
        const novosGrupos = (coleta.grupos || []).map((grupo) => ({
            ...grupo,
            pontos: (grupo.pontos || [])
                .filter((pontoIndex) => pontoIndex !== index)
                .map((pontoIndex) => pontoIndex > index ? pontoIndex - 1 : pontoIndex)
        }));

        const ColetaAtualizada = {
            ...coleta,
            pontos: novosPontos,
            grupos: novosGrupos
        };

        setColeta(ColetaAtualizada);
        salvarColeta(ColetaAtualizada);

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

                const [nome, latitude, longitude] = linha
                    .split(separador)
                    .map(v => v.trim());

                return {
                    nome: nome || "",
                    latitude: latitude || "",
                    longitude: longitude || ""
                };
            });

            const ColetaAtualizada = {
                ...coleta,
                pontos: [...(coleta.pontos || []), ...novosPontos]
            };

            setColeta(ColetaAtualizada);
            salvarColeta(ColetaAtualizada);
        };

        reader.readAsText(file);
    };
        

    if (!coleta) return <div>Carregando...</div>;

return (
    <div className="coleta-container">
        <Header />

        <div className="coleta-content">
            <HeaderColetas />

            <div className="coleta-subcontainer">
                <div className="coleta-info pontos-info">
                <div className="coleta-info-header">
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

                    <button
                        className="btn"
                        onClick={() =>
                            document.getElementById("csvUpload").click()
                        }
                    >
                        Carregar CSV
                    </button>
                </div>

                <div className="pontos-table">
                    <div className="pontos-header">
                        <span>Nome</span>
                        <span>Latitude</span>
                        <span>Longitude</span>
                        <span>Ações</span>
                    </div>

                    {coleta.pontos?.map((ponto, index) => (
                        <div key={index}>
                            <div className="pontos-row">
                                {editIndex === index ? (
                                    <>
                                        <input
                                            value={ponto.nome || ""}
                                            onChange={(e) =>
                                                atualizarPonto(
                                                    index,
                                                    "nome",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            value={ponto.latitude ?? ""}
                                            onChange={(e) =>
                                                atualizarPonto(
                                                    index,
                                                    "latitude",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <input
                                            value={ponto.longitude ?? ""}
                                            onChange={(e) =>
                                                atualizarPonto(
                                                    index,
                                                    "longitude",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <div className="actions">
                                            <button onClick={salvar}>
                                                Salvar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>{ponto.nome}</span>
                                        <span>{ponto.latitude}</span>
                                        <span>{ponto.longitude}</span>

                                        <div className="actions">
                                            <button
                                                onClick={() =>
                                                    setEditIndex(index)
                                                }
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() =>
                                                    removerPonto(index)
                                                }
                                                className="btn-danger"
                                            >
                                                Excluir
                                            </button>

                                            <button
                                                className="btn-preview"
                                                onClick={() => {
                                                    if (previewIndex === index) {
                                                        setPreviewIndex(null);
                                                        return;
                                                    }

                                                    setPreviewIndex(index);
                                                    setPreviewVersion(v => v + 1);
                                                }}
                                            >
                                                {previewIndex === index ? "Ocultar" : "Preview"}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {previewIndex === index && (
                                <div className="preview-mapa">
                                <MapaRota
                                    key={`${index}-${previewVersion}`}
                                    pontos={[
                                        {
                                            nome: ponto.nome,
                                            lat: Number(ponto.latitude),
                                            lng: Number(ponto.longitude)
                                        }
                                    ]}
                                />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    </div>
);
}

export default ColetaPontos;