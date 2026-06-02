import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Login.css";

function Perfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(() => {
        try {
            const user = localStorage.getItem("usuario");

            if (!user) {
                return null;
            }

            const parsed = JSON.parse(user);
            const isValidUser = parsed && typeof parsed === "object";

            if (!isValidUser) {
                localStorage.removeItem("usuario");
                return null;
            }

            return parsed;
        } catch {
            localStorage.removeItem("usuario");
            return null;
        }
    });
    const [formData, setFormData] = useState({});
    const [mensagem, setMensagem] = useState("");

    useEffect(() => {
        if (!usuario) {
            navigate("/");
        }
    }, [navigate, usuario]);

    const handleChange = (e) => {
        setFormData((current) => ({
            ...current,
            [e.target.name]: e.target.value,
        }));
    };

    const getFieldValue = (field) => formData[field] ?? "";

    const getPlaceholder = (field) => usuario?.[field] ?? "";

    const salvar = async (e) => {
        e.preventDefault();
        setMensagem("");

        if (!usuario?.id) {
            setMensagem("Usuário inválido para atualização.");
            return;
        }

        const usuarioAtualizado = {
            ...usuario,
            ...Object.fromEntries(
                Object.entries(formData).filter(([, value]) => value !== undefined)
            ),
        };

        try {
            const response = await fetch(
                `http://localhost:8080/usuarios/${usuario.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(usuarioAtualizado),
                }
            );

            const data = await response.json();

            if (!response.ok || data.sucesso === false) {
                setMensagem(data.mensagem || "Não foi possível atualizar perfil");
                return;
            }

            const usuarioSalvo = data.usuario || usuarioAtualizado;
            localStorage.setItem("usuario", JSON.stringify(usuarioSalvo));
            setUsuario(usuarioSalvo);
            setFormData({});
            setMensagem(data.mensagem || "Perfil atualizado com sucesso");

        } catch {
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
                    value={getFieldValue("username")}
                    onChange={handleChange}
                    placeholder={getPlaceholder("username")}
                    disabled
                />

                <h5>E-mail</h5>
                <input
                    name="email"
                    value={getFieldValue("email")}
                    onChange={handleChange}
                    placeholder={getPlaceholder("email")}
                    disabled
                />

                <h5>Nome</h5>
                <input
                    name="nome"
                    value={getFieldValue("nome")}
                    onChange={handleChange}
                    placeholder={getPlaceholder("nome")}
                />

                <h5>Telefone</h5>
                <input
                    name="telefone"
                    value={getFieldValue("telefone")}
                    onChange={handleChange}
                    placeholder={getPlaceholder("telefone")}
                />

                <h5>Endereço</h5>
                <input
                    name="endereco"
                    value={getFieldValue("endereco")}
                    onChange={handleChange}
                    placeholder={getPlaceholder("endereco")}
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