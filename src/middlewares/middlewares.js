const middlewareUser = (req, res, next) => {
    const user = req.session.user;
    console.log(user)
    if(user){
        next();
    } else res.redirect('/login.html');
};

const { GrupoDAO } = require('../models/grupo');

const middlewareParticipant = (req, res, next) => {
    const user = req.session.user;
    const { id } = req.params;

    if(user){
        const getGrupos = async () => {
            let grupos = await GrupoDAO.exibirParticipa(user.id);
            if(grupos.find(item => item.id == id)){
                next();
            } else {
                res.redirect('/grupos');
            }
        }
        getGrupos();
    } else res.redirect('/login.html');
};

const middlewareGroupAdminWriter = (req, res, next) => {
    const user = req.session.user;
    const { id } = req.params;

    if(user){
        const getGrupos = async () => {
            let grupos = await GrupoDAO.exibirParticipa(user.id);
            if(grupos.find(item => item.id == id && (item.tipo == 1 || item.tipo == 2))){
                next();
            } else {
                res.redirect('/grupos');
            }
        }
        getGrupos();
    } else res.redirect('/login.html');
};

const middlewareGroupAdmin = (req, res, next) => {
    const user = req.session.user;
    const { id } = req.params;

    if(user){
        const getGrupos = async () => {
            let grupos = await GrupoDAO.exibirParticipa(user.id);
            if(grupos.find(item => item.id == id && item.tipo == 1)){
                next();
            } else {
                res.redirect('/grupos');
            }
        }
        getGrupos();
    } else res.redirect('/login.html');
};

module.exports = { middlewareUser, middlewareParticipant, middlewareGroupAdmin, middlewareGroupAdminWriter };