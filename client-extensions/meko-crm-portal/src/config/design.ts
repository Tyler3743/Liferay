export const DESIGN_TOKENS = {
  colors: {
    primary: {
      from: 'from-indigo-600',
      to: 'to-pink-500',
      text: 'text-indigo-600',
    },
    background: 'bg-slate-50',
    surface: 'bg-white',
    text: {
      main: 'text-slate-900',
      muted: 'text-slate-500',
    },
  },
  layout: {
    container: 'max-w-[1100px] w-full mx-auto',
    padding: 'p-8 md:p-14',
    borderRadius: 'rounded-3xl',
    shadow: 'shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.05)]',
  },
  card: {
    base: 'flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-slate-200 transition-all duration-300 relative overflow-hidden',
    hover: 'hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] hover:border-transparent',
    iconBase: 'text-3xl w-16 h-16 flex items-center justify-center rounded-2xl mb-6 transition-all duration-300 z-10 relative',
    titleBase: 'text-lg font-semibold text-slate-900 mb-2 z-10 relative transition-colors duration-300',
    descBase: 'text-sm text-slate-500 leading-relaxed z-10 relative',
  }
} as const;

export type AppTheme = {
  cardBg: string;
  cardHoverBg: string;
  cardHoverBorder: string;
  cardHoverShadow: string;
  iconBg: string;
  iconColor: string;
  iconHoverBg: string;
  titleHoverColor: string;
};

export const APP_THEMES: Record<string, AppTheme> = {
  blue: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-white',
    cardHoverBg: 'hover:from-blue-50 hover:to-white',
    cardHoverBorder: 'hover:border-blue-200',
    cardHoverShadow: 'hover:shadow-blue-500/20',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    iconHoverBg: 'group-hover:bg-blue-100',
    titleHoverColor: 'group-hover:text-blue-700',
  },
  pink: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-white',
    cardHoverBg: 'hover:from-fuchsia-50 hover:to-white',
    cardHoverBorder: 'hover:border-fuchsia-200',
    cardHoverShadow: 'hover:shadow-fuchsia-500/20',
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
    iconHoverBg: 'group-hover:bg-fuchsia-100',
    titleHoverColor: 'group-hover:text-fuchsia-700',
  },
  green: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-white',
    cardHoverBg: 'hover:from-green-50 hover:to-white',
    cardHoverBorder: 'hover:border-green-200',
    cardHoverShadow: 'hover:shadow-green-500/20',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    iconHoverBg: 'group-hover:bg-green-100',
    titleHoverColor: 'group-hover:text-green-700',
  },
  orange: {
    cardBg: 'bg-gradient-to-br from-slate-50 to-white',
    cardHoverBg: 'hover:from-orange-50 hover:to-white',
    cardHoverBorder: 'hover:border-orange-200',
    cardHoverShadow: 'hover:shadow-orange-500/20',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    iconHoverBg: 'group-hover:bg-orange-100',
    titleHoverColor: 'group-hover:text-orange-700',
  }
};
