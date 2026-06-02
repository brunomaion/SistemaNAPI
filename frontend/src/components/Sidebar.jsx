import { useNavigate } from "react-router-dom";
import "./Components.css";

function Sidebar({ menuOpen, setMenuOpen }) {
    const navigate = useNavigate();

    return (
        <>
            <div className={`sidebar ${menuOpen ? "open" : ""}`}>

                <button onClick={() => { navigate("/home"); setMenuOpen(false); }}>
                    Home
                </button>

                <button onClick={() => { navigate("/gerenciarusuarios"); setMenuOpen(false); }}>
                    Gerenciar Usuários
                </button>

                <button onClick={() => { navigate("/config"); setMenuOpen(false); }}>
                    Configurações
                </button>
            </div>

            {menuOpen && (
                <div
                    className="overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}

export default Sidebar;
