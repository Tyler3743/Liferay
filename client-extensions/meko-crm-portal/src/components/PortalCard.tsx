import React from 'react';
import type { AppFeature } from '../config/apps';
import { DESIGN_TOKENS, APP_THEMES } from '../config/design';

interface PortalCardProps {
  app: AppFeature;
}

export const PortalCard: React.FC<PortalCardProps> = ({ app }) => {
  const theme = APP_THEMES[app.colorScheme];

  return (
    <a 
      href={app.url} 
      className={`group ${DESIGN_TOKENS.card.base} ${theme.cardBg} ${theme.cardHoverBg} ${theme.cardHoverBorder} ${theme.cardHoverShadow}`}
    >
      <div className={`${DESIGN_TOKENS.card.iconBase} ${theme.iconBg} ${theme.iconColor} ${theme.iconHoverBg} group-hover:scale-110 group-hover:rotate-6`}>
        {app.icon}
      </div>
      <h3 className={`${DESIGN_TOKENS.card.titleBase} ${theme.titleHoverColor}`}>
        {app.title}
      </h3>
      <p className={DESIGN_TOKENS.card.descBase}>
        {app.description}
      </p>
    </a>
  );
};
