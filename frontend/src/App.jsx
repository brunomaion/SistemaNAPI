import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import Gerenciar from "./pages/GerenciarUsuarios";

import Regiao from "./pages/Regiao";
import RegiaoPontos from "./pages/Regiao/RegiaoPontos";
import RegiaoGrupos from "./pages/Regiao/RegiaoGrupos";
import RegiaoOtimizacao from "./pages/Regiao/RegiaoOtimizacao";
import RegiaoConfiguracoes from "./pages/Regiao/RegiaoConfiguracoes";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/home" element={<Home />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/gerenciarusuarios" element={<Gerenciar />} />

                <Route path="/regiao/:id" element={<Regiao />} />
                <Route path="/regiao/:id/pontos" element={<RegiaoPontos />} />
                <Route path="/regiao/:id/grupos" element={<RegiaoGrupos />} />
                <Route path="/regiao/:id/otimizacao" element={<RegiaoOtimizacao />} />
                <Route path="/regiao/:id/configuracoes" element={<RegiaoConfiguracoes />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;