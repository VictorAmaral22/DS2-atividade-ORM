const { Router } = require('express');
const GruposController = require('../controllers/grupo-controllers');
const { middlewareUser, middlewareParticipant, middlewareGroupAdminWriter, middlewareGroupAdmin } = require('../middlewares/middlewares');

const routes = Router();

const gruposController = new GruposController();

routes.get('/', middlewareUser, gruposController.listagem);

routes.post('/cadastrar', middlewareUser, gruposController.cadastrar);
routes.post('/:id/deleteGroup', middlewareGroupAdmin, gruposController.deleteGroup);

routes.get('/:id/:page', middlewareParticipant, gruposController.detalhar);
routes.post('/:id/enviarMensagem', middlewareGroupAdminWriter, gruposController.sendMessage);

routes.post('/:id/addMember', middlewareGroupAdmin, gruposController.addMember);
routes.post('/:id/removeMember', middlewareGroupAdmin, gruposController.removeFromGroup);
routes.post('/:id/exitGroup', middlewareParticipant, gruposController.exitGroup);

module.exports = routes;