import { useState } from "react";
import { ModuloItem } from "./moduloItem";
import { initial_cursos } from "./cursosDados";

interface TemplateModulosProps {
    assinatura: string;
}

export function TemplateModulos({ assinatura }: TemplateModulosProps) {
    const [cursos, setCursos] = useState(initial_cursos);

    return (
        <>
            {Array.isArray(cursos[assinatura]) && cursos[assinatura].map((templateModulo) => (
                <ModuloItem
                    key={templateModulo.id}
                    id={templateModulo.id}
                    titulo={templateModulo.template.titulo}
                    descricao={templateModulo.template.descricao}
                    terminado={templateModulo.terminado}
                    assinatura={assinatura}
                />
            ))}
        </>
    );
}