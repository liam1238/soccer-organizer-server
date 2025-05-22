export interface Match {
  id: string;
  date: string;
  teams: { playerIds: string[] }[];
  winnerIndex?: number;
}
