import express from "express";
import { supabase } from "../services/supabase";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase.from("players").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { name, fitness, skill, teamwork } = req.body;
  const { data, error } = await supabase
    .from("players")
    .insert([{ name, fitness, skill, teamwork }])
    .select(); // ← מבטיח ש-data יחזור

  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    return res.status(500).json({ error: "Failed to insert player" });
  }

  res.json(data[0]);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;
  const { data, error } = await supabase
    .from("players")
    .update(update)
    .eq("id", id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
});

export default router;
