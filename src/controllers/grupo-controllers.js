const { Grupo, GrupoDAO } = require('../models/grupo');
const { GrupoParticipantesDAO } = require('../models/grupoParticipante');
const { MensagemDAO } = require('../models/mensagem');
const { User, UserDAO } = require('../models/user');
class GruposController {
    async listagem(req, res) {
        const user = req.session.user;
        const grupos = await GrupoDAO.exibirParticipa(user.id);
        console.log('grupos ',grupos);
        
        return res.render('listagem', { user: user, grupos: grupos });
    }

    async detalhar(req, res) {
        const user = req.session.user;
        const { id, page } = req.params;
        const grupos = await GrupoDAO.exibirParticipa(user.id);
        const grupo = await GrupoDAO.detalhar(id);
        const participantes = await GrupoParticipantesDAO.participantesGrupo(id);
        const mensagens = await MensagemDAO.mensagensGrupo(id, page);
        const qtdMsgs = await MensagemDAO.qtdMensagens(id);
        const proxPaginas = qtdMsgs/10;

        console.log('participantes',participantes);
        
        return res.render('detalhar', { 
            user: req.session.user, 
            grupos: grupos, 
            grupo: grupo, 
            participantes: participantes, 
            mensagens: mensagens, 
            page: page, 
            proxPaginas: proxPaginas 
        });
    }
    async cadastrar(req, res) {
        const user = req.session.user;
        const { nome, imagem } = req.body;
        
        const addGroup = await GrupoDAO.cadastrar(nome, user.id, imagem);
        const addAdmin = await GrupoParticipantesDAO.adicionarUser(user.id, addGroup.rows[0].id, 1);
        return res.redirect('/grupos');
    }

    async sendMessage (req, res) {
        const user = req.session.user;
        const { mensagem } = req.body;
        const { id } = req.params;

        const response = await MensagemDAO.enviarMensagem(user.id, mensagem, id);
        return res.redirect(`/grupos/${id}/1`);
    }

    async addMember(req, res) {
        const user = req.session.user;
        const { email, tipo } = req.body;
        const { id } = req.params;
        const memberExist = await UserDAO.buscaPeloEmail(email);
        if(memberExist){
            const addMember = await GrupoParticipantesDAO.adicionarUser(memberExist.id, id, tipo);
            const response = await MensagemDAO.enviarNotificacao(user.id, `${user.nome} adicionou ${memberExist.nome}`, id);
            return res.redirect(`/grupos/${id}/1`);
        } else {
            return res.redirect(`/grupos/${id}/1?error=user-not-found`);
        }
    }

    async removeFromGroup (req, res) {
        const user = req.session.user;
        const { userId } = req.body;
        const { id } = req.params;
        const memberInfo = await UserDAO.buscaPeloId(userId);

        const response = await GrupoParticipantesDAO.removerParticipante(id, userId);
        const response2 = await MensagemDAO.enviarNotificacao(user.id, `${user.nome} removeu ${memberInfo.nome}`, id);
        return res.redirect(`/grupos/${id}/1`);
    }

    async exitGroup (req, res) {
        const { userId } = req.body;
        const { id } = req.params;
        console.log(userId)

        const response = await GrupoParticipantesDAO.removerParticipante(id, userId);
        return res.redirect(`/grupos`);
    }

    async deleteGroup (req, res) {
        const { id } = req.params;
        const response = await GrupoDAO.deleta(id);
        return res.redirect(`/grupos`);
    }
}

module.exports = GruposController;
