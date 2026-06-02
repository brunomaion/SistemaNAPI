import Header from "../components/Header";

function Home() {
    return (
        <>
            <Header />
            <div style={{ marginTop: "80px" }}>
                <h1>Bem-vindo à Home!</h1>
                <p>Esta é a página inicial do aplicativo.</p>
                <h2>Minhas Rotas</h2>
            </div>
        </>
    );
}

export default Home;