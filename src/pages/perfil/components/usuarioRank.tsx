interface usuarioRankProps {
  fotoRank: string;
  nomeRank: string;    // nome real
  pontosRank: number;
  posicaoRank: string;
}

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const UsuarioRank = ({ fotoRank, nomeRank, pontosRank, posicaoRank }: usuarioRankProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/perfil2');
  };

  return (
    <div
      className={parseInt(posicaoRank) % 2 == 0 ? "prf-usuarios-rank" : "prf-usuarios-rank prf-cor2"}
      onClick={handleUserClick}
      style={{ cursor: "pointer" }}
    >
      <div className="prf-container4" style={{position:"relative"}}>
        <div className="prf-foto-rank" style={{ backgroundImage: `url(${fotoRank})` }}></div>
        <div className="prf-nome-rank">
          <span>{nomeRank}</span>
        </div>
        <div className="prf-pontos-rank" style={{width:"100px", textAlign:"right"}}><span>{pontosRank} {t('pts')}</span></div>
        <div className="prf-posisao-rank"style={{right: 0, position:"absolute", textAlign:"right"}}><span>{posicaoRank}</span></div>
      </div>
    </div>
  )
}

export default UsuarioRank;