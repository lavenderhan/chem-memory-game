import { elementPairs } from "../data/elementso";

export const generatePairs = (count) => {
  const selected = elementPairs
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  const pairs = selected.flatMap((el) => {
    const fact = el.matches[Math.floor(Math.random() * el.matches.length)];
    return [
      { id: `${el.id}-symbol`, value: el.name, pairId: el.id },
      { id: `${el.id}-fact`, value: fact, pairId: el.id }
    ];
  });

  return pairs.sort(() => Math.random() - 0.5);
};
