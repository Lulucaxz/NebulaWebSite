import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Slider, { type Settings as SlickSettings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Menu } from "../../components/Menu";
import './planos.css'
import { API_BASE, fetchWithCredentials } from "../../api";
import { AssinaturaSlug } from "../../utils/assinaturaAccess";
import { useUserAssinatura } from "../../hooks/useUserAssinatura";

/* Dependências principais (já devem estar no seu package.json):
bash
npm install react react-dom typescript
npm install @types/react @types/react-dom

Dependências específicas do projeto:
bash
# Carrossel e estilos
npm install react-slick slick-carousel
npm install @types/react-slick --save-dev

# Componentes estilizados (styled-components)
npm install styled-components
npm install @types/styled-components --save-dev

# Fontes (opcional - já está via CDN no seu CSS)
npm install @fontsource/archivo-black @fontsource/questrial

# Para ambiente de desenvolvimento
npm install --save-dev @types/node
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

npm install react react-dom typescript react-slick slick-carousel styled-components @types/react @types/react-dom @types/react-slick @types/styled-components --save
*/

interface Plan {
  slug: AssinaturaSlug;
  name: string;
  description: string;
  benefits: string[];
  price: number;
  color: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  component: React.ReactNode;
}

const PIX_KEY = 'pix.nebula@pagamentos.com.br | CNPJ 45.123.987/0001-55 | Banco 260 - NU Pagamentos S.A.';

const PLAN_OPTIONS: Plan[] = [
  {
    slug: "orbita",
    name: "ÓRBITA",
    description:
      "Para quem está começando a explorar astronomia.",
    benefits: [
      "Certificados oficiais de conclusão",
      "Comunidade exclusiva",
      "Lives mensais / encontros ao vivo",
      "Suporte prioritário",
      "Acesso antecipado a novos módulos",
      "Customização avançada",
    ],
    price: 79.9,
    color: "#5F3DC4",
  },
  {
    slug: "galaxia",
    name: "GALÁXIA",
    description:
      "Plano para quem já domina os fundamentos e quer acelerar. Inclui estudos avançados, desafios práticos e feedback individual.",
    benefits: [
      "Certificados oficiais de conclusão",
      "Comunidade exclusiva",
      "Lives mensais / encontros ao vivo",
      "Suporte prioritário",
      "Acesso antecipado a novos módulos",
      "Customização avançada",
    ],
    price: 129.9,
    color: "#5F3DC4",
  },
  {
    slug: "universo",
    name: "UNIVERSO",
    description:
      "Experiência completa: conteúdo avançado, projetos autorais acompanhados e suporte prioritário direto com professores da equipe Nebula.",
    benefits: [
      "Certificados oficiais de conclusão",
      "Comunidade exclusiva",
      "Lives mensais / encontros ao vivo",
      "Suporte prioritário",
      "Acesso antecipado a novos módulos",
      "Customização avançada",
    ],
    price: 179.9,
    color: "#5F3DC4",
  },
];

const PLAN_HIERARCHY: AssinaturaSlug[] = ["orbita", "galaxia", "universo"];

const PLAN_RANK = PLAN_HIERARCHY.reduce<Record<AssinaturaSlug, number>>((acc, slug, index) => {
  acc[slug] = index;
  return acc;
}, {} as Record<AssinaturaSlug, number>);

const PLAN_PRICE_BY_SLUG = PLAN_OPTIONS.reduce<Record<AssinaturaSlug, number>>((acc, plan) => {
  acc[plan.slug] = plan.price;
  return acc;
}, {} as Record<AssinaturaSlug, number>);

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const formatCurrency = (value: number) => BRL_FORMATTER.format(value);


//estilos

function Planos() {
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const toastTimerRef = useRef<number | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const { planSlug, refresh: refreshAssinatura } = useUserAssinatura();

  const showToast = useCallback((message: string, duration = 3000) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, duration);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handlePlanSelection = useCallback((index: number) => {
    setSelectedPlanIndex(index);
    sliderRef.current?.slickGoTo(index, true);
  }, []);

  const sliderSettings = useMemo<SlickSettings>(() => ({
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: "120px",
    adaptiveHeight: true,
    customPaging: () => <div />,
    beforeChange: (_current, next) => {
      setSelectedPlanIndex(next);
    },
    appendDots: (dots) => (
      <div className="slider-dots-wrapper">
        {dots}
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "40px",
        },
      },
    ],
  }), [setSelectedPlanIndex]);

  const plans = PLAN_OPTIONS;
  const selectedPlan = (plans[selectedPlanIndex] ?? plans[0]) as Plan;
  const selectedPlanSlug = selectedPlan.slug;
  const userCurrentPlan = planSlug
    ? plans.find((planOption) => planOption.slug === planSlug) ?? null
    : null;
  const currentPlanRank = planSlug ? PLAN_RANK[planSlug] ?? null : null;
  const selectedPlanRank = PLAN_RANK[selectedPlanSlug] ?? null;
  const isSamePlan = Boolean(planSlug && planSlug === selectedPlanSlug);
  const isDowngrade = Boolean(
    planSlug && currentPlanRank !== null && selectedPlanRank !== null && selectedPlanRank < currentPlanRank
  );
  const purchaseDisabled = isSamePlan || isDowngrade;
  const rawDifference = planSlug
    ? (PLAN_PRICE_BY_SLUG[selectedPlanSlug] ?? selectedPlan.price) - (PLAN_PRICE_BY_SLUG[planSlug] ?? 0)
    : selectedPlan.price;
  const amountToCharge = planSlug ? Math.max(rawDifference, 0) : selectedPlan.price;
  const formattedPlanPrice = formatCurrency(selectedPlan.price);
  const formattedAmountToCharge = formatCurrency(amountToCharge);

  const installmentBreakdown = useMemo(() => {
    return [1, 2, 3].map((count) => (
      <option key={count} value={count}>
        {count}x de {formatCurrency(amountToCharge / count)} sem juros
      </option>
    ));
  }, [amountToCharge]);

  const upgradeNote = useMemo(() => {
    if (!planSlug) {
      return 'Valor integral para novos cadastros ou usuários sem assinatura ativa.';
    }
    if (isSamePlan) {
      return `Você já possui o plano ${userCurrentPlan?.name ?? 'atual'}.`;
    }
    if (isDowngrade) {
      return `Seu plano atual (${userCurrentPlan?.name ?? 'atual'}) já inclui esses conteúdos. Escolha um plano superior para fazer upgrade.`;
    }
    return `Upgrade a partir do plano ${userCurrentPlan?.name ?? ''}. Vamos cobrar agora ${formattedAmountToCharge} (apenas a diferença).`;
  }, [formattedAmountToCharge, isDowngrade, isSamePlan, planSlug, userCurrentPlan]);

  const isCheckoutDisabled = isProcessing || purchaseDisabled;

  const copyPixKey = useCallback(async () => {
    try {
      const clipboard = typeof navigator !== 'undefined' ? navigator.clipboard : undefined;
      if (!clipboard?.writeText) {
        throw new Error('Clipboard API indisponível.');
      }
      await clipboard.writeText(PIX_KEY);
      showToast('Chave PIX copiada!');
    } catch (error) {
      console.error('Erro ao copiar chave PIX:', error);
      showToast('Não foi possível copiar a chave PIX. Copie manualmente.');
    }
  }, [showToast]);

  const renderChargeBreakdown = useCallback(() => (
    <div className="plan-charge-breakdown">
      <p>
        PREÇO DO PLANO: <strong className="strong-pay">{formattedPlanPrice}</strong>
      </p>
      <p>
        VALOR COBRADO AGORA:{' '}
        <strong className="strong-pay plan-charge-highlight">{formattedAmountToCharge}</strong>
      </p>
      {upgradeNote && <p className="plan-upgrade-note">{upgradeNote}</p>}
    </div>
  ), [formattedAmountToCharge, formattedPlanPrice, upgradeNote]);

  const handleCheckout = useCallback(async (paymentMethod: string) => {
    if (isProcessing) {
      return;
    }

    if (purchaseDisabled) {
      const restrictionMessage = isDowngrade
        ? 'Seu plano atual já é superior a este.'
        : 'Você já possui este plano ativo.';
      showToast(restrictionMessage);
      return;
    }

    const checkoutPlan = plans[selectedPlanIndex];
    setIsProcessing(true);

    try {
      const response = await fetchWithCredentials(`${API_BASE}/api/planos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: checkoutPlan.slug, paymentMethod }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        const fallbackMessage = response.status === 401
          ? 'Faça login para concluir sua assinatura.'
          : body?.error ?? 'Não foi possível finalizar o checkout agora.';
        throw new Error(fallbackMessage);
      }

      const amountCharged = typeof body?.amountCharged === 'number' ? body.amountCharged : null;
      const successMessage = amountCharged !== null
        ? `Pagamento confirmado! Valor cobrado agora: ${formatCurrency(amountCharged)}.`
        : body?.message ?? `Plano ${checkoutPlan.name} ativado com sucesso!`;
      showToast(successMessage);
      refreshAssinatura();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado ao finalizar a compra.';
      showToast(message);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, purchaseDisabled, isDowngrade, plans, selectedPlanIndex, showToast, refreshAssinatura]);

  // Métodos de pagamento
  const paymentMethods: PaymentMethod[] = [
        {
          id: "pix",
          name: "PIX",
          icon: "/icons/icons8-pix-50.png",
          component: (
            <div className="pix-form">
              <h3 className="payment-heading">
                PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span>
              </h3>
              {renderChargeBreakdown()}
              <p className="payment-description payment-description-spaced">
                Pague via QR Code ou chave copia/cola. Assim que o PIX for compensado (até 24h), o curso escolhido é liberado automaticamente e você recebe a confirmação por e-mail.
              </p>
              <div className="qrcode-content">
                <div className="pix-qrcode" />
                <div className="pix-key-card">
                  <h3 className="pix-key-title">CHAVE PIX</h3>
                  <div className="pix-key-wrapper">
                    <p id="pixKey" className="pix-key-text">
                      {PIX_KEY}
                    </p>
                    <button
                      onClick={copyPixKey}
                      className="btn-hover pix-copy-button"
                    >
                      <span>Copiar chave PIX</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="btn-pay"
                disabled={isCheckoutDisabled}
                onClick={() => { void handleCheckout('pix'); }}
              >
                CONFIRMAR ASSINATURA VIA PIX
              </button>
            </div>
          ),
        },
        {
          id: "credit",
          name: "CARTÃO DE CRÉDITO",
          icon: "/icons/icons8-cartão-50.png",
          component: (
            <div className="credit-card-form">
              <h3 className="payment-heading">
                PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span>
              </h3>
              {renderChargeBreakdown()}
              <p className="payment-description payment-description-spaced">
                Preencha os dados abaixo para processar o pagamento com segurança. Utilizamos checkout tokenizado e seu acesso é liberado na hora.
              </p>
              <div className="form-field">
                <label className="form-label">Número do cartão:</label>
                <input className="pay-input" type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-field">
                <label className="form-label">Nome impresso no cartão:</label>
                <input className="pay-input" type="text" placeholder="Nome como está no cartão" />
              </div>
              <div className="form-row">
                <div className="form-column">
                  <label className="form-label">Validade:</label>
                  <input className="pay-input pay-input-validade" type="text" placeholder="MM/AA" />
                </div>
                <div className="form-column">
                  <label className="form-label">CVV:</label>
                  <input className="pay-input pay-input-cvv" type="text" placeholder="123" />
                </div>
              </div>
              <p className="payment-description payment-description-spaced">
                Use seu cartão de crédito para confirmar a assinatura imediatamente. Todos os dados são criptografados e não ficam salvos na plataforma.
              </p>
              <div className="form-field form-field-select">
                <label className="form-label">Parcelamento:</label>
                <select className="payment-select">
                  {installmentBreakdown}
                </select>
              </div>
              <button
                className="btn-pay"
                disabled={isCheckoutDisabled}
                onClick={() => { void handleCheckout('credit-card'); }}
              >
                FINALIZAR COMPRA
              </button>
            </div>
          ),
        },
        {
          id: "debit",
          name: "CARTÃO DE DÉBITO",
          icon: "/icons/icons8-cartão-50.png",
          component: (
            <div className="debit-card-form">
              <h3 className="payment-heading">
                PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span>
              </h3>
              {renderChargeBreakdown()}
              <p className="payment-description payment-description-spaced">
                O pagamento por cartão de débito solicita os dados abaixo. A confirmação acontece em poucos minutos após a autenticação do banco.
              </p>
              <div className="form-field form-field--spaced">
                <label className="form-label">Número do cartão:</label>
                <input className="pay-input" type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-field form-field--spaced">
                <label className="form-label">Nome no cartão:</label>
                <input className="pay-input" type="text" placeholder="Nome como está no cartão" />
              </div>
              <div className="form-row form-row--spaced">
                <div className="form-column">
                  <label className="form-label">Validade:</label>
                  <input className="pay-input pay-input-validade" type="text" placeholder="MM/AA" />
                </div>
                <div className="form-column">
                  <label className="form-label">CVV:</label>
                  <input className="pay-input pay-input-cvv" type="text" placeholder="123" />
                </div>
              </div>
              <button
                className="btn-pay btn-pay--spaced"
                disabled={isCheckoutDisabled}
                onClick={() => { void handleCheckout('debit-card'); }}
              >
                FINALIZAR COMPRA
              </button>
            </div>
          ),
        },
        {
          id: "boleto",
          name: "BOLETO",
          icon: "/icons/icons8-código-de-barras-50.png",
          component: (
            <div className="boleto-form">
              <h3 className="payment-heading">
                PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span>
              </h3>
              {renderChargeBreakdown()}
              <p className="payment-description payment-description-spaced">
                O boleto deve ser pago em até <span className="payment-highlight">24 HORAS</span>. A liberação acontece em até dois dias úteis após a compensação bancária.
              </p>
              <p className="payment-description">Informe seus dados para gerar o documento:</p>
              <div className="form-field form-field--stacked">
                <label className="form-label">Nome completo:</label>
                <input className="pay-input" type="text" placeholder="Nome completo como exibido no seu documento" />
              </div>
              <div className="form-field form-field--stacked">
                <label className="form-label">CPF:</label>
                <input className="pay-input" type="text" placeholder="000.000.000-00" />
              </div>
              <button
                className="btn-pay btn-pay--margin"
                disabled={isCheckoutDisabled}
                onClick={() => { void handleCheckout('boleto'); }}
              >
                GERAR BOLETO
              </button>
            </div>
          ),
        },
      ];

  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null);
  const [contentHeight, setContentHeight] = useState<{ [key: string]: number }>({});

  // Função para medir a altura do conteúdo
  const measureRef = (id: string, ref: HTMLDivElement | null) => {
    if (ref && !contentHeight[id]) {
      setContentHeight(prev => ({
        ...prev,
        [id]: ref.scrollHeight
      }));
    }
  };

  return (
    <>
      <Menu />
      <div className="container-planos">
        <div className="planos-wrapper">
          <div className="plan-carousel">
            <Slider ref={sliderRef} {...sliderSettings}>
              {plans.map((plan, index) => {
                const isSelected = selectedPlanIndex === index;
                return (
                  <div key={plan.slug} className="plan-slide">
                    <div className={`plan-card plan-card-${plan.slug}`}>
                      <h2 className="plan-card-title">{plan.name}</h2>
                      <p className="plan-card-description">{plan.description}</p>
                      <div className="ben-gri plan-benefits-grid">
                        {plan.benefits.map((benefit, benefitIndex) => {
                          const hasBenefit =
                            (index === 0 && benefitIndex < 2) ||
                            (index === 1 && benefitIndex < 3) ||
                            index === 2;
                          return (
                            <div key={`${plan.slug}-${benefitIndex}`} className="benefit-item">
                              <div
                                className={`benefit-icon ${hasBenefit ? "benefit-icon--active" : "benefit-icon--inactive"}`}
                              />
                              <span>{benefit}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="plan-card-footer">
                        <p className="plan-card-price-label">No valor:</p>
                        <h3 className="plan-card-price-value">
                          R$ {plan.price.toFixed(2).replace('.', ',')}
                        </h3>
                        <button
                          className="plan-card-button"
                          disabled={isSelected}
                          onClick={() => handlePlanSelection(index)}
                        >
                          {isSelected ? "PLANO SELECIONADO" : "SELECIONAR ESTE PLANO"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>

          <div className="payment-section">
            <h2 className="payment-section-title">
              Escolha seu metodo de <span className="payment-section-title-highlight">Pagamento</span>
            </h2>
            <div className="payment-methods-list">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`payment-method-card${activePaymentMethod === method.id ? ' is-active' : ''}`}
                >
                  <button
                    className="payment-method-button"
                    onClick={() =>
                      setActivePaymentMethod(
                        activePaymentMethod === method.id ? null : method.id
                      )
                    }
                  >
                    <div className="payment-method-info">
                      <img src={method.icon} alt={method.name} className="payment-method-icon" />
                      <span>{method.name}</span>
                    </div>
                    <span className="payment-method-toggle-icon" />
                  </button>
                  <div
                    ref={(ref) => measureRef(method.id, ref)}
                    className="payment-content"
                    style={{
                      height: activePaymentMethod === method.id ? `${contentHeight[method.id]}px` : '0',
                    }}
                  >
                    <div className="payment-content-inner">{method.component}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {toastMessage && (
          <div className="toast-notification">
            {toastMessage}
          </div>
        )}
      </div>
    </>
  );
}

export default Planos;
