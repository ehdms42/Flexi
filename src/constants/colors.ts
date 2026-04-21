const palette = {
  primary: {
    default: "#FF4000",
    black: "#0A0A0A",
    background: "#F5F3F1",
  },

  system: {
    red: "#EBA9A9",
    orange: "#EEB67A",
    yellow: "#EFE47E",
    green: "#9DD7AF",
    error: "#F42222",
  },

  gray: {
    0: "#000000",
    10: "#171717",
    20: "#303030",
    30: "#343434",
    40: "#5C5C5C",
    50: "#8A8A8A",
    60: "#B0B0B0",
    70: "#D1D1D1",
    80: "#E3E3E3",
    90: "#F1F1F1",
    95: "#EAEAEA",
    100: "#FFFFFF",
  },
} as const;

export const colors = {
  ...palette,
  semantic: {
    labelAlternative: palette.gray[40],
    backgroundStrong: "#EDEBE8",
    timelineLabel: "#C4C4C4",
    dimBackground: `${palette.gray[0]}CC` as const,
    inputPlaceholder: "#D7D7D7",
    inputLabel: "#514F5E",
    inputValue: "#8B8B8B",
    sliderLabel: palette.gray[50],
    memoPlaceholder: "#C4C4C4",
  },
} as const;

export type Colors = typeof colors;
