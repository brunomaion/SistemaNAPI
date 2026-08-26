import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderColetas from "../../components/HeaderColetas";


function RotaClusters() {
    const { id } = useParams();

    return (
        <div className="rota-container">
            <Header />

            <div className="home-content">
                <HeaderColetas />

                <div className="rota-info">
                    <h1>Clusters</h1>
                    <p>Rota ID: {id}</p>
                </div>
            </div>
        </div>
    );
}

export default RotaClusters;