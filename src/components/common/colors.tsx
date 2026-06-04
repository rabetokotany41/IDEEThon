export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  background: string;
  surface: string;
  surfaceSoft: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textOnColor: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  routeGood: string;
  routeMedium: string;
  routeBad: string;
  border: string;
  divider: string;
  chartPrimary: string;
  chartSecondary: string;
  chartGrid: string;
  glowGreen: string;
  glowOrange: string;
}

const colors: Colors = {
  // 🌱 Primary (identité agriculture moderne)
  primary: "#2E7D32",        // vert nature (main brand)
  primaryLight: "#4CAF50",
  primaryDark: "#1B5E20",

  // ☀️ Secondary (énergie / marché)
  secondary: "#E67E22",      // orange terre cuite
  secondaryLight: "#F39C12",

  // 🌿 Backgrounds (UI moderne + doux)
  background: "#F7F9F3",     // fond global très doux
  surface: "#FFFFFF",        // cartes / panels
  surfaceSoft: "#FEF9E6",    // ton ivoire agricole

  // ✍️ Textes
  textPrimary: "#1F2D1F",    // très lisible (dark green)
  textSecondary: "#5F6F52",  // gris vert moderne
  textMuted: "#8A9486",
  textOnColor: "#FFFFFF",

  // 🚨 États (UX moderne dashboard)
  success: "#2E7D32",
  warning: "#F4A261",
  danger: "#D9534F",
  info: "#3A86FF",

  // 🚜 Routes / terrain
  routeGood: "#2D6A4F",
  routeMedium: "#E9C46A",
  routeBad: "#E76F51",

  // 🧩 UI elements
  border: "#E6EBDD",
  divider: "#EDEFE6",

  // 📊 Charts
  chartPrimary: "#2E7D32",
  chartSecondary: "#E67E22",
  chartGrid: "#DCE5D2",

  // ✨ Effects
  glowGreen: "rgba(46, 125, 50, 0.25)",
  glowOrange: "rgba(230, 126, 34, 0.25)",
};

export default colors;