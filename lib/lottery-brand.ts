export type LotteryBrand = "loto-real" | "leidsa" | "loteka" | "nacional" | "general";

export function lotteryBrand(operator: string): LotteryBrand {
  const normalized = operator
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");

  if (normalized.includes("loteka")) return "loteka";
  if (normalized.includes("leidsa")) return "leidsa";
  if (normalized.includes("real")) return "loto-real";
  if (normalized.includes("nacional")) return "nacional";
  return "general";
}

export function lotteryMonogram(operator: string) {
  const brand = lotteryBrand(operator);
  if (brand === "loto-real") return "LR";
  if (brand === "leidsa") return "LE";
  if (brand === "loteka") return "LK";
  if (brand === "nacional") return "LN";
  return operator.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase();
}
