import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { API_BASE, fetchWithCredentials } from "../../../api";

interface BarraProgressoProps {
    tituloEstatistica: string;
    pontosEstatistica: number;
    maximoEstatistica: number;
}

const BarraProgresso = ({ tituloEstatistica, pontosEstatistica, maximoEstatistica }: BarraProgressoProps) => {
    const { t } = useTranslation();
    const safeMax = maximoEstatistica > 0 ? maximoEstatistica : 1;
    const clampedValor = Math.min(pontosEstatistica, safeMax);

    return (
        <div className="prf-curso-estatistica">
            <div className="prf-titulo-estatistica"><span>{t(tituloEstatistica)}</span></div>
            <progress className="prf-barra-estatistica" value={clampedValor} max={safeMax}></progress>
            <div className="prf-descricao-estatistica"><span>{clampedValor}/{safeMax}</span></div>
        </div>
    );
};

interface BarraDeProgressoProps {
    progresso1: number;
    progresso2: number;
    progresso3: number;
}

type AssinaturaKey = "orbita" | "galaxia" | "universo";

const FALLBACK_TOTALS: Record<AssinaturaKey, number> = {
    orbita: 6,
    galaxia: 6,
    universo: 9,
};

const assinaturaConfig: Array<{ key: AssinaturaKey; slug: string }> = [
    { key: "orbita", slug: "orbita" },
    { key: "galaxia", slug: "galaxia" },
    { key: "universo", slug: "universo" },
];

export function BarraDeProgresso({ progresso1, progresso2, progresso3 }: BarraDeProgressoProps) {
    const [moduleTotals, setModuleTotals] = useState<Record<AssinaturaKey, number>>({ ...FALLBACK_TOTALS });

    useEffect(() => {
        let active = true;

        const loadModuleTotals = async () => {
            try {
                const results = await Promise.all(
                    assinaturaConfig.map(async ({ key, slug }) => {
                        try {
                            const res = await fetchWithCredentials(`${API_BASE}/api/course-content/assinaturas/${slug}`);
                            if (!res.ok) {
                                throw new Error(`Falha ao carregar assinatura ${slug}`);
                            }
                            const data = await res.json().catch(() => ({ modules: [] }));
                            const count = Array.isArray(data.modules) ? data.modules.length : 0;
                            return { key, count } as const;
                        } catch (error) {
                            console.error(`[Perfil] Erro ao obter módulos da assinatura ${slug}`, error);
                            return { key, count: 0 } as const;
                        }
                    })
                );

                if (!active) {
                    return;
                }

                setModuleTotals((prev) => {
                    const next: Record<AssinaturaKey, number> = { ...prev };
                    results.forEach(({ key, count }) => {
                        const fallback = FALLBACK_TOTALS[key];
                        next[key] = count > 0 ? count : fallback;
                    });
                    return next;
                });
            } catch (error) {
                if (active) {
                    console.error("[Perfil] Não foi possível sincronizar os totais de módulos", error);
                }
            }
        };

        loadModuleTotals();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <BarraProgresso tituloEstatistica={"ÓRBITA"} pontosEstatistica={progresso1} maximoEstatistica={moduleTotals.orbita} />
            <BarraProgresso tituloEstatistica={"GALÁXIA"} pontosEstatistica={progresso2} maximoEstatistica={moduleTotals.galaxia} />
            <BarraProgresso tituloEstatistica={"UNIVERSO"} pontosEstatistica={progresso3} maximoEstatistica={moduleTotals.universo} />
        </>
    );
}