export type Step = {
  target: Piece;
  sacrifice: Piece;
  cost: number;
  priorWorkPenalty: number;
};

export type Piece = {
  kind: "book" | "item";
  enchants: string[];
};
