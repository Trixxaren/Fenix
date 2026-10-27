import { TextStyle } from "react-native";
export const colors = {
  bg: "#FAF8F4",
  paper: "#FFFFFF",
  ink: "#242C2B",
  muted: "#697370",
  primary: "#B93827",
  coral: "#EF624C",
  soft: "#FBE7E0",
  line: "#E6E5DF",
  green: "#245B45",
  sage: "#E7EEDB",
  lilac: "#EAE4F4",
  yellow: "#F5EDCC",
  danger: "#A82B32",
};
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radius = { sm: 12, md: 20, lg: 28, full: 999 };
export const typography = {
  hero: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1.6,
    lineHeight: 44,
  },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: -0.8 },
  heading: { fontSize: 20, fontWeight: "700", letterSpacing: -0.3 },
  body: { fontSize: 16, lineHeight: 24 },
  small: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 12, fontWeight: "700", letterSpacing: 1.5 },
} satisfies Record<string, TextStyle>;
