// canvas can't read CSS variables; these mirror assets/css/theme.css
export const SIGNAL = "#5cc8f2";
export const INK_STRONG = "#e8ebf0";
export const INK_DIM = "#8a93a1";
export const HAIRLINE = "rgba(255, 255, 255, 0.08)";
export const FONT = '"IBM Plex Sans", system-ui, sans-serif';

// fixed order, one per vector component; validated against the panel surface
export const SERIES = ["#3987e5", "#d95926", "#199e70", "#c98500"];

export const axisLabel = { color: INK_DIM, fontSize: 10 };

export const tooltip = {
  confine: true,
  backgroundColor: "#101318",
  borderColor: "rgba(255, 255, 255, 0.14)",
  borderWidth: 1,
  padding: [6, 8],
  textStyle: { color: INK_STRONG, fontSize: 11 },
  extraCssText: "box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.7);",
};

export function formatValue(n: number) {
  const abs = Math.abs(n);
  if (abs >= 1000) return n.toLocaleString("en-GB", { maximumFractionDigits: 0 });
  if (abs >= 100) return n.toFixed(1);
  return n.toFixed(2);
}
