import type { Company } from "@/lib/types";
import { PIPELINE_STAGES, type PipelineStage } from "@/components/ui/StatusBadge";

import { emptyLane, type LaneState } from "../lane-state";

export type ColumnState = LaneState<Company>;

export type BoardState = Record<PipelineStage, ColumnState>;

export const EMPTY_COLUMN: ColumnState = emptyLane();

export function boardOf(column: ColumnState): BoardState {
  return Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage, { ...column }])) as BoardState;
}

/** Takes `company` out of `from` and puts `placed` at the top of `to`
 * (sorted by last-updated, and a move just updated it). */
export function moveCard(
  board: BoardState,
  company: Company,
  from: PipelineStage,
  to: PipelineStage,
  placed: Company,
): BoardState {
  const source = board[from];
  const target = board[to];
  return {
    ...board,
    [from]: {
      ...source,
      items: source.items.filter((item) => item.id !== company.id),
      total: Math.max(0, source.total - 1),
    },
    [to]: {
      ...target,
      items: [placed, ...target.items.filter((item) => item.id !== company.id)],
      total: target.total + 1,
    },
  };
}

/** Swaps the optimistic card for the row the backend returned. */
export function replaceCard(board: BoardState, stage: PipelineStage, row: Company): BoardState {
  const column = board[stage];
  return {
    ...board,
    [stage]: { ...column, items: column.items.map((item) => (item.id === row.id ? row : item)) },
  };
}

/** Undoes an optimistic move, returning the card to where it was. */
export function rollbackCard(
  board: BoardState,
  company: Company,
  from: PipelineStage,
  to: PipelineStage,
  index: number,
): BoardState {
  const source = board[from];
  const target = board[to];
  const restored = source.items.filter((item) => item.id !== company.id);
  restored.splice(Math.min(index, restored.length), 0, company);
  return {
    ...board,
    [to]: {
      ...target,
      items: target.items.filter((item) => item.id !== company.id),
      total: Math.max(0, target.total - 1),
    },
    [from]: { ...source, items: restored, total: source.total + 1 },
  };
}
