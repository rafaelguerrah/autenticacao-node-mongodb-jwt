const User = require('../models/User');

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

module.exports = { getUser, getCurrentUser };
