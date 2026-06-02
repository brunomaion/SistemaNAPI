import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Gerenciar from "./pages/GerenciarUsuarios";
import Rota from "./pages/Rota";
import RotaPontos from "./pages/rota/RotaPontos";
import RotaClusters from "./pages/rota/RotaClusters";
import RotaOtimizacao from "./pages/rota/RotaOtimizacao";
import RotaConfiguracoes from "./pages/rota/RotaConfiguracoes";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={<Home />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/gerenciarusuarios" element={<Gerenciar />} />
                <Route path="/rota/:id" element={<Rota />} />
                <Route path="/rota/:id/pontos" element={<RotaPontos />} />
                <Route path="/rota/:id/clusters" element={<RotaClusters />} />
                <Route path="/rota/:id/otimizacao" element={<RotaOtimizacao />} />
                <Route path="/rota/:id/configuracoes" element={<RotaConfiguracoes />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;