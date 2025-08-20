interface barraProgressoProps {
    tituloEstatistica: string;
    pontosEstatistica: number;
    maximoEstatistica: number;
}

const BarraProgresso = ({ tituloEstatistica, pontosEstatistica, maximoEstatistica }: barraProgressoProps) => {

    return (
        <div className="prf-curso-estatistica">
            <div className="prf-titulo-estatistica"><span>{tituloEstatistica}</span></div>
            <progress className="prf-barra-estatistica" value={pontosEstatistica} max={maximoEstatistica}></progress>
            <div className="prf-descricao-estatistica"><span>{pontosEstatistica}/{maximoEstatistica} pts</span></div>
        </div>
    )
}

export function BarraDeProgresso() {

    return (
        <>
            <BarraProgresso tituloEstatistica={"ORBITA"} pontosEstatistica={8} maximoEstatistica={10} />
            <BarraProgresso tituloEstatistica={"GALAXIA"} pontosEstatistica={10} maximoEstatistica={15} />
            <BarraProgresso tituloEstatistica={"UNIVERSO"} pontosEstatistica={20} maximoEstatistica={20} />
        </>
    )
}