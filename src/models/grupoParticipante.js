const { dbcon } = require("../config/connection-db");

class GrupoParticipantes {
    constructor(id, user, grupo, tipo, dataregister) {
        this.id = id;
        this.user = user;
        this.grupo = grupo;
        this.tipo = tipo;
        this.dataregister = dataregister;
    }
}

class GrupoParticipantesDAO {
    static async participantesGrupo(grupo) {
        const sql = `SELECT 
            "user".id as userId, 
            "user".nome as nome, 
            "user".imagem as imagem,
            "user".dataregister as userDataregister,
            "grupoParticipantes".id as partId, 
            "grupoParticipantes".grupo as grupo, 
            "grupoParticipantes".tipo as tipo, 
            "grupoParticipantes".dataregister as partDataregister
        FROM public."grupoParticipantes"
            JOIN public."user" on public."grupoParticipantes".user = public."user".id
        WHERE grupo = $1`;
        const result = await dbcon.query(sql, [grupo]);
        const participante = result.rows;
        return participante;
    }

    static async atualizaParticipante(grupo, user) {
        const sql = `UPDATE public."grupoParticipantes"
            SET user = $2, 
                tipo = $3
            WHERE grupo = $1;`;
        const values = [grupo, user.id, user.tipo];
        
        try {
            await dbcon.query(sql, values);
            return true;
        } catch (error) {
            console.log({ error });
            return false;
        }
    }

    static async removerParticipante(grupo, user) {
        const sql = `delete from public."grupoParticipantes" where grupo = $1 and "user" = $2`;
        const values = [grupo, user];

        try {
            await dbcon.query(sql, values);
        } catch (error) {
            console.log('NAO FOI POSSIVEL EXCLUIR');
            console.log({ error });
            return false;
        }
    }

    static async adicionarUser(user, grupo, tipo) {
        const sql = 'INSERT INTO public."grupoParticipantes" ("user", grupo, tipo) VALUES ($1, $2, $3);';
        const values = [user, grupo, tipo];
        
        try {
            const response = await dbcon.query(sql, values);
            return response;
        } catch (error) {
            console.log('NAO FOI POSSIVEL INSERIR');
            console.log({ error });
            return false;
        }
    }
}

module.exports = {
    GrupoParticipantes,
    GrupoParticipantesDAO
};