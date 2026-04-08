const User = require('../models/User');
const bcrypt = require('bcrypt');

//Private Route
const getUser = async (req, res) => {
    const id = req.params.id;

    //checando se o usuário existe
    const user = await User.findById(id, '-password');

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'});
    }

    res.status(200).json({user});
};

// Get current user
const getCurrentUser = async (req, res) => {
    const user = await User.findById(req.user.id, '-password');

    if(!user) {
        return res.status(404).json({msg: 'Usuário não encontrado'});
    }

    res.status(200).json(user);
};

//atualizar usuário
const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password, confirmpassword } = req.body;

    try {
        const user = await User.findById(id);

        // checando se o usuário existe
        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        // checando se o email já existe
        const userEmail = await User.findOne({ email });
        if (userEmail && userEmail._id.toString() !== id) {
            return res.status(422).json({ msg: 'Email já cadastrado' });
        }

        // checando se a senha está correta
        if (password && password !== confirmpassword) {
            return res.status(422).json({ msg: 'As senhas não conferem' });
        }

        // atualizando os campos
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            user.password = passwordHash;
        }

        await user.save();

        res.status(200).json({
            msg: 'Usuário atualizado com sucesso',
            user: { _id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

//deletar usuário
const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado' });
        }

        await User.findByIdAndDelete(id);

        res.status(200).json({ msg: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro no servidor' });
    }
};

module.exports = { getUser, getCurrentUser, updateUser, deleteUser };
