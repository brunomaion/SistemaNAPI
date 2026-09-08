import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRegioes from "../../components/HeaderRegioes";
import MapaRota from "../../components/MapaRota";
import "./Regiao.css";

function RegiaoPontos() {
    const { id } = useParams();

    const [grupos, setGrupos] = useState([]);
    const [editKey, setEditKey] = useState(null);
    const [previewKey, setPreviewKey] = useState(null);
    const [previewVersion, setPreviewVersion] = useState(0);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (id) carregarGrupos();
    }, [id]);

    useEffect(() => {
        if (!mensagem) return;

        const timeout = setTimeout(() => setMensagem(""), 4000);
        return () => clearTimeout(timeout);
    }, [mensagem]);

    async function carregarGrupos() {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos`
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar grupos");
            }

            setGrupos(await response.json());
        } catch (err) {
            console.error("Erro ao buscar grupos:", err);
        }
    }

    const atualizarCampoPonto = (grupoId, index, field, value) => {
        setGrupos((anterior) =>
            anterior.map((grupo) =>
                grupo.id !== grupoId
                    ? grupo
                    : {
                          ...grupo,
                          pontos: grupo.pontos.map((ponto, i) =>
                              i === index ? { ...ponto, [field]: value } : ponto
                          )
                      }
            )
        );
    };

    const adicionarPonto = (grupoId) => {
        setGrupos((anterior) =>
            anterior.map((grupo) =>
                grupo.id !== grupoId
                    ? grupo
                    : {
                          ...grupo,
                          pontos: [
                              ...(grupo.pontos || []),
                              { nomePonto: "", latitude: "", longitude: "" }
                          ]
                      }
            )
        );

        const grupo = grupos.find((g) => g.id === grupoId);
        setEditKey(`${grupoId}-${(grupo?.pontos || []).length}`);
    };

    const salvarPonto = async (grupoId, index) => {
        const grupo = grupos.find((g) => g.id === grupoId);
        const ponto = grupo.pontos[index];

        const payload = {
            nomePonto: ponto.nomePonto || "",
            latitude: ponto.latitude === "" ? null : Number(ponto.latitude),
            longitude: ponto.longitude === "" ? null : Number(ponto.longitude)
        };

        try {
            if (ponto.id) {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos/${ponto.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao atualizar ponto");
                }
            } else {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify([payload])
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao criar ponto");
                }
            }

            setEditKey(null);
            await carregarGrupos();
            setMensagem("Ponto salvo com sucesso.");
        } catch (err) {
            console.error("Erro ao salvar ponto:", err);
        }
    };

    const removerPonto = async (grupoId, index) => {
        const grupo = grupos.find((g) => g.id === grupoId);
        const ponto = grupo.pontos[index];

        try {
            if (ponto.id) {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos/${ponto.id}`,
                    { method: "DELETE" }
                );

                if (!response.ok) {
                    throw new Error("Erro ao excluir ponto");
                }
            }

            setEditKey(null);
            await carregarGrupos();
            setMensagem("Ponto excluído com sucesso.");
        } catch (err) {
            console.error("Erro ao excluir ponto:", err);
        }
    };

    const moverPonto = async (grupoId, pontoId, novoGrupoId) => {
        if (!novoGrupoId || novoGrupoId === grupoId) return;

        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos/${pontoId}/grupo/${novoGrupoId}`,
                { method: "PUT" }
            );

            if (!response.ok) {
                throw new Error("Erro ao mover ponto");
            }

            await carregarGrupos();

            const grupoDestino = grupos.find((g) => g.id === Number(novoGrupoId));
            setMensagem(
                `Ponto movido para o Grupo ${grupoDestino?.numero ?? ""}.`
            );
        } catch (err) {
            console.error("Erro ao mover ponto:", err);
        }
    };

    const carregarCSV = (grupoId, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (event) => {
            const text = event.target.result;
            const linhas = text.split("\n").filter((l) => l.trim() !== "");

            const novosPontos = linhas.map((linha) => {
                const separador = linha.includes(";") ? ";" : ",";
                const [nome, latitude, longitude] = linha
                    .split(separador)
                    .map((v) => v.trim());

                return {
                    nomePonto: nome || "",
                    latitude: latitude ? Number(latitude) : null,
                    longitude: longitude ? Number(longitude) : null
                };
            });

            try {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(novosPontos)
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao importar pontos");
                }

                await carregarGrupos();
                setMensagem(`${novosPontos.length} ponto(s) importado(s) com sucesso.`);
            } catch (err) {
                console.error("Erro ao importar CSV:", err);
            }
        };

        reader.readAsText(file);
        e.target.value = "";
    };

    if (!grupos.length) {
        return (
            <div className="regiao-container">
                <Header />

                <div className="regiao-content">
                    <HeaderRegioes />

                    <div className="regiao-subcontainer">
                        <p>Carregando...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />

                {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

                {grupos.map((grupo) => (
                    <div className="regiao-subcontainer" key={grupo.id}>
                        <div className="regiao-info pontos-info">
                            <div className="regiao-info-header">
                                <h3 style={{ marginRight: "auto" }}>
                                    Grupo {grupo.numero}
                                </h3>

                                <button
                                    className="btn"
                                    onClick={() => adicionarPonto(grupo.id)}
                                >
                                    + Adicionar ponto
                                </button>

                                <input
                                    type="file"
                                    accept=".csv"
                                    id={`csvUpload-${grupo.id}`}
                                    style={{ display: "none" }}
                                    onChange={(e) => carregarCSV(grupo.id, e)}
                                />

                                <button
                                    className="btn"
                                    onClick={() =>
                                        document
                                            .getElementById(`csvUpload-${grupo.id}`)
                                            .click()
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

                                {(grupo.pontos || []).map((ponto, index) => {
                                    const key = `${grupo.id}-${index}`;

                                    return (
                                        <div key={ponto.id ?? key}>
                                            <div className="pontos-row">
                                                {editKey === key ? (
                                                    <>
                                                        <input
                                                            value={ponto.nomePonto || ""}
                                                            onChange={(e) =>
                                                                atualizarCampoPonto(
                                                                    grupo.id,
                                                                    index,
                                                                    "nomePonto",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        <input
                                                            value={ponto.latitude ?? ""}
                                                            onChange={(e) =>
                                                                atualizarCampoPonto(
                                                                    grupo.id,
                                                                    index,
                                                                    "latitude",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        <input
                                                            value={ponto.longitude ?? ""}
                                                            onChange={(e) =>
                                                                atualizarCampoPonto(
                                                                    grupo.id,
                                                                    index,
                                                                    "longitude",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        <div className="actions">
                                                            <button
                                                                onClick={() =>
                                                                    salvarPonto(grupo.id, index)
                                                                }
                                                            >
                                                                Salvar
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>{ponto.nomePonto}</span>
                                                        <span>{ponto.latitude}</span>
                                                        <span>{ponto.longitude}</span>

                                                        <div className="actions">
                                                            {grupos.length > 1 && (
                                                                <select
                                                                    defaultValue=""
                                                                    onChange={(e) =>
                                                                        moverPonto(
                                                                            grupo.id,
                                                                            ponto.id,
                                                                            Number(e.target.value)
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="" disabled>
                                                                        Mover para...
                                                                    </option>
                                                                    {grupos
                                                                        .filter((g) => g.id !== grupo.id)
                                                                        .map((g) => (
                                                                            <option key={g.id} value={g.id}>
                                                                                Grupo {g.numero}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            )}

                                                            <button
                                                                onClick={() =>
                                                                    setEditKey(key)
                                                                }
                                                            >
                                                                Editar
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    removerPonto(grupo.id, index)
                                                                }
                                                                className="btn-danger"
                                                            >
                                                                Excluir
                                                            </button>

                                                            <button
                                                                className="btn-preview"
                                                                onClick={() => {
                                                                    if (previewKey === key) {
                                                                        setPreviewKey(null);
                                                                        return;
                                                                    }

                                                                    setPreviewKey(key);
                                                                    setPreviewVersion((v) => v + 1);
                                                                }}
                                                            >
                                                                {previewKey === key ? "Ocultar" : "Preview"}
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {previewKey === key && (
                                                <div className="preview-mapa">
                                                    <MapaRota
                                                        key={`${key}-${previewVersion}`}
                                                        pontos={[
                                                            {
                                                                nome: ponto.nomePonto,
                                                                lat: Number(ponto.latitude),
                                                                lng: Number(ponto.longitude)
                                                            }
                                                        ]}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {(grupo.pontos || []).length === 0 && (
                                    <div className="pontos-row">
                                        <span>Nenhum ponto neste grupo.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RegiaoPontos;
