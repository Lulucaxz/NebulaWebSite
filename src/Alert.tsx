import React, { useEffect, useState } from "react";

let setAlert: ((msg: string, duration: number) => void) | null = null;

export function showAlert(msg: string) {
  const duration = Math.max(1500, msg.length * 100); // mínimo 1.5s
  if (setAlert) setAlert(msg, duration);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlertState] = useState<{ msg: string; duration: number } | null>(null);
  const [animState, setAnimState] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');

  useEffect(() => {
    setAlert = (msg, duration) => {
      setAlertState({ msg, duration });
      setAnimState('entering');
      setTimeout(() => setAnimState('visible'), 10); // trigger transition
    };
    return () => {
      setAlert = null;
    };
  }, []);

  useEffect(() => {
    if (alert && animState === 'visible') {
      const timer = setTimeout(() => {
        setAnimState('exiting');
        setTimeout(() => {
          setAlertState(null);
          setAnimState('hidden');
        }, 400); // tempo da animação de saída
      }, alert.duration);
      return () => clearTimeout(timer);
    }
  }, [alert, animState]);

  // Cálculo da posição para animação
  let topValue = -100;
  if (animState === 'entering') topValue = -100;
  if (animState === 'visible') topValue = 0;
  if (animState === 'exiting') topValue = -100;

  return (
    <>
      {children}
      {alert && (
        <div
          style={{
            position: "fixed",
            top: topValue,
            left: 0,
            width: "100vw",
            zIndex: 5,
            display: "flex",
            justifyContent: "center",
            transition: "top 0.5s",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              background: "var(--roxo1)",
              color: "var(--branco)",
              fontSize: "20px",
              padding: "25px",
              marginTop: "25px",
              pointerEvents: "auto",
              userSelect: "none",
              fontFamily: '"Questrial", sans-serif',
              
            }}
          >
            {alert.msg}
          </div>
        </div>
      )}
    </>
  );
}
