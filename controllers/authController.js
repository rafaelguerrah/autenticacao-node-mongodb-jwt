const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Register user
const register = async (req, res) => {
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

    //chegar se o usuário existe
    const userExists = await User.findOne({email: email});
    if(userExists) {
        return res.status(422).json({msg: 'Por favor, utilize outro e-mail'});
    }

    //Criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    //Criar usuário
    const user = new User({
        name,
        email,
        password: passwordHash,
    });

    try {
        await user.save();
        res.status(201).json({msg: 'Usuário criado com sucesso'});
    } catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'});
    }
};

//Login user
const login = async (req, res) => {
    const {email, password} = req.body;

    //validations
    if(!email) {
        return res.status(422).json({msg: 'O email é obrigatório'});
    }
    if(!password) {
        return res.status(422).json({msg: 'A senha é obrigatória'});
    }
    //checar se o usuário existe
    const user = await User.findOne({email: email});
    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'});
    }
    //checar se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password);
    if(!checkPassword) {
        return res.status(422).json({msg: 'Senha incorreta'});
    }
        //gerar token
    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        );
        res.status(200).json({msg: 'Autenticação realizada com sucesso', token});
    }catch (err) {
        console.log(err);
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde'});
    }
}

module.exports = { register, login };

