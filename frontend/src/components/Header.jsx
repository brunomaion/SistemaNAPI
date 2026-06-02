import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Components.css";
import Sidebar from "./Sidebar";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [usuario, setUsuario] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("usuario");
        if (user) {
            setUsuario(JSON.parse(user));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    return (
        <>
            <header className="header">
                {/* MENU */}
                <button
                    className="menu-btn"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>

                {/* USUÁRIO LOGADO */}
                <div className="user-info">
                    {usuario && <span>Olá, {usuario.username}</span>}
                </div>

                {/* AÇÕES DIREITA */}
                <div className="actions">
                    <button onClick={() => navigate("/perfil")}>
                        Meu Perfil
                    </button>

                    <button onClick={logout}>
                        Sair
                    </button>
                </div>
            </header>

            <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        </>
    );
}

export default Header;