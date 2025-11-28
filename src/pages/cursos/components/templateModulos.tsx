
import { useEffect, useMemo, useState } from "react";
import { ModuloItem } from "./moduloItem";
import { initial_cursos } from "./cursosDados";
import { API_BASE, fetchWithCredentials } from "../../../api";

interface TemplateModulosProps {
    assinatura: string;
}

export function TemplateModulos({ assinatura }: TemplateModulosProps) {
    interface Questao { questao: string; dissertativa?: boolean; alternativas?: string[]; respostaCorreta?: string }
    interface Atividade { id: number; terminado?: boolean; template: { titulo: string; descricao: string }; questoes?: Questao[] }
    interface VideoAula { id: number; titulo?: string; subtitulo?: string; descricao?: string; video?: string; backgroundImage?: string }
    interface Introducao { id: number; descricao: string; videoBackground: string; video: string }
    interface CursoTemplate {
        id: number;
        assinatura?: string;
        terminado?: boolean;
        template: { titulo: string; descricao: string };
        introducao: Introducao;
        atividades?: Atividade[];
        videoAulas: VideoAula[];
    }

    const [customModules, setCustomModules] = useState<CursoTemplate[]>([]);
    const [progressData, setProgressData] = useState<{ moduleSet: Set<string>; activitySet: Set<string> } | null>(null);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/progress`);
                if (!res.ok) return;
                const data: { modules: Array<{ assinatura: string; modulo_id: number }>, activities: Array<{ assinatura: string; modulo_id: number; atividade_id: number }> } = await res.json();
                const moduleSet = new Set(data.modules.map(m => `${m.assinatura}:${m.modulo_id}`));
                const activitySet = new Set(data.activities.map(a => `${a.assinatura}:${a.modulo_id}:${a.atividade_id}`));
                setProgressData({ moduleSet, activitySet });
            } catch (err) {
                console.error('Erro ao carregar progresso', err);
            }
        };

        loadProgress();
    }, [assinatura]);

    useEffect(() => {
        let active = true;
        const loadCustomModules = async () => {
            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/course-content/assinaturas/${assinatura}`);
                if (!res.ok) return;
                const data = await res.json().catch(() => ({ modules: [] }));
                if (!active) return;
                const mods = Array.isArray(data.modules) ? data.modules : [];
                setCustomModules(mods as CursoTemplate[]);
            } catch (err) {
                console.error('Erro ao carregar módulos personalizados', err);
            }
        };
        loadCustomModules();
        return () => {
            active = false;
        };
    }, [assinatura]);

    const modulesForAssinatura = useMemo(() => {
        const baseList = Array.isArray((initial_cursos as unknown as Record<string, CursoTemplate[]>)[assinatura])
            ? (initial_cursos as unknown as Record<string, CursoTemplate[]>)[assinatura].map(mod => ({
                ...mod,
                template: { ...mod.template },
                introducao: { ...mod.introducao },
                atividades: Array.isArray(mod.atividades)
                    ? mod.atividades.map(act => ({ ...act, template: { ...act.template } }))
                    : [],
                videoAulas: Array.isArray(mod.videoAulas)
                    ? mod.videoAulas.map(video => ({ ...video }))
                    : [],
            }))
            : [];

        const customList = customModules.map(mod => ({
            ...mod,
            assinatura,
            template: { ...mod.template },
            introducao: { ...mod.introducao },
            atividades: Array.isArray(mod.atividades)
                ? mod.atividades.map(act => ({ ...act, template: { ...act.template } }))
                : [],
            videoAulas: Array.isArray(mod.videoAulas)
                ? mod.videoAulas.map(video => ({ ...video }))
                : [],
        }));

        const combined = [...baseList, ...customList];
        if (!progressData) {
            return combined;
        }

        return combined.map(mod => {
            const modKey = `${assinatura}:${mod.id}`;
            const atividades = Array.isArray(mod.atividades)
                ? mod.atividades.map(act => ({
                    ...act,
                    terminado: progressData.activitySet.has(`${assinatura}:${mod.id}:${act.id}`) || act.terminado,
                }))
                : [];
            const modDone = progressData.moduleSet.has(modKey) || (atividades.length > 0 && atividades.every(a => a.terminado));
            return { ...mod, atividades, terminado: modDone };
        });
    }, [assinatura, customModules, progressData]);

    return (
        <>
            {modulesForAssinatura.map((templateModulo: CursoTemplate) => (
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