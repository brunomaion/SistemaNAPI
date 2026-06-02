import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const [mensagem, setMensagem] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("usuario");

        if (user) {
            navigate("/home");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/usuarios/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        senha,
                    }),
                }
            );

            const data = await response.json();

            setMensagem(data.mensagem);

            if (data.sucesso) {
                const usuarioResposta = data.usuario || data.user || {};

                const usuarioLogado = {
                    ...usuarioResposta,
                    id: data.id ?? usuarioResposta.id,
                    username: usuarioResposta.username || username,
                    nome: usuarioResposta.nome || data.nome || username,
                    email: usuarioResposta.email || data.email || "",
                };

                localStorage.setItem("usuario", JSON.stringify(usuarioLogado));
                navigate("/home");
            }
        } catch {
            setMensagem("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="container">


            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div>
                    <label>Usuário</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">
                    Entrar
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/cadastro")}
                >
                    Cadastrar
                </button>

                <div className="mensagem">
                    {mensagem && <p>{mensagem}</p>}
                </div>

            </form>
        </div>
    );
}

export default Login;
