//config database
const mongoose = require('mongoose');

const conectDB = async () => {
    const DB_USER = process.env.DB_USER;
    const DB_PASS = encodeURIComponent(process.env.DB_PASS);
    try {
        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.sbiw1ur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        console.log('Conectado ao MongoDB');
    } catch (err) {
        console.log(err);
    }
};

module.exports = conectDB;

        