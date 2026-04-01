export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

export function clampText(text = "", length = 120) {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}
