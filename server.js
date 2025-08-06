const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("public")); // Se você tiver uma pasta 'public' com index.html
app.use(express.json());

// Rota principal
app.get("/", (req, res) => {
  res.send("🚀 Casa de Apostas funcionando!");
});

// Simulação de rota de jogos
app.get("/api/jogos", (req, res) => {
  res.json([
    {
      id: 1,
      timeCasa: "Time A",
      timeFora: "Time B",
      horario: "20:00",
      ligas: "Brasileirão",
      mercados: {
        "1": 1.90,
        "X": 3.20,
        "2": 3.50
      }
    }
  ]);
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
