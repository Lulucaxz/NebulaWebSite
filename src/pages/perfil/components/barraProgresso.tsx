interface barraProgressoProps {
    tituloEstatistica: string;
    pontosEstatistica: number;
    maximoEstatistica: number;
}

import { useTranslation } from 'react-i18next';
const BarraProgresso = ({ tituloEstatistica, pontosEstatistica, maximoEstatistica }: barraProgressoProps) => {
    const { t } = useTranslation();
    return (
        <div className="prf-curso-estatistica">
            <div className="prf-titulo-estatistica"><span>{t(tituloEstatistica)}</span></div>
            <progress className="prf-barra-estatistica" value={pontosEstatistica} max={maximoEstatistica}></progress>
            <div className="prf-descricao-estatistica"><span>{pontosEstatistica}/{maximoEstatistica}</span></div>
        </div>
    )
}

interface BarraDeProgressoProps {
    progresso1: number;
    progresso2: number;
    progresso3: number;
}

export function BarraDeProgresso({ progresso1, progresso2, progresso3 }: BarraDeProgressoProps) {
    return (
        <>
            <BarraProgresso tituloEstatistica={"ÓRBITA"} pontosEstatistica={progresso1} maximoEstatistica={6} />
            <BarraProgresso tituloEstatistica={"GALÁXIA"} pontosEstatistica={progresso2} maximoEstatistica={6} />
            <BarraProgresso tituloEstatistica={"UNIVERSO"} pontosEstatistica={progresso3} maximoEstatistica={9} />
        </>
    );
}