const LOGIN_EVENT = "nebula:auth:login";
const LOGOUT_EVENT = "nebula:auth:logout";

let fallbackTarget: EventTarget | null = null;

const getTarget = (): EventTarget => {
  if (typeof window !== "undefined") {
    return window;
  }
  if (!fallbackTarget) {
    fallbackTarget = new EventTarget();
  }
  return fallbackTarget;
};

type AuthEventHandler = () => void;

type Unsubscribe = () => void;

const subscribe = (eventName: string, handler: AuthEventHandler): Unsubscribe => {
  const target = getTarget();
  const listener = () => handler();
  target.addEventListener(eventName, listener);
  return () => {
    target.removeEventListener(eventName, listener);
  };
};

export const onAuthLogin = (handler: AuthEventHandler): Unsubscribe => subscribe(LOGIN_EVENT, handler);

export const onAuthLogout = (handler: AuthEventHandler): Unsubscribe => subscribe(LOGOUT_EVENT, handler);

const emit = (eventName: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(eventName));
};

export const emitAuthLogin = () => emit(LOGIN_EVENT);

export const emitAuthLogout = () => emit(LOGOUT_EVENT);
