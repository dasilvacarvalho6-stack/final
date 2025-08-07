const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.static('public'));

const RAPIDAPI_KEY = 'a2b6bbd5c6msh9b5c7e3a9b5aa9cp1a5d2ajsn8c3c9f0f4ae0'; // Chave temporária
const BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';

const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
};

app.get('/api/jogos', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/fixtures?league=140&season=2024&next=10`, {
      headers
    });
    const data = await response.json();
    res.json(data.response);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar jogos' });
  }
});

app.get('/api/odds/:fixtureId', async (req, res) => {
  const fixtureId = req.params.fixtureId;
  try {
    const response = await fetch(`${BASE_URL}/odds?fixture=${fixtureId}`, {
      headers
    });
    const data = await response.json();
    res.json(data.response);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar odds' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor com API rodando na porta ${PORT}`);
});
