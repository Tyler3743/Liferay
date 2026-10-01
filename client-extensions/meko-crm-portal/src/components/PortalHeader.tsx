import React from 'react';
import { DESIGN_TOKENS } from '../config/design';

interface PortalHeaderProps {
  title: string;
  subtitle: string;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-14">
      <h1 className={`text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br ${DESIGN_TOKENS.colors.primary.from} ${DESIGN_TOKENS.colors.primary.to}`}>
        {title}
      </h1>
      <p className={`text-lg md:text-xl ${DESIGN_TOKENS.colors.text.muted}`}>
        {subtitle}
      </p>
    </div>
  );
};
