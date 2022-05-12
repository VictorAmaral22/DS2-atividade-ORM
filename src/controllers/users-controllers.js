const bcrypt = require('bcrypt');
const { User, UserDAO } = require('../models/user');

class UsersController {
    async cadastrar(req, res) {
        const { nome, email, senha, imagem } = req.body;
        const novaSenha = bcrypt.hashSync(senha, 10); 
        
        const user = new User(null, nome, email, novaSenha, imagem, null);
        const cadastro = await UserDAO.cadastrar(user);
        if(cadastro) {
            const userInfo = await UserDAO.buscaPeloEmail(email);
            req.session.user = user;
            return res.redirect('/grupos');
        }
    }

    async login(req, res) {
        const { email, senha } = req.body;
        
        const user = await UserDAO.buscaPeloEmail(email);
        if (!user) return res.send('User nao encontrado');

        const confere = bcrypt.compareSync(senha, user.senha);
        if (confere) {
            req.session.user = user;
            return res.redirect('/grupos');
        } else {
            return res.send('Senha nao confere...');
        }
        
    }

    async logout(req, res) {
        req
            .session
            .destroy();
        return res.redirect('/login.html');
        
    }

    as
}

module.exports = UsersController;
