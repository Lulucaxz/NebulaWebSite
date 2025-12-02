import { Link } from "react-router-dom";
import './moduloItem.css'

interface ModuloItemProps {
    id: number;
    titulo: string;
    descricao: string;
    terminado: boolean;
    assinatura: string;
    locked?: boolean;
}

export function ModuloItem({
    id,
    titulo,
    descricao,
    terminado,
    assinatura,
    locked = false
}: ModuloItemProps) {
    const backgroundColor = locked ? 'var(--surface-raised)' : (terminado ? 'var(--primary-500)' : 'var(--surface-muted)');
    const cardClassName = ["modulo-item", locked ? "modulo-item-locked" : ""].filter(Boolean).join(" ");

    const card = (
        <div className={cardClassName} style={{ backgroundColor }} aria-disabled={locked}>
            <div className="mudolo-item-titulo">
                {titulo}
            </div>
            <div className="mudolo-item-descricao">
                {descricao}
            </div>
            {locked && (
                <div className="modulo-item-locked-indicator" aria-hidden="true">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M17 9H16V7C16 4.243 13.757 2 11 2C8.243 2 6 4.243 6 7V9H5C3.897 9 3 9.897 3 11V20C3 21.103 3.897 22 5 22H17C18.103 22 19 21.103 19 20V11C19 9.897 18.103 9 17 9ZM8 7C8 5.346 9.346 4 11 4C12.654 4 14 5.346 14 7V9H8V7ZM17 20H5V11H17L17.002 20H17Z"
                            fill="var(--roxo1)"
                        />
                    </svg>
                </div>
            )}
        </div>
    );

    return (
        <>
            <div key={`modulo-item-${id}`}>
                {locked ? (
                    <div className="modulo-item-locked-wrapper" aria-disabled="true">
                        {card}
                    </div>
                ) : (
                    <Link to={`/modulos/${assinatura}/${id}`} className="modulo-item-link">
                        {card}
                    </Link>
                )}
            </div>
        </>
    )
}