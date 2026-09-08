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

function RegiaoOtimizacao() {
    const { id } = useParams();

    const [grupos, setGrupos] = useState([]);
    const [numGrupos, setNumGrupos] = useState(3);
    const [confirmando, setConfirmando] = useState(false);
    const [executando, setExecutando] = useState(false);
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");

    useEffect(() => {
        if (!mensagem) return;

        const timeout = setTimeout(() => setMensagem(""), 4000);
        return () => clearTimeout(timeout);
    }, [mensagem]);

    useEffect(() => {
        if (!id) return;

        async function carregarGrupos() {
            try {
                const response = await fetch(
                    `http://localhost:8080/regioes/${id}/grupos`
                );

                if (!response.ok) {
                    throw new Error("Erro ao buscar grupos");
                }

                const dados = await response.json();
                setGrupos(dados);

                if (dados.length > 0) {
                    setNumGrupos(dados.length);
                }
            } catch (error) {
                console.error("Erro ao buscar grupos:", error);
            }
        }

        carregarGrupos();
    }, [id]);

    const totalPontos = grupos.reduce(
        (total, grupo) => total + (grupo.pontos?.length || 0),
        0
    );

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

    const executarClusterizacao = async () => {
        setExecutando(true);
        setErro("");

        try {
            const response = await fetch(
                `http://localhost:8080/regioes/${id}/otimizacao/clusterizar?numGrupos=${numGrupos}`,
                { method: "POST" }
            );

            if (!response.ok) {
                const texto = await response.text();
                throw new Error(texto || "Erro ao executar a clusterização");
            }

            const dados = await response.json();
            setGrupos(dados);
            setConfirmando(false);
            setMensagem(
                `Clusterização concluída: ${totalPontos} ponto(s) reorganizado(s) em ${dados.length} grupo(s).`
            );
        } catch (error) {
            console.error("Erro ao clusterizar:", error);
            setErro(error.message || "Erro ao executar a clusterização");
        } finally {
            setExecutando(false);
        }
    };

    return (
        <div className="regiao-container">
            <Header />

            <div className="regiao-content">
                <HeaderRegioes />

                <div className="regiao-subcontainer">
                    <h2>Otimização por clusters</h2>
                    <p>
                        Reorganiza automaticamente todos os pontos da região em
                        grupos por proximidade geográfica (KMeans).
                    </p>

                    {mensagem && (
                        <div className="mensagem-sucesso">{mensagem}</div>
                    )}

                    {erro && <div className="mensagem-erro">{erro}</div>}

                    <div className="grupos-acoes-gerais">
                        <label>
                            Número de grupos:{" "}
                            <input
                                type="number"
                                min={1}
                                max={totalPontos || 1}
                                value={numGrupos}
                                onChange={(e) => setNumGrupos(Number(e.target.value))}
                                style={{ width: "70px" }}
                            />
                        </label>

                        <button
                            className="btn-add"
                            disabled={totalPontos === 0}
                            onClick={() => setConfirmando(true)}
                        >
                            Executar clusterização
                        </button>
                    </div>

                    <p>
                        {totalPontos} ponto(s) em {grupos.length} grupo(s) atualmente.
                    </p>

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
                                        Grupo {grupo.numero} ({grupo.pontos?.length || 0})
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {confirmando && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Executar clusterização</h2>

                        <p>
                            Isso vai apagar os grupos atuais e recriar{" "}
                            <strong>{numGrupos}</strong> novo(s) grupo(s),
                            redistribuindo os {totalPontos} ponto(s) da região por
                            proximidade. Essa ação não pode ser desfeita.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn-modal-cancelar"
                                onClick={() => setConfirmando(false)}
                                disabled={executando}
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn-modal-excluir"
                                onClick={executarClusterizacao}
                                disabled={executando}
                            >
                                {executando ? "Executando..." : "Confirmar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegiaoOtimizacao;
