import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        return <Navigate to="/" />;
    }

    try {
        const parsed = JSON.parse(usuario);
        const isValidUser = parsed && typeof parsed === "object";

        return isValidUser ? children : <Navigate to="/" />;
    } catch (error) {
        localStorage.removeItem("usuario");
        return <Navigate to="/" />;
    }
}