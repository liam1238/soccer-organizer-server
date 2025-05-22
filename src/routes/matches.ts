import express from "express";
import { supabase } from "../services/supabase";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .order("date", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { winnerIndex } = req.body;

  const { data, error } = await supabase
    .from("matches")
    .update({ winnerIndex })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

export default router;
