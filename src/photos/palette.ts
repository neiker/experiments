export const palette = {
  black: "#040404",
  white: "#fafafa",
};

/**
 * Add transparency to hex color
 * Eg: colorWithOpacity("#ff2211", 0.5) returns #ff22117f
 *
 * TODO make work with non 6 digit hex colors
 */
export function colorWithOpacity(color: string, opacity: number) {
  return color + Math.floor(opacity * 255).toString(16);
}
