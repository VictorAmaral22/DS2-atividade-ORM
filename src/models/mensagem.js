const { dbcon } = require("../config/connection-db");

class Mensagem {
    constructor(id, user, data, texto, grupo) {
        this.id = id;
        this.user = user;
        this.data = data;
        this.texto = texto;
        this.grupo = grupo;
    }
}

class MensagemDAO {
    static async buscaPeloId(id) {
        const sql = 'SELECT * FROM mensagem where id = $1';
        const result = await dbcon.query(sql, [id]);
        const user = result.rows[0];
        return user;
    }

    static async qtdMensagens(grupo) {
        const sql = 'SELECT count(*) as qtd FROM mensagem where grupo = $1';
        const result = await dbcon.query(sql, [grupo]);
        const qtdMsg = result.rows[0].qtd;
        return qtdMsg;
    }

    static async mensagensGrupo(grupo, page) {
        const sql = `SELECT * FROM public.mensagem
                JOIN public."user" on public.mensagem.user = public."user".id
            WHERE 
                grupo = $1
            ORDER BY public.mensagem.DATA DESC
            LIMIT 10
            OFFSET $2`;
        const result = await dbcon.query(sql, [grupo, (page == 1 ? 0 : (page*10)-10 )]);
        const mensagens = result.rows;
        return mensagens;
    }

    static async enviarMensagem(user, texto, grupo) {
        const sql = 'INSERT INTO public.mensagem ("user", texto, grupo) VALUES ($1, $2, $3)';
        const values = [user, texto, grupo];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
            return false;
        }
    }

    static async enviarNotificacao(user, texto, grupo) {
        const sql = 'INSERT INTO public.mensagem ("user", texto, grupo, isnotification) VALUES ($1, $2, $3, true)';
        const values = [user, texto, grupo];
        
        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
            return false;
        }
    }
}

module.exports = {
    Mensagem,
    MensagemDAO
};