/**
 * Escape MarkdownV2 Characters
 * @param {string} str - The string with characters to escape
 * @return {string} Escaped strings
 */
export function toEscapeMsg(str: string): string {
  return str
    .replace(/_/gi, "\\_")
    .replace(/-/gi, "\\-")
    .replace("+", "\\+")
    .replace("=", "\\=")
    .replace("~", "\\~")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/\</g, "\\<")
    .replace(/\>/g, "\\>")
    .replace(/!/gi, "\\!")
    .replace(/`/gi, "\\`")
    .replace(/\./g, "\\.");
}

/**
 * Escape HTML Characters
 * For some reason the < and the > dont wanna escape properly. Prob due to &
 * @param {string} str - The string with characters to escape
 * @return {string} Escaped strings
 */
export function toEscapeHTMLMsg(str: string): string {
  return (
    str
      // .replace(/\</g, "&gt;")
      // .replace(/\>/g, "&lt;")
      // .replace(/\&/g, "&amp;");
      .replace("<", "&gt;")
      .replace(">", "&lt;")
      .replace("&", "&amp;")
  );
}

/**
 * Format TimeZone to a nice readable string
 * @param {number} tz - The string with characters to escape
 * @return {string} Escaped strings
 */
export function formatTimezone(tz: number): string {
  const tzString = tz < 0 ? (tz * -1).toString() : tz.toString();
  return `${tz < 0 ? "-" : "+"}${tzString.padStart(2, "0")}:00`;
}

/**
 * Formats minutes to hours and minutes
 * @param {number} minutes - number of minutes
 * @return {string} Formatted string of hours and minutes
 */
export function dateFormat(minutes: number): string {
  return `${Math.trunc(minutes / 60)} hours ${Math.trunc(
    minutes % 60,
  )} minutes`;
}
