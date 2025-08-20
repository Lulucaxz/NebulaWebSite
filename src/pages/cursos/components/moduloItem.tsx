import { Link } from "react-router-dom";
import './moduloItem.css'

interface moduloItem {
    id: number,
    titulo: string,
    descricao: string,
    terminado: boolean,
    assinatura: string
}

export function ModuloItem({
    id,
    titulo,
    descricao,
    terminado,
    assinatura
}: moduloItem) {
    return (
        <>
            <div key={`modulo-item-${id}`}>
                <Link to={`/modulos/${assinatura}/${id}`}>
                    <div className="modulo-item" style={{ backgroundColor: terminado ? '#9A30EB' : '#4E4E4E' }}>
                        <div className="mudolo-item-titulo">{titulo}</div>
                        <div className="mudolo-item-descricao">{descricao}</div>
                    </div>
                </Link>
            </div>
        </>
    )
}