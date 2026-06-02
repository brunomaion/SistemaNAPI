import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Login.css";

function Perfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        try {
            const user = localStorage.getItem("usuario");

            if (!user) {
                navigate("/");
                return;
            }

            const parsed = JSON.parse(user);
            const isValidUser = parsed && typeof parsed === "object";

            if (!isValidUser) {
                localStorage.removeItem("usuario");
                navigate("/");
                return;
            }

            setUsuario(parsed);
        } catch (error) {
            localStorage.removeItem("usuario");
            navigate("/");
        }
    }, [navigate]);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const salvar = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (!usuario?.id) {
            setMensagem("Usuário inválido para atualização.");
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/usuarios/${usuario.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuario),
                }
            );

            const data = await response.json();

            if (!response.ok || data.sucesso === false) {
                setMensagem(data.mensagem || "Não foi possível atualizar perfil");
                return;
            }

            const usuarioAtualizado = data.usuario || usuario;
            localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
            setUsuario(usuarioAtualizado);
            setMensagem(data.mensagem || "Perfil atualizado com sucesso");

        } catch (error) {
            setMensagem("Erro ao atualizar perfil");
        }
    };

    if (!usuario) return <div>Carregando...</div>;

    return (
        <div className="container">
            <Header />
            <form onSubmit={salvar}>
                <h1>Meu Perfil</h1>

                <h5>Username</h5>
                <input
                    name="username"
                    value={usuario.username ?? ""}
                    onChange={handleChange}
                    placeholder="Username"
                    disabled
                />

                <h5>E-mail</h5>
                <input
                    
                    name="email"
                    value={usuario.email ?? ""}
                    onChange={handleChange}
                    placeholder="Email"
                    disabled
                />

                <h5>Nome</h5>
                <input
                    name="nome"
                    value={usuario.nome ?? ""}
                    onChange={handleChange}
                    placeholder="Nome"
                />



                <h5>Telefone</h5>
                <input
                    name="telefone"
                    value={usuario.telefone ?? ""}
                    onChange={handleChange}
                    placeholder="Telefone"
                />

                <h5>Endereço</h5>
                <input
                    name="endereco"
                    value={usuario.endereco ?? ""}
                    onChange={handleChange}
                    placeholder="Endereço"
                />

                <button type="submit">Salvar</button>

                <button type="button" onClick={() => navigate("/home")}>
                    Voltar
                </button>

                <div className="mensagem">
                    {mensagem && <p>{mensagem}</p>}
                </div>
            </form>
        </div>
    );
}

export default Perfil;