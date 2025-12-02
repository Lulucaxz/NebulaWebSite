import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserAssinatura } from '../hooks/useUserAssinatura';
import { hasAccessToPage, type PageAccessKey } from '../utils/pageAccess';
import { LockedPage } from './LockedPage';
import './LockedPage.css';

interface ProtectedRouteProps {
  page: PageAccessKey;
  children: ReactNode;
}

export const ProtectedRoute = ({ page, children }: ProtectedRouteProps) => {
  const { t } = useTranslation();
  const { planSlug, isLoading } = useUserAssinatura();

  if (isLoading) {
    return (
      <div className="locked-page locked-page-loading" aria-busy="true">
        <div className="locked-page-card locked-page-card--loading">
          <div className="locked-page-icon" aria-hidden="true" />
          <p>{t('access.loading')}</p>
        </div>
      </div>
    );
  }

  if (!hasAccessToPage(planSlug, page)) {
    return <LockedPage page={page} planSlug={planSlug} />;
  }

  return <>{children}</>;
};
