import express from "express";
import { supabase } from "../services/supabase";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { playerIds } = req.body;

  const { data: players, error } = await supabase
    .from("players")
    .select("*")
    .in("id", playerIds);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!players || players.length === 0) {
    return res.status(404).json({ error: "No players found" });
  }

  function balanceTeams(players: any[], teamSize = 5) {
    const totalPlayers = players.length;
    const numTeams = Math.floor(totalPlayers / teamSize);
    const teams: any[][] = Array.from({ length: numTeams }, () => []);

    const goalkeepers = players.filter((p) => (p.tags || []).includes("שוער"));
    const others = players.filter((p) => !(p.tags || []).includes("שוער"));

    const score = (p: any) => (p.fitness + p.skill + p.teamwork) / 3;
    goalkeepers.sort((a, b) => score(b) - score(a));
    others.sort((a, b) => score(b) - score(a));

    // שיבוץ שוער אחד לקבוצה
    for (let i = 0; i < Math.min(goalkeepers.length, numTeams); i++) {
      teams[i].push(goalkeepers[i]);
    }

    // שוערים עודפים מצטרפים לשחקנים הרגילים
    const remainingGoalkeepers = goalkeepers.slice(numTeams);
    const allNonGoalkeepers = [...others, ...remainingGoalkeepers];

    let teamIdx = 0;
    for (const player of allNonGoalkeepers) {
      // דלג אם הקבוצה כבר מלאה
      while (teams[teamIdx].length >= teamSize) {
        teamIdx = (teamIdx + 1) % numTeams;
      }
      teams[teamIdx].push(player);
      teamIdx = (teamIdx + 1) % numTeams;
    }

    return teams.map((t) => ({
      playerIds: t.map((p) => p.id),
    }));
  }

  const teams = balanceTeams(players);
  await supabase
    .from("matches")
    .insert([{ date: new Date().toISOString(), teams }]);
  res.json({ teams });
});

export default router;
