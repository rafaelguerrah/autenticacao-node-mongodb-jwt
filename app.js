const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const express = require('express');
const conectDB = require('./config/db');
const porta = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//conectando ao banco de dados
conectDB();

//rotas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});
