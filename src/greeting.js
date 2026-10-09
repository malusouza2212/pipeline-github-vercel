
export function buildGreeting(name = "mundo") {
  const normalizedName = String(name).trim();

  if (!normalizedName) {
    return "Olá, mundo!";
  }

  return `Olá, ${normalizedName}!`;
}
