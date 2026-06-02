import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Cadastro() {
    const [username, setUsername] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [telefone, setTelefone] = useState("");
    const [endereco, setEndereco] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [cadastroSucesso, setCadastroSucesso] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:8080/usuarios",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        nome,
                        email,
                        senha,
                        telefone,
                        endereco,
                    }),
                }
            );

            const data = await response.json();

            setMensagem(data.mensagem);

            if (data.sucesso) {
                setCadastroSucesso(true);
            }

        } catch (error) {
            setMensagem("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="container">

            {/* FORMULÁRIO */}
            <form onSubmit={handleSubmit}>
                <h1>Cadastro</h1>

                <div>
                    <label>Usuário</label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Nome</label>
                    <input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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

                <div>
                    <label>Telefone</label>
                    <input
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Endereço</label>
                    <input
                        value={endereco}
                        onChange={(e) => setEndereco(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Cadastrar</button>

                <button
                    type="button"
                    onClick={() => navigate("/")}
                >
                    Voltar para Login
                </button>

                <div className="mensagem">
                    {mensagem && <p>{mensagem}</p>}
                </div>
            </form>

            {/* POPUP DE SUCESSO */}
            {cadastroSucesso && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Cadastro realizado!</h2>

                        <p>Usuário cadastrado com sucesso.</p>

                        <button onClick={() => navigate("/")}>
                            Voltar para Login
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Cadastro;