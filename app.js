/*imports*/
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
//const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

//config JSON response
app.use(express.json());

//models
const User = require('./models/User');

//open Route - public Route
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem Vindo a API'});
});

//Register user
app.post('/auth/register', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body;

    //validations
    if(!name) {
        return res.status(422).json({msg: 'O nome é obrigatório'});
    }
    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório'});
    }
    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória'});
    }
    if(password !== confirmpassword) {
        return res.status(422).json({msg: 'As senhas não coincidem'});
    }

    // Se chegar aqui, o registro continuaria...
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
});

//config database
const DB_USER = process.env.DB_USER;
const DB_PASS = encodeURIComponent(process.env.DB_PASS);


mongoose
.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.sbiw1ur.mongodb.net/?appName=Cluster0`)
.then(() =>{ 
    app.listen(3000);
    console.log('Conectado ao MongoDB')})
.catch((err) => console.log(err));



