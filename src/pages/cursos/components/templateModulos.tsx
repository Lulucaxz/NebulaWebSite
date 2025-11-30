
import { useEffect, useMemo, useState } from "react";
import { ModuloItem } from "./moduloItem";
import { API_BASE, fetchWithCredentials } from "../../../api";
import { AssinaturaSlug, hasAccessToAssinatura } from "../../../utils/assinaturaAccess";

interface TemplateModulosProps {
    assinatura: AssinaturaSlug;
    userPlan: AssinaturaSlug | null;
    planLoading?: boolean;
}

export function TemplateModulos({ assinatura, userPlan, planLoading = false }: TemplateModulosProps) {
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

    const [modules, setModules] = useState<CursoTemplate[]>([]);
    const [progressData, setProgressData] = useState<{ moduleSet: Set<string>; activitySet: Set<string> } | null>(null);
    const [loadingModules, setLoadingModules] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const cloneModule = (mod: CursoTemplate): CursoTemplate => ({
        ...mod,
        template: { ...mod.template },
        introducao: { ...mod.introducao },
        atividades: Array.isArray(mod.atividades)
            ? mod.atividades.map((act) => ({
                ...act,
                template: { ...act.template },
                questoes: Array.isArray(act.questoes)
                    ? act.questoes.map((questao) => ({
                        ...questao,
                        alternativas: questao.alternativas ? [...questao.alternativas] : undefined,
                    }))
                    : act.questoes,
            }))
            : [],
        videoAulas: Array.isArray(mod.videoAulas)
            ? mod.videoAulas.map((video) => ({ ...video }))
            : [],
    });

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
        setLoadingModules(true);
        setLoadError(null);

        const loadModules = async () => {
            try {
                const res = await fetchWithCredentials(`${API_BASE}/api/course-content/assinaturas/${assinatura}`);
                const data = await res.json().catch(() => ({ modules: [] }));
                if (!active) return;
                if (!res.ok) {
                    setLoadError(data?.error || 'Não foi possível carregar os módulos desta assinatura.');
                    setModules([]);
                    return;
                }
                const mods = Array.isArray(data.modules) ? (data.modules as CursoTemplate[]) : [];
                setModules(mods.map((mod) => cloneModule(mod)));
            } catch (err) {
                if (!active) return;
                console.error('Erro ao carregar módulos', err);
                setLoadError('Erro ao carregar os módulos desta assinatura.');
                setModules([]);
            } finally {
                if (active) {
                    setLoadingModules(false);
                }
            }
        };

        loadModules();
        return () => {
            active = false;
        };
    }, [assinatura]);

    const modulesForAssinatura = useMemo(() => {
        const combined = modules.map((mod) => ({ ...mod }));
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
    }, [assinatura, modules, progressData]);
    
    if (loadError) {
        return <div className="modulos-erro">{loadError}</div>;
    }
    
    if (loadingModules && modulesForAssinatura.length === 0) {
        return <div className="modulos-loading">Carregando módulos...</div>;
    }

    const hasAccess = hasAccessToAssinatura(userPlan, assinatura);
    const courseLocked = !planLoading && !hasAccess;

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
                    locked={courseLocked}
                />
            ))}
        </>
    );
}