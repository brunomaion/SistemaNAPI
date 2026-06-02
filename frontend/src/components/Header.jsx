import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Components.css";
import Sidebar from "./Sidebar";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [usuario] = useState(() => {
        try {
            const user = localStorage.getItem("usuario");

            return user ? JSON.parse(user) : null;
        } catch {
            localStorage.removeItem("usuario");
            return null;
        }
    });

    const navigate = useNavigate();

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


                <div className="actions">
                    
                    <button onClick={() => navigate("/perfil")}>
                        {usuario.username}
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