const { dbcon } = require("../config/connection-db");

class User {
    constructor(id, nome, email, senha, imagem, dataregister) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.imagem = imagem;
        this.dataregister = dataregister;
    }
}

class UserDAO {
    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM public."user" where id = $1';
        const result = await dbcon.query(sql, [id]);
        const user = result.rows[0];
        return user;
    }

    static async buscaPeloEmail(email) {
        const sql = 'SELECT * FROM public."user" where email = $1';
        const result = await dbcon.query(sql, [email]);
        const user = result.rows[0];
        return user;
    }

    static async atualiza(user) {
        const sql = `UPDATE public."user"
            SET nome = $2, 
                email = $3,
                senha = $4,
                imagem = $5
            WHERE id = $1;`;
        const values = [user.id, user.nome, user.email, user.senha, user.imagem];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async cadastrar(user) {
        const sql = 'INSERT INTO public."user" (nome, email, senha, imagem) VALUES ($1, $2, $3, $4);';
        const values = [user.nome, user.email, user.senha, user.imagem];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
            return false;
        }
    }
}

module.exports = {
    User,
    UserDAO
};