import { createTheme, alpha } from '@mui/material/styles';

// Young Scholars Grammar Secondary School — design system v4.
// Official colors stay white + navy. This pass fixes what was making it
// feel flat and generic: cards had a border but no depth (shadow), the
// background was pure white behind white cards (no separation), and
// typography had no real scale (everything similar size/weight).
//
// Fix: soft off-white canvas so white cards actually lift off the page,
// real shadows instead of just borders, and a deliberate type scale
// (size + weight + letter-spacing per level, not just font swaps).
const accent = {
  main: '#3E5C8A',
  light: '#7B94BC',
  dark: '#25395C',
  glow: 'rgba(62,92,138,0.28)',
};

export function buildTheme(mode) {
  const isDark = mode === 'dark';

  const navy = isDark
    ? { 900: '#121D33', 800: '#182643', 700: '#203457', 600: '#2A4268' }
    : { 900: '#0F2A4A', 800: '#14335A', 700: '#1B3F6B', 600: '#274D7D' };

  const shadow = isDark
    ? { sm: '0 1px 2px rgba(0,0,0,0.4)', md: '0 10px 28px rgba(0,0,0,0.38)', lg: '0 20px 48px rgba(0,0,0,0.45)' }
    : { sm: '0 1px 2px rgba(15,42,74,0.05)', md: '0 10px 28px rgba(15,42,74,0.09)', lg: '0 22px 48px rgba(15,42,74,0.13)' };

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: navy[800], contrastText: '#fff' },
      secondary: { main: accent.main, dark: accent.dark, light: accent.light, contrastText: '#fff' },
      background: {
        default: isDark ? navy[900] : '#F3F5F9',
        paper: isDark ? navy[800] : '#FFFFFF',
      },
      text: {
        primary: isDark ? '#F2F4F8' : '#132038',
        secondary: isDark ? '#9FACC3' : '#5C6B84',
      },
      divider: isDark ? alpha('#F2F4F8', 0.08) : '#E7EBF2',
      success: { main: isDark ? '#6FBF8F' : '#227A52' },
      error: { main: isDark ? '#E58877' : '#B6432B' },
      navy,
      gold: accent,
      shadowTokens: shadow,
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Inter", -apple-system, sans-serif',
      h1: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, letterSpacing: -0.5 },
      h2: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, letterSpacing: -0.4 },
      h3: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, letterSpacing: -0.3 },
      h4: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.9rem', letterSpacing: -0.3, lineHeight: 1.2 },
      h5: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.4rem', letterSpacing: -0.2, lineHeight: 1.28 },
      h6: { fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: '1.15rem', letterSpacing: -0.1, lineHeight: 1.3 },
      subtitle1: { fontSize: '0.95rem', fontWeight: 600, letterSpacing: 0 },
      subtitle2: { fontSize: '0.82rem', fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' },
      body1: { fontSize: '0.92rem', lineHeight: 1.6 },
      body2: { fontSize: '0.84rem', lineHeight: 1.55 },
      caption: { fontSize: '0.72rem', letterSpacing: 0.2 },
      overline: { fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.4 },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0.1 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          'html, body, #root': { height: '100%' },
          body: { transition: 'background-color 0.25s ease, color 0.25s ease' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            transition: 'background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.2s ease',
          },
          outlined: {
            borderColor: isDark ? alpha('#F2F4F8', 0.08) : '#EDF0F5',
            boxShadow: shadow.md,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            paddingInline: 20,
            paddingBlock: 9,
            fontSize: '0.86rem',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            '&:hover': { transform: 'translateY(-1px)' },
          },
          contained: {
            boxShadow: `0 4px 14px ${alpha(navy[800], isDark ? 0.4 : 0.16)}`,
            '&:hover': { boxShadow: `0 8px 22px ${alpha(navy[800], isDark ? 0.5 : 0.22)}` },
          },
        },
      },
      MuiTextField: {
        defaultProps: { size: 'small' },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6, color: isDark ? '#9FACC3' : '#5C6B84' },
          root: { borderBottomColor: isDark ? alpha('#F2F4F8', 0.08) : '#EDF0F5' },
        },
      },
      MuiTableRow: {
        styleOverrides: { root: { transition: 'background-color 0.15s ease' } },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
    },
  });

  return theme;
}