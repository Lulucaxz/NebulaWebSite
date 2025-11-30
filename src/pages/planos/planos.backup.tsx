import React, { useCallback, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
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
      "Para quem está começando a explorar astronomia. Acesso às trilhas fundamentais, estudos guiados e monitorias coletivas para você criar rotina de estudos.",
    benefits: [
        <div className="credit-card-form">
          <h3 style={{ fontWeight: '100' }}>PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span></h3>
          {renderChargeBreakdown()}

          <p style={{ marginTop: '1.5rem' }}>Preencha os dados abaixo para processar o pagamento com segurança. Utilizamos checkout tokenizado e seu acesso é liberado na hora.</p>

          <div style={{ margin: "15px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Número do cartão:
            </label>
            <input
              className="pay-input"
              type="text"
              placeholder="1234 5678 9012 3456"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",
                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ margin: "15px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Nome impresso no cartão:
            </label>
            <input
              className="pay-input"
              type="text"
              placeholder="Nome como está no cartão"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",
                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", margin: "15px 0" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Validade:</label>
              <input
                className="pay-input"
                type="text"
                placeholder="MM/AA"
                style={{
                  width: "70%",
                  height: '2rem',
                  padding: "10px",
                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase'
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>CVV:</label>
              <input
                className="pay-input"
                type="text"
                placeholder="123"
                style={{
                  width: "50%",
                  height: '2rem',
                  padding: "10px",
                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase'
                }}
              />
            </div>
          </div>

          <p style={{ marginTop: '1.5rem' }}>Use seu cartão de crédito para confirmar a assinatura imediatamente. Todos os dados são criptografados e não ficam salvos na plataforma.</p>

          <div style={{ margin: "20px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Parcelamento:</label>
            <select
              style={{
                width: "50%",
                height: '3rem',
                padding: "10px",
                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            >
              {installmentBreakdown}
            </select>
          </div>

          <button
            className="btn-pay"
            style={{
              backgroundColor: "#9030eb",
              fontSize: "20px",
              fontFamily: 'Archivo black',
              color: "white",
              border: "none",
              padding: "12px 24px",
              cursor: isCheckoutDisabled ? "not-allowed" : "pointer",
              opacity: isCheckoutDisabled ? 0.7 : 1,
              width: "100%"
            }}
            disabled={isCheckoutDisabled}
            onClick={() => { void handleCheckout('credit-card'); }}
          >
            FINALIZAR COMPRA
          </button>
        </div>
        style={{
          marginTop: '5%',
          position: "relative",
          bottom: "-25px",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <ul
          style={{
            margin: 0,
            padding: 0,
            display: "flex",
            gap: "12px",

          }}
        >
          {dots}
        </ul>
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
  };

  const plans = PLAN_OPTIONS;

  const selectedPlan = plans[selectedPlanIndex];
  const selectedPlanSlug = selectedPlan.slug;
  const userCurrentPlan = planSlug ? plans.find((planOption) => planOption.slug === planSlug) ?? null : null;
  const currentPlanRank = planSlug ? PLAN_RANK[planSlug] : null;
  const selectedPlanRank = PLAN_RANK[selectedPlanSlug];
  const isSamePlan = Boolean(planSlug && planSlug === selectedPlanSlug);
  const isDowngrade = Boolean(
    planSlug && currentPlanRank !== null && selectedPlanRank < currentPlanRank
  );
  const purchaseDisabled = isSamePlan || isDowngrade;
  const rawDifference = planSlug
    ? PLAN_PRICE_BY_SLUG[selectedPlanSlug] - PLAN_PRICE_BY_SLUG[planSlug]
    : selectedPlan.price;
  const amountToCharge = planSlug ? Math.max(rawDifference, 0) : selectedPlan.price;
  const formattedPlanPrice = formatCurrency(selectedPlan.price);
  const formattedAmountToCharge = formatCurrency(amountToCharge);
  const installmentBreakdown = [1, 2, 3].map((count) => (
    <option key={count}>
      {count}x de {formatCurrency(amountToCharge / count)} sem juros
    </option>
  ));
  const upgradeNote = (() => {
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
  })();
  const isCheckoutDisabled = isProcessing || purchaseDisabled;

  const renderChargeBreakdown = () => (
    <div className="plan-charge-breakdown">
      <p>
        PREÇO DO PLANO:{' '}
        <strong className="strong-pay">{formattedPlanPrice}</strong>
      </p>
      <p>
        VALOR COBRADO AGORA:{' '}
        <strong className="strong-pay plan-charge-highlight">{formattedAmountToCharge}</strong>
      </p>
      {upgradeNote && <p className="plan-upgrade-note">{upgradeNote}</p>}
    </div>
  );

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
  }, [isProcessing, isDowngrade, purchaseDisabled, plans, refreshAssinatura, selectedPlanIndex, showToast]);

  // Métodos de pagamento
  const paymentMethods: PaymentMethod[] = [
    {
      id: "pix",
      name: "PIX",
  icon: "/icons/icons8-pix-50.png",
      component: (
        <div className="pix-form">
          <h3 style={{ fontWeight: 100 }}>PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span> </h3>
          {renderChargeBreakdown()}
          <p style={{ marginTop: '1.5rem' }}>
            Pague via QR Code ou chave copia/cola. Assim que o PIX for compensado (até 24h), o curso escolhido é liberado automaticamente e você recebe a confirmação por e-mail.
          </p>
          <div className="qrcode-content" >
            <div
              style={{
                backgroundColor: "#f0f0f0",
                height: "350px",
                width: "350px",
                left: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "20px 0",
                backgroundImage: 'url(/img/UdYkGR.jpg)',
                backgroundSize: 'cover'

              }}
            >

            </div>

            <div className="ABAAA" style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',

              height: "350px",
              width: "350px",
              left: "50%",
              marginLeft: '2.5rem',
              marginTop: '20px',
              textAlign: 'justify',
            }}>
              <h3 style={{ fontFamily: 'Archivo black' }}>CHAVE PIX</h3>
              <div style={{ position: 'relative' }}>
                <p id="pixKey" style={{ maxWidth: '100%', textAlign: 'justify' }}>
                  {PIX_KEY}
                </p>
                <button
                  onClick={copyPixKey}
                  className="btn-hover"
                  style={{
                    height: '2rem',
                    width: '100%',
                    fontSize: '16px',
                    fontFamily: 'Questrial',
                    color: 'white',
                    backgroundColor: "#9030eb",
                    border: 'none',

                    marginTop: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px'
                  }}
                >
                  <span>Copiar chave PIX</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <button className="btn-pay"
            style={{
              backgroundColor: "#9030eb",
              fontSize: "20px",
              fontFamily: 'Archivo black',
              color: "white",
              border: "none",
              padding: "12px 24px",

              cursor: isCheckoutDisabled ? "not-allowed" : "pointer",
              opacity: isCheckoutDisabled ? 0.7 : 1,
              width: "100%",

            }}
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
          <h3 style={{ fontWeight: '100' }}>PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span></h3>
          {renderChargeBreakdown()}

          <p style={{ marginTop: '1.5rem' }}>Preencha os dados abaixo para processar o pagamento com segurança. Utilizamos checkout tokenizado e seu acesso é liberado na hora.</p>

          <div style={{ margin: "15px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Número do cartão:
            </label>
            <input className="pay-input"
              type="text"
              placeholder="1234 5678 9012 3456"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",

                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                {renderChargeBreakdown()}
          <div style={{ margin: "15px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Nome impresso no cartão:
            </label>
            <input className="pay-input"
              type="text"
              placeholder="Nome como está no cartão"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",

                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            />
                    {installmentBreakdown}
                  height: '2rem',
                  padding: "10px",

                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase'
                }}
              />
            </div>
                    cursor: isCheckoutDisabled ? "not-allowed" : "pointer",
                    opacity: isCheckoutDisabled ? 0.7 : 1,
              <label style={{ display: "block", marginBottom: "5px" }}>
                CVV:
              </label>
              <input className="pay-input"
                  disabled={isCheckoutDisabled}
                placeholder="123"
                style={{
                  width: "50%",
                  height: '2rem',
                  padding: "10px",

                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase',
                }}
              />
            </div>
          </div>

          <p>
            INVESTIMENTO:{" "}
            <strong className="strong-pay">
              R$ {selectedPlan.price.toFixed(2).replace(".", ",")}
            </strong>
          </p>
          <p style={{ marginTop: '1.5rem' }}>Use seu cartão de crédito para confirmar a assinatura imediatamente. Todos os dados são criptografados e não ficam salvos na plataforma.</p>

          <div style={{ margin: "20px 0" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Parcelamento:
            </label>
            <select
              style={{
                width: "50%",
                height: '3rem',
                padding: "10px",

                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase',
              }}
            >
              <option>
                1x de R$ {selectedPlan.price.toFixed(2).replace(".", ",")} sem
                juros
              </option>
              <option>
                2x de R$ {(selectedPlan.price / 2).toFixed(2).replace(".", ",")}{" "}
                sem juros
              </option>
              <option>
                3x de R$ {(selectedPlan.price / 3).toFixed(2).replace(".", ",")}{" "}
                sem juros
              </option>
            </select>
          </div>

          <button className="btn-pay"
            style={{
              backgroundColor: "#9030eb",
              fontSize: "20px",
              fontFamily: 'Archivo black',
              color: "white",
              border: "none",
              padding: "12px 24px",

              cursor: isProcessing ? "not-allowed" : "pointer",
              opacity: isProcessing ? 0.7 : 1,
              width: "100%",


            }}
            disabled={isProcessing}
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
          <h3 style={{ fontWeight: '100' }}>PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span></h3>
          {renderChargeBreakdown()}

          <p style={{ marginTop: '1.5rem' }}> O pagamento por cartão de crédito é preciso das seguintes informações:</p>

          <div style={{ marginTop: '5%' }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Número do cartão:
            </label>
            <input className="pay-input"
              type="text"
              placeholder="1234 5678 9012 3456"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",

                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ marginTop: '5%' }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Nome no cartão:
            </label>
            <input className="pay-input"
              type="text"
              placeholder="Nome como está no cartão"
              style={{
                width: "97%",
                height: '2rem',
                padding: "10px",

                fontFamily: "Questrial",
                fontSize: '18px',
                backgroundColor: '#7E7E7E',
                color: "white",
                borderBlock: 'none',
                textTransform: 'uppercase'
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: '5%' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Validade:
              </label>
              <input className="pay-input"
                type="text"
                placeholder="MM/AA"
                style={{
                  width: "70%",
                  height: '2rem',
                  padding: "10px",

                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase'
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                CVV:
              </label>
              <input className="pay-input"
                type="text"
                placeholder="123"
                style={{
                  width: "50%",
                  height: '2rem',
                  padding: "10px",

                  fontFamily: "Questrial",
                  fontSize: '18px',
                  backgroundColor: '#7E7E7E',
                  color: "white",
                  borderBlock: 'none',
                  textTransform: 'uppercase',


                }}
              />


            </div>

          </div>
          <button className="btn-pay"
            style={{
              backgroundColor: "#9030eb",
              fontSize: "20px",
              fontFamily: 'Archivo black',
              color: "white",
              border: "none",
              padding: "12px 24px",

              cursor: isCheckoutDisabled ? "not-allowed" : "pointer",
              opacity: isCheckoutDisabled ? 0.7 : 1,
              width: "100%",
              marginTop: '5%'

            }}
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
          <h3 style={{ fontWeight: '100' }} >PLANO SELECIONADO: <span className="plan-span">{selectedPlan.name}</span></h3>
          {renderChargeBreakdown()}
          <p style={{ marginTop: '1.5rem' }}>O boleto deve ser pago em até <span style={{ fontFamily: 'Archivo black', fontWeight: '150' }}>24 HORAS</span>. A liberação acontece em até dois dias úteis após a compensação bancária.</p>
          <p>Informe seus dados para gerar o documento:</p>

          <label style={{ display: "block", marginTop: "1.5rem" }}>
            Nome completo:
          </label>

          <input className="pay-input"
            type="text"
            placeholder="Nome completo como exibido no seu documento"
            style={{
              width: "97%",
              height: '2rem',
              padding: "10px",
              marginTop: '0.5rem',
              fontFamily: "Questrial",
              fontSize: '18px',
              backgroundColor: '#7E7E7E',
              color: "white",
              borderBlock: 'none',
              textTransform: 'uppercase'
            }}
          />

          <label style={{ display: "block", marginTop: "1.5rem" }}>
            CPF:
          </label>

          <input className="pay-input"
            type="text"
            placeholder="000.000.000 - 00"
            style={{
              width: "97%",
              height: '2rem',
              padding: "10px",
              marginTop: '0.5rem',
              fontFamily: "Questrial",
              fontSize: '18px',
              backgroundColor: '#7E7E7E',
              color: "white",
              borderBlock: 'none',
              textTransform: 'uppercase'
            }}
          />

          <button className="btn-pay"
            style={{
              backgroundColor: "#9030eb",
              fontSize: "20px",
              fontFamily: 'Archivo black',
              color: "white",
              border: "none",
              padding: "12px 24px",

              cursor: isCheckoutDisabled ? "not-allowed" : "pointer",
              opacity: isCheckoutDisabled ? 0.7 : 1,
              width: "100%",
              marginTop: "20px",

            }}
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

        <div
          style={{
            maxWidth: "100vw",
            margin: "0 auto",
            padding: "100px 0",
            color: "#fff",
            backgroundColor: "var(--cinza-escuro1)",
            minHeight: "100vh",
            fontFamily: '"Questrial", sans-serif',
            userSelect: 'none',
            transform: 'scale(1.1)',
          }}
        >
          <style>
            {`

        


          .slick-dots li button:before {
            content: none !important;
          }
          .slick-dots li {
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
          }

          .slick-dots li div {
          width: 15px !important;
          height: 15px !important;
          }

          .slick-dots li.slick-active div {
      background-color: #9A30EB !important; /* Roxo quando ativo */
    }
    .slick-dots li div {
      background-color: rgb(255, 255, 255) !important; /* Roxo claro quando inativo */
    }
        `}
          </style>



          

          {/* Carrossel de Planos */}
          <div style={{ margin: "0 auto 60px", maxWidth: "1000px" }}>
            <Slider {...settings}>
              {plans.map((plan, index) => (
                <div
                  key={index}
                  style={{
                    padding: "20px",
                    outline: "none",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: plan.color,
                      padding: "25px",
                      borderRadius: selectedPlanIndex === index ? "10px" : "15px !important",
                      height: "400px",
                      color: "white",
                      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                      transform: selectedPlanIndex === index ? "scale(1.05)" : "scale(0.95)",
                      transition: "all 0.3s ease",
                      opacity: selectedPlanIndex === index ? 1 : 0.8,
                      display: "flex",
                      flexDirection: "column",
                      position: 'relative'
                    }}
                  >
                    <h2 style={{ fontSize: "2rem", marginBottom: "15px", fontFamily: 'Archivo black' }}>
                      {plan.name}
                    </h2>
                    <p style={{ marginBottom: "20px", flexGrow: 1, fontSize: '18px' }}>
                      {plan.description}
                    </p>

                    {/* Grade de benefícios - 2 linhas x 3 colunas */}
                    <div className="ben-gri" style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)", // 3 colunas
                      gridTemplateRows: "repeat(2, auto)",  // 2 linhas
                      gap: "15px",
                      marginBottom: "60px",
                      fontWeight: 'bold',
                      fontSize: '20px',
                      fontFamily: 'Archivo black',
                      listStyle: 'none'
                    }}>
                      {plan.benefits.map((benefit, i) => (
                        <div key={i} style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        }}>
                          <div style={{
                            width: "25px",
                            height: "25px",
                            backgroundSize: 'cover',

                            backgroundImage:
                              (index === 0 && i < 2) ||
                                (index === 1 && i < 3) ||
                                (index === 2)
                                ? 'url(/icons/check-claro2.svg)'
                                : 'url(/icons/cancel.svg)'
                          }}></div>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: "auto" }}>
                      <p style={{ marginBottom: "5px", fontSize: '20px' }}>No valor:</p>
                      <h3 style={{ fontSize: "2.3rem", marginBottom: "20px" }}>
                        R$ {plan.price.toFixed(2).replace(".", ",")}
                      </h3>
                      <button
                        style={{
                          backgroundColor: selectedPlanIndex === index ? "#fff" : "#610EA1",
                          color: selectedPlanIndex === index ? "#9A30EB" : "white",
                          border: "none",
                          padding: "12px 24px",

                          cursor: selectedPlanIndex === index ? "default" : "pointer",
                          fontWeight: "bold",
                          width: "100%",
                          fontSize: "1rem",
                          transition: "all 0.3s ease",
                          marginTop: ''
                        }}
                        disabled={selectedPlanIndex === index}
                        onClick={() => setSelectedPlanIndex(index)}
                      >
                        {selectedPlanIndex === index ? "PLANO SELECIONADO" : "SELECIONAR ESTE PLANO"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Seção de Pagamento */}
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 20px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "30px",
                fontSize: "2rem",
                fontFamily: 'Archivo black'
              }}
            >
              Escolha seu método de <span style={{
                color: '#9A30EB',
                textTransform: 'uppercase'
              }}>Pagamento</span>
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  style={{


                    overflow: "hidden",
                    backgroundColor: activePaymentMethod === method.id ? "#454545" : "#454545",
                    transition: "all 0.3s ease",
                  }}
                >


                  <button
                    onClick={() =>
                      setActivePaymentMethod(
                        activePaymentMethod === method.id ? null : method.id
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "15px",
                      backgroundColor: "#454545",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#fff",
                      transition: "all 10s ease",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img
                        src={method.icon}
                        alt={method.name}
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span>{method.name}</span>
                    </div>
                    <span style={{ fontSize: "1.5rem", transition: "transform 0.3s ease" }}>

                    </span>
                  </button>

                  <div
                    ref={(ref) => measureRef(method.id, ref)}
                    style={{
                      height: activePaymentMethod === method.id ? `${contentHeight[method.id]}px` : "0",
                      overflow: "hidden",
                      transition: "height 0.5s ease",

                    }}
                  >
                    <div style={{ padding: "20px" }}>
                      {method.component}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {toastMessage && (
  <div style={{
    position: "fixed",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#9030eb",
    color: "white",
    padding: "12px 24px",
    fontFamily: 'Questrial',
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    animation: "toastSlideIn 0.5s forwards, toastFadeOut 0.5s 1.5s forwards"
  }}>
    {toastMessage}
  </div>
)}
      </div>
    </>
  );
}

export default Planos;
