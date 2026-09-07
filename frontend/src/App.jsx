import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Gerenciar from "./pages/GerenciarUsuarios";

import Coleta from "./pages/Coleta";
import ColetaPontos from "./pages/Coleta/ColetaPontos";
import ColetaGrupos from "./pages/Coleta/ColetaGrupos";
import ColetaOtimizacao from "./pages/Coleta/ColetaOtimizacao";
import ColetaConfiguracoes from "./pages/Coleta/ColetaConfiguracoes";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={<Home />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/gerenciarusuarios" element={<Gerenciar />} />

                <Route path="/coleta/:id" element={<Coleta />} />
                <Route path="/coleta/:id/pontos" element={<ColetaPontos />} />
                <Route path="/coleta/:id/grupos" element={<ColetaGrupos />} />
                <Route path="/coleta/:id/otimizacao" element={<ColetaOtimizacao />} />
                <Route path="/coleta/:id/configuracoes" element={<ColetaConfiguracoes />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;