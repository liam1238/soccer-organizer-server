export interface Player {
  id: string;
  name: string;
  fitness: number;
  skill: number;
  teamwork: number;
  appearances: number;
  tags?: string[];
}
