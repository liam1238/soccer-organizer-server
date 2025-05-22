import express from "express";
import cors from "cors";
import playersRouter from "./routes/players";
import teamsRouter from "./routes/teams";
import matchesRouter from "./routes/matches";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/players", playersRouter);
app.use("/api/teams", teamsRouter);
app.use("/api/matches", matchesRouter);

app.get("/", (req, res) => {
  res.send("Soccer Team Organizer API");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
