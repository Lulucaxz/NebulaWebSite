import { Menu } from "../../components/Menu";
import Banner from "./components/banner";
import Objetivos from "./components/objetivos";
import Apresentacao from "./components/apresentacao";
import CarrosselAulas from "./components/carrosselAulas";
import Avaliacoes from "./components/avaliacoes";
import SessaoPlanos from "./components/sessaoPlanos";
import Footer from "../../components/footer";

function Home() {

    return (
        <>
            <Menu/>

            <div className="container">
                <Banner />
                <Objetivos />
                <Apresentacao />
                <Avaliacoes />
                <CarrosselAulas/>
                <SessaoPlanos/>
                <Footer/>
            </div>
        </>
    )
}

export default Home;