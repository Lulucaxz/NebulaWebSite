import "./sessaoPlanos.css";
import "../../../index.css";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const PLAN_BENEFITS = ["videos", "tasks", "routine", "whatsapp", "mentoring", "certificate"] as const;
type BenefitKey = typeof PLAN_BENEFITS[number];

type PlanConfig = {
    key: "orbit" | "galaxy" | "universe";
    included: Record<BenefitKey, boolean>;
    price: string;
};

const plans: PlanConfig[] = [
    {
        key: "orbit",
        included: { videos: true, tasks: true, routine: false, whatsapp: false, mentoring: false, certificate: false },
        price: "home.plans.tiers.orbit.price"
    },
    {
        key: "galaxy",
        included: { videos: true, tasks: true, routine: true, whatsapp: false, mentoring: false, certificate: false },
        price: "home.plans.tiers.galaxy.price"
    },
    {
        key: "universe",
        included: { videos: true, tasks: true, routine: true, whatsapp: true, mentoring: true, certificate: true },
        price: "home.plans.tiers.universe.price"
    },
] as const;

function SessaoPlanos() {
    const { t } = useTranslation();

    return (
        <>
            <div id="ssp-container">
                <div className="sessao">
                    <h1>{t('home.plans.title')}</h1>
                    <hr />
                </div>

                <div className="video-planos">
                    <div>
                        <div className="video-planos-background"></div>
                        <img alt={t('home.plans.playAlt')} src="/icons/play.svg" />
                    </div>
                </div>
                <div className="planos-mini-texto">
                    <span>
                        {t('home.plans.description')}
                    </span>
                </div>
                <div className="container-planos-pagIni">
                    {plans.map((plan) => (
                        <div className="plano" key={plan.key}>
                            <h2>{t(`home.plans.tiers.${plan.key}.name`)}</h2>
                            <p>{t(`home.plans.tiers.${plan.key}.description`)}</p>
                            <div className="plano-nav-beneficios">
                                {PLAN_BENEFITS.map((benefit) => (
                                    <div className="nav-beneficio" key={benefit}>
                                        <p>{t(`home.plans.benefits.${benefit}`)}</p>
                                        <img src={plan.included[benefit] ? "/icons/check-claro2.svg" : "/icons/cancel.svg"} />
                                    </div>
                                ))}
                            </div>
                            <Link to="/planos" className="plano-button">{t(plan.price)}</Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SessaoPlanos;