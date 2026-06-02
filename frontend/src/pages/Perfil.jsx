import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
            <form onSubmit={salvar}>
                <h1>Meu Perfil</h1>

                <input
                    name="username"
                    value={usuario.username ?? ""}
                    onChange={handleChange}
                    placeholder="Username"
                />

                <input
                    name="nome"
                    value={usuario.nome ?? ""}
                    onChange={handleChange}
                    placeholder="Nome"
                />

                <input
                    name="email"
                    value={usuario.email ?? ""}
                    onChange={handleChange}
                    placeholder="Email"
                />

                <input
                    name="telefone"
                    value={usuario.telefone ?? ""}
                    onChange={handleChange}
                    placeholder="Telefone"
                />

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

                {mensagem && <p>{mensagem}</p>}
            </form>
        </div>
    );
}

export default Perfil;