interface usuarioRankProps {
  fotoRank: string;
  usuarioRank: string;
  pontosRank: number;
  posicaoRank: string;
}

const UsuarioRank = ({ fotoRank, usuarioRank, pontosRank, posicaoRank }: usuarioRankProps) => {
  return (
    <div className={parseInt(posicaoRank) % 2 == 0 ? "prf-usuarios-rank" : "prf-usuarios-rank prf-cor2"}>
      <div className="prf-container4">
        <div className="prf-foto-rank" style={{ backgroundImage: `url(${fotoRank})` }}></div>
        <div className="prf-nome-rank"><span>{usuarioRank}</span></div>
        <div className="prf-divisao-rank">|</div>
        <div className="prf-pontos-rank"><span>{pontosRank} pts</span></div>
        <div className="prf-divisao-rank">|</div>
        <div className="prf-posisao-rank"><span>{posicaoRank}</span></div>
      </div>
    </div>
  )
}

export default UsuarioRank;