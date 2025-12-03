import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./footer.css";

type NavSection = {
  titleKey: string;
  links: { labelKey: string; to: string }[];
};

const navSections: NavSection[] = [
  {
    titleKey: "footer.nav.explore.title",
    links: [
      { labelKey: "footer.nav.explore.links.home", to: "/" },
      { labelKey: "footer.nav.explore.links.courses", to: "/cursos" },
      { labelKey: "footer.nav.explore.links.plans", to: "/planos" },
      { labelKey: "footer.nav.explore.links.community", to: "/forum" },
    ],
  },
  {
    titleKey: "footer.nav.experience.title",
    links: [
      { labelKey: "footer.nav.experience.links.liveChat", to: "/chat" },
      { labelKey: "footer.nav.experience.links.notes", to: "/anotacoes" },
      { labelKey: "footer.nav.experience.links.notifications", to: "/notificacoes" },
    ],
  },
];

const socialLinks = [
  {
    labelKey: "footer.social.instagram",
    href: "#",
  },
  {
    labelKey: "footer.social.linkedin",
    href: "#",
  },
  {
    labelKey: "footer.social.youtube",
    href: "#",
  },
];

const contactInfo = {
  email: "nebula.academy.brasil@gmail.com",
  phone: "(12) 99800-1234",
};

function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const phoneHref = `+55${contactInfo.phone.replace(/\D/g, "")}`;

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <span className="footer__eyebrow">{t("footer.eyebrow")}</span>
          <h3 className="footer__headline">{t("footer.headline")}</h3>
          <p className="footer__description">{t("footer.description")}</p>
          <div className="footer__social">
            {socialLinks.map((social) => (
              <a
                key={social.labelKey}
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                {t(social.labelKey)}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__nav" aria-label={t("footer.navLabel")}>
          {navSections.map((section) => (
            <div className="footer__column" key={section.titleKey}>
              <p className="footer__title">{t(section.titleKey)}</p>
              <ul>
                {section.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link to={link.to}>{t(link.labelKey)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="footer__contact">
          <p className="footer__title">{t("footer.contact.title")}</p>
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          <a href={`tel:${phoneHref}`}>{contactInfo.phone}</a>
          <p className="footer__muted">{t("footer.contact.supportHours")}</p>
        </div>
      </div>

      <div className="footer__bottom">
        <span>{t("footer.bottom.rights", { year: currentYear })}</span>
        <span>{t("footer.bottom.community")}</span>
      </div>
    </footer>
  );
}

export default Footer;
