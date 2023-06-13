export const primary = {
  900: "#211391",
  800: "#2F2AA4",
  700: "#3735B0",
  600: "#4040BC",
  500: "#4548C7",
  400: "#6064D1",
  300: "#7C81D9",
  200: "#A2A5E4",
  100: "#C7C8EF",
  50: "#E9E9F9",
};

export const appColors = {
  body: "#12121C",
  bodyInverted: "#F5F5F5",
  background: "#F5F5F5",
  placeholder: "#646464",
  caution: "#FF630C",
  bodyDisabled: "#AFAFAF",
  valid: "#10B50D",
  error: "#ED4848",
  hero: primary["700"],
  h1: primary["700"],
  buttonPrimary: primary["700"],
  buttonInactive: primary["200"],
  buttonDisabled: primary["50"],
};

export const typefaces = {
  hero: {
    fontFamily: "Righteous",
    size: 48,
    color: appColors.hero,
  },
  h1: {
    fontFamily: "NunitoSansBold",
    size: 24,
    color: appColors.h1,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "NunitoSansBold",
    size: 20,
    letterSpacing: -0.5,
    color: appColors.body,
  },
  body: {
    fontFamily: "NunitoSansRegular",
    size: 16,
    letterSpacing: -0.5,
    color: appColors.body,
  },
  button: {
    fontFamily: "NunitoSansBold",
    size: 16,
  },
  subtitle: {
    fontFamily: "NunitoSansBoldItalic",
    size: 16,
    color: primary["400"],
  },
};
