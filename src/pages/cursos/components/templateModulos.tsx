
import { useEffect, useState } from "react";
import { ModuloItem } from "./moduloItem";
import { initial_cursos } from "./cursosDados";
import { API_BASE, fetchWithCredentials } from "../../../api";

interface TemplateModulosProps {
    assinatura: string;
}

export function TemplateModulos({ assinatura }: TemplateModulosProps) {
    interface Questao { questao: string; dissertativa?: boolean }
    interface Atividade { id: number; terminado?: boolean; template: { titulo: string; descricao: string }; questoes?: Questao[] }
    interface CursoTemplate { id: number; terminado?: boolean; template: { titulo: string; descricao: string }; atividades?: Atividade[] }

    const [cursos, setCursos] = useState<Record<string, CursoTemplate[]>>(initial_cursos as unknown as Record<string, CursoTemplate[]>);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/progress`);
                if (!res.ok) return; // unauthenticated or error -> keep defaults
                const data: { modules: Array<{ assinatura: string; modulo_id: number }>, activities: Array<{ assinatura: string; modulo_id: number; atividade_id: number }> } = await res.json();

                const moduleSet = new Set(data.modules.map(m => `${m.assinatura}:${m.modulo_id}`));
                const activitySet = new Set(data.activities.map(a => `${a.assinatura}:${a.modulo_id}:${a.atividade_id}`));

                setCursos(prev => {
                    const next: Record<string, CursoTemplate[]> = { ...prev };
                    if (!Array.isArray(next[assinatura])) return prev;
                    next[assinatura] = next[assinatura].map(mod => {
                        const key = `${assinatura}:${mod.id}`;
                        const atividades = Array.isArray(mod.atividades) ? mod.atividades.map(act => ({
                            ...act,
                            terminado: activitySet.has(`${assinatura}:${mod.id}:${act.id}`) || !!act.terminado
                        })) : mod.atividades;
                        const modDone = moduleSet.has(key) || (!!atividades && Array.isArray(atividades) && atividades.length > 0 && atividades.every(a => !!a.terminado)) || !!mod.terminado;
                        return { ...mod, terminado: modDone, atividades };
                    });
                    return next;
                });
            } catch (err) {
                console.error('Erro ao carregar progresso', err);
            }
        };

        loadProgress();
    }, [assinatura]);

    return (
        <>
            {Array.isArray(cursos[assinatura]) && cursos[assinatura].map((templateModulo: CursoTemplate) => (
                <ModuloItem
                    key={templateModulo.id}
                    id={templateModulo.id}
                    titulo={templateModulo.template.titulo}
                    descricao={templateModulo.template.descricao}
                    terminado={!!templateModulo.terminado}
                    assinatura={assinatura}
                />
            ))}
        </>
    );
}