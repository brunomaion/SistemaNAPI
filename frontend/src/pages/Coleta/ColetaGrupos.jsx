import { useParams } from "react-router-dom";
import Header from "../../components/Header";
import HeaderColetas from "../../components/HeaderColetas";
import "./Coleta.css";


function ColetaGrupos() {
    const { id } = useParams();

    return (
        <div className="coleta-subcontainer">
            <Header />

            <div className="coleta-content">
                <HeaderColetas />

                <div className="coleta-subcontainer">
                    


                </div>

            </div>
        </div>
    );
}

export default ColetaGrupos;