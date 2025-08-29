interface usuarioRankProps {
  fotoRank: string;
  nomeRank: string;    // nome real
  pontosRank: number;
  posicaoRank: string;
}

import { useTranslation } from 'react-i18next';
const UsuarioRank = ({ fotoRank, nomeRank, pontosRank, posicaoRank }: usuarioRankProps) => {
  const { t } = useTranslation();
  return (
    <div className={parseInt(posicaoRank) % 2 == 0 ? "prf-usuarios-rank" : "prf-usuarios-rank prf-cor2"}>
      <div className="prf-container4">
        <div className="prf-foto-rank" style={{ backgroundImage: `url(${fotoRank})` }}></div>
        <div className="prf-nome-rank">
          <span>{nomeRank}</span>
        </div>
        <div className="prf-divisao-rank">|</div>
        <div className="prf-pontos-rank"><span>{pontosRank} {t('pts')}</span></div>
        <div className="prf-divisao-rank">|</div>
        <div className="prf-posisao-rank"><span>{posicaoRank}</span></div>
      </div>
    </div>
  )
}

export default UsuarioRank;