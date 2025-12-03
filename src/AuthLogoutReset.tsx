import { useEffect } from "react";
import i18n from "./i18n";
import { onAuthLogout } from "./utils/authEvents";
import { normalizeLanguagePreference, toI18nLanguage } from "./utils/language";

const DEFAULT_LANGUAGE = toI18nLanguage(normalizeLanguagePreference("pt-br"));

function AuthLogoutReset() {
  useEffect(() => {
    const unsubscribe = onAuthLogout(() => {
      void i18n.changeLanguage(DEFAULT_LANGUAGE);

      if (typeof window !== "undefined") {
        // Give theme/time state a tick to reset before forcing a refresh
        window.setTimeout(() => {
          window.location.replace("/");
        }, 50);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
}

export default AuthLogoutReset;
