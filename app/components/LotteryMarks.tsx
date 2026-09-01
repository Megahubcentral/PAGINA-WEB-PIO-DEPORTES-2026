import { lotteryKind, QUINIELA_LABELS } from "../../lib/lottery-view";
import type { LotteryResult } from "../../lib/lottery-provider";

export function QuinielaPrizes({ numbers, dimmed = false }: { numbers: string[]; dimmed?: boolean }) {
  const prizes = numbers.slice(0, 3);
  return (
    <ol className={`lottery-quiniela${dimmed ? " is-dimmed" : ""}`} aria-label={`Premios: ${prizes.map((number, index) => `${QUINIELA_LABELS[index]} ${number}`).join(", ")}`}>
      {prizes.map((number, index) => (
        <li key={`${number}-${index}`}>
          <small>{QUINIELA_LABELS[index]}</small>
          <strong>{number}</strong>
        </li>
      ))}
    </ol>
  );
}

export function LotteryBalls({ result, compact = false }: { result: LotteryResult; compact?: boolean }) {
  const kind = lotteryKind(result);
  return (
    <div
      className={`lottery-balls${compact ? " is-compact" : ""}${kind === "kino" ? " is-kino" : ""}`}
      aria-label={`${result.game}: ${result.numbers.join(", ")}`}
    >
      {result.numbers.map((number, index) => <strong key={`${number}-${index}`}>{number}</strong>)}
    </div>
  );
}

export function LotteryDrawNumbers({ result, compact = false }: { result: LotteryResult; compact?: boolean }) {
  if (lotteryKind(result) === "quiniela") return <QuinielaPrizes numbers={result.numbers} />;
  return (
    <>
      <LotteryBalls result={result} compact={compact || lotteryKind(result) === "kino"} />
      {result.bonus?.length ? (
        <div className="lottery-bonus">
          {result.bonus.map((bonus) => <span key={bonus.label}><small>{bonus.label}</small><b>{bonus.number}</b></span>)}
        </div>
      ) : null}
    </>
  );
}
