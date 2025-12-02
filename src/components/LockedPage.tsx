import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { AssinaturaSlug } from '../utils/assinaturaAccess';
import { getPageLabelKey, getPlanLabelKey, type PageAccessKey } from '../utils/pageAccess';
import './LockedPage.css';

interface LockedPageProps {
  page: PageAccessKey;
  planSlug: AssinaturaSlug | null;
}

const LockIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17 9H16V7C16 4.243 13.757 2 11 2C8.243 2 6 4.243 6 7V9H5C3.897 9 3 9.897 3 11V20C3 21.103 3.897 22 5 22H17C18.103 22 19 21.103 19 20V11C19 9.897 18.103 9 17 9ZM8 7C8 5.346 9.346 4 11 4C12.654 4 14 5.346 14 7V9H8V7ZM17 20H5V11H17L17.002 20H17Z"
      fill="currentColor"
    />
  </svg>
);

export const LockedPage = ({ page, planSlug }: LockedPageProps) => {
  const { t } = useTranslation();
  const pageLabel = t(getPageLabelKey(page));
  const planLabel = t(getPlanLabelKey(planSlug));

  return (
    <div className="locked-page" aria-live="polite">
      <div className="locked-page-card" role="alert">
        <div className="locked-page-icon">
          <LockIcon />
        </div>
        <h1>{t('access.lockedTitle')}</h1>
        <p>{t('access.lockedDescription', { page: pageLabel })}</p>
        <p className="locked-page-plan">{t('access.currentPlan', { plan: planLabel })}</p>
        <Link to="/planos" className="locked-page-cta">
          {t('access.cta')}
        </Link>
      </div>
    </div>
  );
};
