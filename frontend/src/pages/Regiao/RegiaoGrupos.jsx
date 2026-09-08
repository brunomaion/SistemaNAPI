import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderRegioes from "../../components/HeaderRegioes";
import MapaRota from "../../components/MapaRota";
import "./Regiao.css";

const CORES_GRUPOS = [
    "#e6194b",
    "#3cb44b",
    "#4363d8",
    "#f58231",
    "#911eb4",
    "#42d4f4",
    "#f032e6",
    "#bfef45",
    "#469990",
    "#9a6324"
];

function RegiaoGrupos() {
    const { id } = useParams();

    const [grupos, setGrupos] = useState([]);
    const [grupoExpandido, setGrupoExpandido] = useState(null);
    const [pontosPorGrupo, setPontosPorGrupo] = useState({});
    const [grupoParaExcluir, setGrupoParaExcluir] = useState(null);
    const [excluirPontosJunto, setExcluirPontosJunto] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [editandoPontoId, setEditandoPontoId] = useState(null);
    const [previewPontoId, setPreviewPontoId] = useState(null);
    const [previewVersion, setPreviewVersion] = useState(0);
    const [grupoDestinoId, setGrupoDestinoId] = useState(null);
    const [modalAdicionarPonto, setModalAdicionarPonto] = useState(false);
    const [novoPonto, setNovoPonto] = useState({
        nomePonto: "",
        latitude: "",
        longitude: ""
    });

    useEffect(() => {
        if (!mensagem) return;

        const timeout = setTimeout(() => setMensagem(""), 4000);
        return () => clearTimeout(timeout);
    }, [mensagem]);

    useEffect(() => {
        if (id) carregarGrupos();
    }, [id]);

    const grupoDestinoEfetivo =
        grupoDestinoId && grupos.some((g) => g.id === grupoDestinoId)
            ? grupoDestinoId
            : (grupos.find((g) => g.numero === 1) || grupos[0])?.id ?? null;

    async function carregarGrupos() {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos`
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar grupos");
            }

            setGrupos(await response.json());
        } catch (error) {
            console.error("Erro ao buscar grupos:", error);
        }
    }

    async function carregarPontosDoGrupo(grupoId) {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos`
            );

            if (!response.ok) {
                throw new Error("Erro ao buscar pontos do grupo");
            }

            const dados = await response.json();

            setPontosPorGrupo((anterior) => ({
                ...anterior,
                [grupoId]: dados
            }));
        } catch (error) {
            console.error("Erro ao buscar pontos do grupo:", error);
        }
    }

    const atualizarCampoPonto = (grupoId, pontoId, field, value) => {
        setPontosPorGrupo((anterior) => ({
            ...anterior,
            [grupoId]: (anterior[grupoId] || []).map((ponto) =>
                ponto.id === pontoId ? { ...ponto, [field]: value } : ponto
            )
        }));
    };

    const salvarPonto = async (grupoId, ponto) => {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos/${ponto.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nomePonto: ponto.nomePonto || "",
                        latitude:
                            ponto.latitude === "" || ponto.latitude === null
                                ? null
                                : Number(ponto.latitude),
                        longitude:
                            ponto.longitude === "" || ponto.longitude === null
                                ? null
                                : Number(ponto.longitude)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao atualizar ponto");
            }

            setEditandoPontoId(null);
            await carregarPontosDoGrupo(grupoId);
            setMensagem("Ponto atualizado com sucesso.");
        } catch (error) {
            console.error("Erro ao atualizar ponto:", error);
        }
    };

    const excluirPonto = async (grupoId, ponto) => {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoId}/pontos/${ponto.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir ponto");
            }

            await Promise.all([
                carregarPontosDoGrupo(grupoId),
                carregarGrupos()
            ]);

            setMensagem(`Ponto "${ponto.nomePonto}" excluído com sucesso.`);
        } catch (error) {
            console.error("Erro ao excluir ponto:", error);
        }
    };

    const moverPontoParaGrupo = async (grupoOrigemId, pontoId, grupoDestinoId) => {
        if (!grupoDestinoId || grupoDestinoId === grupoOrigemId) return;

        try {
            await moverPonto(grupoOrigemId, pontoId, grupoDestinoId);

            await Promise.all([
                carregarPontosDoGrupo(grupoOrigemId),
                carregarPontosDoGrupo(grupoDestinoId),
                carregarGrupos()
            ]);

            const grupoDestino = grupos.find((g) => g.id === grupoDestinoId);
            setMensagem(
                `Ponto movido para o Grupo ${grupoDestino?.numero ?? ""}.`
            );
        } catch (error) {
            console.error("Erro ao mover ponto:", error);
        }
    };

    const corDoGrupo = (grupoId) => {
        const index = grupos.findIndex((g) => g.id === grupoId);
        return CORES_GRUPOS[(index < 0 ? 0 : index) % CORES_GRUPOS.length];
    };

    const pontosMapa = grupos.flatMap((grupo) =>
        (grupo.pontos || [])
            .filter((ponto) => ponto.latitude != null && ponto.longitude != null)
            .map((ponto) => ({
                nome: ponto.nomePonto,
                lat: Number(ponto.latitude),
                lng: Number(ponto.longitude),
                cor: corDoGrupo(grupo.id),
                grupoLabel: `Grupo ${grupo.numero}`
            }))
    );

    const alternarGrupo = (grupoId) => {
        if (grupoExpandido === grupoId) {
            setGrupoExpandido(null);
            return;
        }

        setGrupoExpandido(grupoId);

        if (!pontosPorGrupo[grupoId]) {
            carregarPontosDoGrupo(grupoId);
        }
    };

    const abrirModalAdicionarPonto = () => {
        setNovoPonto({ nomePonto: "", latitude: "", longitude: "" });
        setModalAdicionarPonto(true);
    };

    const salvarNovoPonto = async () => {
        if (!grupoDestinoEfetivo) return;

        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoDestinoEfetivo}/pontos`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify([
                        {
                            nomePonto: novoPonto.nomePonto || "",
                            latitude:
                                novoPonto.latitude === "" ? null : Number(novoPonto.latitude),
                            longitude:
                                novoPonto.longitude === "" ? null : Number(novoPonto.longitude)
                        }
                    ])
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao criar ponto");
            }

            setModalAdicionarPonto(false);

            await Promise.all([
                carregarGrupos(),
                carregarPontosDoGrupo(grupoDestinoEfetivo)
            ]);

            const grupoDestino = grupos.find((g) => g.id === grupoDestinoEfetivo);
            setMensagem(`Ponto adicionado ao Grupo ${grupoDestino?.numero ?? ""}.`);
        } catch (error) {
            console.error("Erro ao criar ponto:", error);
        }
    };

    const carregarCSVGeral = (e) => {
        const file = e.target.files[0];
        if (!file || !grupoDestinoEfetivo) return;

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
                    `http://localhost:8080/regioes/${id}/grupos/${grupoDestinoEfetivo}/pontos`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(novosPontos)
                    }
                );

                if (!response.ok) {
                    throw new Error("Erro ao importar pontos");
                }

                await Promise.all([
                    carregarGrupos(),
                    carregarPontosDoGrupo(grupoDestinoEfetivo)
                ]);

                const grupoDestino = grupos.find((g) => g.id === grupoDestinoEfetivo);
                setMensagem(
                    `${novosPontos.length} ponto(s) importado(s) para o Grupo ${grupoDestino?.numero ?? ""}.`
                );
            } catch (error) {
                console.error("Erro ao importar CSV:", error);
            }
        };

        reader.readAsText(file);
        e.target.value = "";
    };

    const adicionarGrupo = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos`,
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error("Erro ao criar grupo");
            }

            await carregarGrupos();
            setMensagem("Grupo adicionado com sucesso.");
        } catch (error) {
            console.error("Erro ao criar grupo:", error);
        }
    };

    const moverPonto = async (grupoOrigemId, pontoId, grupoDestinoId) => {
        const response = await fetch(
            `http://localhost:8080/regioes/${id}/grupos/${grupoOrigemId}/pontos/${pontoId}/grupo/${grupoDestinoId}`,
            { method: "PUT" }
        );

        if (!response.ok) {
            throw new Error("Erro ao mover ponto");
        }
    };

    const excluirGrupo = async () => {
        if (!grupoParaExcluir) return;

        try {
            const outrosGrupos = grupos.filter(
                (g) => g.id !== grupoParaExcluir.id
            );

            const grupoDestino =
                outrosGrupos.find((g) => g.numero === 1) ||
                (outrosGrupos.length === 1 ? outrosGrupos[0] : null);

            const pontos = grupoParaExcluir.pontos || [];
            const vaiMoverPontos = !excluirPontosJunto && pontos.length > 0 && grupoDestino;

            if (vaiMoverPontos) {
                await Promise.all(
                    pontos.map((ponto) =>
                        moverPonto(grupoParaExcluir.id, ponto.id, grupoDestino.id)
                    )
                );
            }

            const response = await fetch(
                `http://localhost:8080/regioes/${id}/grupos/${grupoParaExcluir.id}`,
                { method: "DELETE" }
            );

            if (!response.ok) {
                throw new Error("Erro ao excluir grupo");
            }

            setGrupoParaExcluir(null);
            setPontosPorGrupo((anterior) => {
                const atualizado = { ...anterior };
                delete atualizado[grupoParaExcluir.id];
                if (vaiMoverPontos) delete atualizado[grupoDestino.id];
                return atualizado;
            });

            await carregarGrupos();

            setMensagem(
                vaiMoverPontos
                    ? `Grupo ${grupoParaExcluir.numero} excluído. ${pontos.length} ponto(s) movido(s) para o Grupo ${grupoDestino.numero}.`
                    : pontos.length > 0
                        ? `Grupo ${grupoParaExcluir.numero} e ${pontos.length} ponto(s) excluídos com sucesso.`
                        : `Grupo ${grupoParaExcluir.numero} excluído com sucesso.`
            );
        } catch (error) {
            console.error("Erro ao excluir grupo:", error);
        }
    };

    return (
        <div className="regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />

                <div className="regiao-subcontainer">
                    <div className="grupos-header">
                        <h2>Grupos</h2>

                        <button className="btn-add" onClick={adicionarGrupo}>
                            + Adicionar grupo
                        </button>
                    </div>

                    {grupos.length > 0 && (
                        <div className="grupos-acoes-gerais">
                            <label>
                                Adicionar pontos no:{" "}
                                <select
                                    value={grupoDestinoEfetivo ?? ""}
                                    onChange={(e) =>
                                        setGrupoDestinoId(Number(e.target.value))
                                    }
                                >
                                    {grupos.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            Grupo {g.numero}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <button className="btn" onClick={abrirModalAdicionarPonto}>
                                + Adicionar ponto
                            </button>

                            <input
                                type="file"
                                accept=".csv"
                                id="csvUploadGeral"
                                style={{ display: "none" }}
                                onChange={carregarCSVGeral}
                            />

                            <button
                                className="btn"
                                onClick={() =>
                                    document.getElementById("csvUploadGeral").click()
                                }
                            >
                                Carregar CSV
                            </button>
                        </div>
                    )}

                    {mensagem && (
                        <div className="mensagem-sucesso">{mensagem}</div>
                    )}

                    {pontosMapa.length > 0 && (
                        <div className="grupos-mapa-preview">
                            <MapaRota pontos={pontosMapa} />

                            <div className="grupos-legenda">
                                {grupos.map((grupo) => (
                                    <div className="legenda-item" key={grupo.id}>
                                        <span
                                            className="legenda-cor"
                                            style={{ background: corDoGrupo(grupo.id) }}
                                        />
                                        Grupo {grupo.numero}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {grupos.length === 0 ? (
                        <p>Nenhum grupo cadastrado.</p>
                    ) : (
                        <div className="grupos-container">
                            {grupos.map((grupo) => (
                                <div key={grupo.id} className="grupo-card">
                                    <div className="grupo-card-header">
                                        <h3>
                                            <span
                                                className="legenda-cor"
                                                style={{ background: corDoGrupo(grupo.id) }}
                                            />
                                            Grupo {grupo.numero}
                                        </h3>

                                        <button
                                            className="btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setExcluirPontosJunto(false);
                                                setGrupoParaExcluir(grupo);
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </div>

                                    <p>
                                        {grupo.pontos?.length || 0} ponto(s)
                                    </p>

                                    <button
                                        className="btn-preview"
                                        onClick={() => alternarGrupo(grupo.id)}
                                    >
                                        {grupoExpandido === grupo.id
                                            ? "Ocultar pontos"
                                            : "Ver pontos"}
                                    </button>

                                    {grupoExpandido === grupo.id && (
                                        <div className="pontos-table">
                                            <div className="pontos-header">
                                                <span>Nome</span>
                                                <span>Latitude</span>
                                                <span>Longitude</span>
                                                <span>Ações</span>
                                            </div>

                                            {(pontosPorGrupo[grupo.id] || []).map((ponto) => (
                                                <div key={ponto.id}>
                                                <div className="pontos-row">
                                                    {editandoPontoId === ponto.id ? (
                                                        <>
                                                            <input
                                                                value={ponto.nomePonto || ""}
                                                                onChange={(e) =>
                                                                    atualizarCampoPonto(
                                                                        grupo.id,
                                                                        ponto.id,
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
                                                                        ponto.id,
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
                                                                        ponto.id,
                                                                        "longitude",
                                                                        e.target.value
                                                                    )
                                                                }
                                                            />

                                                            <div className="actions">
                                                                <button
                                                                    onClick={() =>
                                                                        salvarPonto(grupo.id, ponto)
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
                                                                            moverPontoParaGrupo(
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

                                                                <div className="acoes-botoes">
                                                                    <button
                                                                        onClick={() =>
                                                                            setEditandoPontoId(ponto.id)
                                                                        }
                                                                    >
                                                                        Editar
                                                                    </button>

                                                                    <button
                                                                        className="btn-danger"
                                                                        onClick={() =>
                                                                            excluirPonto(grupo.id, ponto)
                                                                        }
                                                                    >
                                                                        Excluir
                                                                    </button>

                                                                    <button
                                                                        className="btn-preview"
                                                                        onClick={() => {
                                                                            if (previewPontoId === ponto.id) {
                                                                                setPreviewPontoId(null);
                                                                                return;
                                                                            }

                                                                            setPreviewPontoId(ponto.id);
                                                                            setPreviewVersion((v) => v + 1);
                                                                        }}
                                                                    >
                                                                        {previewPontoId === ponto.id
                                                                            ? "Ocultar"
                                                                            : "Preview"}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                {previewPontoId === ponto.id && (
                                                    <div className="preview-mapa">
                                                        <MapaRota
                                                            key={`${ponto.id}-${previewVersion}`}
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
                                            ))}

                                            {pontosPorGrupo[grupo.id]?.length === 0 && (
                                                <div className="pontos-row">
                                                    <span>Nenhum ponto neste grupo.</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {modalAdicionarPonto && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Adicionar ponto</h2>

                        <p>
                            Grupo de destino: <strong>
                                Grupo {grupos.find((g) => g.id === grupoDestinoEfetivo)?.numero}
                            </strong>
                        </p>

                        <div className="modal-form">
                            <input
                                placeholder="Nome"
                                value={novoPonto.nomePonto}
                                onChange={(e) =>
                                    setNovoPonto({ ...novoPonto, nomePonto: e.target.value })
                                }
                            />

                            <input
                                placeholder="Latitude"
                                value={novoPonto.latitude}
                                onChange={(e) =>
                                    setNovoPonto({ ...novoPonto, latitude: e.target.value })
                                }
                            />

                            <input
                                placeholder="Longitude"
                                value={novoPonto.longitude}
                                onChange={(e) =>
                                    setNovoPonto({ ...novoPonto, longitude: e.target.value })
                                }
                            />
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancelar"
                                onClick={() => setModalAdicionarPonto(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-modal-confirmar"
                                onClick={salvarNovoPonto}
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {grupoParaExcluir && (() => {
                const pontosDoGrupo = grupoParaExcluir.pontos || [];
                const outrosGrupos = grupos.filter(
                    (g) => g.id !== grupoParaExcluir.id
                );
                const grupoDestino =
                    outrosGrupos.find((g) => g.numero === 1) ||
                    (outrosGrupos.length === 1 ? outrosGrupos[0] : null);
                const podeEscolher = pontosDoGrupo.length > 0 && grupoDestino;

                return (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Excluir grupo</h2>

                        <p>
                            Tem certeza que deseja excluir o <br />
                            <strong>Grupo {grupoParaExcluir.numero}</strong>?
                        </p>

                        {podeEscolher && (
                            <div className="modal-form modal-opcoes">
                                <label>
                                    <input
                                        type="radio"
                                        name="opcaoExclusaoGrupo"
                                        checked={!excluirPontosJunto}
                                        onChange={() => setExcluirPontosJunto(false)}
                                    />
                                    Mover os {pontosDoGrupo.length} ponto(s) para o Grupo{" "}
                                    {grupoDestino.numero}
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="opcaoExclusaoGrupo"
                                        checked={excluirPontosJunto}
                                        onChange={() => setExcluirPontosJunto(true)}
                                    />
                                    Excluir o grupo e seus {pontosDoGrupo.length} ponto(s)
                                </label>
                            </div>
                        )}

                        {!podeEscolher && pontosDoGrupo.length > 0 && (
                            <p>
                                Os {pontosDoGrupo.length} ponto(s) deste grupo também serão
                                excluídos.
                            </p>
                        )}

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancelar"
                                onClick={() => setGrupoParaExcluir(null)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-modal-excluir"
                                onClick={excluirGrupo}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
                );
            })()}
        </div>
    );
}

export default RegiaoGrupos;
