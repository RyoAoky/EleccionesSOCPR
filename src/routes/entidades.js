const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");

const controllerEn = require("../controllers/controllerentidades");

const { } = require('../lib/permisos');


/*****************Protocolo*****************/
router.get('/protocolo', isLoggedIn, controllerrender.renderprotocolo);
router.get('/protocololist', isLoggedIn, controllerEn.getprotocololist);
router.get('/protocololistimport', isLoggedIn, controllerEn.getprotocololistimport);
//router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);

//router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolocreate', isLoggedIn, controllerrender.renderprotocolocreate);
router.get('/protocoloedit/:id', isLoggedIn, controllerrender.renderprotocoloedit);
router.get('/protocolodatos/:id', isLoggedIn, controllerEn.getprotocolodatos);
router.get('/examenes',isLoggedIn, controllerEn.getexamenes);
router.delete('/protocolodel',isLoggedIn, controllerEn.delprotocolo);
router.get('/examenes/:id',isLoggedIn, controllerEn.getexamenesid);
router.get('/empresas',isLoggedIn, controllerEn.getempresas);
router.get('/tipoexamen',isLoggedIn, controllerEn.getTipoExamenes);
router.post('/protocolo',isLoggedIn, controllerEn.postprotocolo);
router.get('/exportarprotocolo/:id',isLoggedIn, controllerEn.getexportarprotocolo);
/******************************************/

/*****************Paciente*****************/
router.get('/paciente', isLoggedIn, controllerrender.renderpaciente);//renderpaciente
router.get('/pacientecreate', isLoggedIn, controllerrender.renderpacientecreate);
router.get('/pacienteedit/:id', isLoggedIn, controllerrender.renderpacienteedit);
router.get('/listarpacientes',isLoggedIn,controllerEn.getpaciente)
router.delete('/deletePac',isLoggedIn,controllerEn.deletepaciente);
router.get('/listarCombosPac', isLoggedIn, controllerEn.getPacienteCombos);
router.get('/listardistrito',isLoggedIn,controllerEn.getDistrito);
router.get('/listarpais',isLoggedIn,controllerEn.getPais);
router.post('/paciente',isLoggedIn,controllerEn.postpaciente);

/******************************************/
/*****************Citas*****************/
router.get('/cita', isLoggedIn, controllerrender.rendercita);
router.get('/listarCombosCitas', isLoggedIn, controllerEn.getCitasCombos);
router.get('/listarprotocolo', isLoggedIn, controllerEn.getProtocoloCombos);
router.post('/cita',isLoggedIn,controllerEn.postcita)
router.get('/listarcitas', isLoggedIn, controllerEn.getListaCitas);
router.get('/citacreate', isLoggedIn, controllerrender.rendercitacreate);
router.get('/citaedit/:id', isLoggedIn, controllerrender.rendercitaedit);
router.delete('/citadel',isLoggedIn, controllerEn.delcita);
router.post('/listarhrc', isLoggedIn, controllerEn.getListaHojaRutaC);
router.post('/listarhrd', isLoggedIn, controllerEn.getListaHojaRutaD);
router.post('/listarcinf', isLoggedIn, controllerEn.getListaConsetimientoInf);
router.get('/listarempresa', isLoggedIn, controllerEn.getempresaCita);
router.post('/cerrarcitas', isLoggedIn, controllerEn.postcerrarcitas);
router.post('/grabardocadjcitas', isLoggedIn, controllerEn.postdocadjcita);
router.get('/citaeditadmin/:id', isLoggedIn, controllerrender.rendercitaeditAdmin);
router.post('/citaAdmin',isLoggedIn,controllerEn.postcitaAdmin)

/*****************Médico*******************/
router.get('/medico', isLoggedIn, controllerrender.renderemedico);
router.get('/medicocreate', isLoggedIn, controllerrender.rendermedicocreate);
router.post('/medico',isLoggedIn,controllerEn.postmedico);
router.get('/listarmedicos',isLoggedIn,controllerEn.getmedicolist);
router.delete('/deleteMed',isLoggedIn,controllerEn.deletemedico);
router.get('/medicoedit/:id', isLoggedIn, controllerrender.rendermedicoedit);

/****************Cliente******************/
router.get('/cliente', isLoggedIn, controllerrender.rendercliente);
router.post('/cliente',isLoggedIn,controllerEn.postcliente);
router.get('/listarcliente',isLoggedIn,controllerEn.getcliente);
router.delete('/deleteCli',isLoggedIn,controllerEn.deletecliente);
router.get ('/clientescreate',isLoggedIn,controllerrender.renderclientecreate);
router.get('/clienteedit/:id', isLoggedIn, controllerrender.renderclienteedit);
/******************************************/
/****************Examenes******************/

router.get('/examen', isLoggedIn, controllerrender.renderexamen);
router.get('/examencreate', isLoggedIn, controllerrender.renderexamencreate);
router.get('/examenedit/:id', isLoggedIn, controllerrender.renderexamenedit);
router.get('/listarexamenes', isLoggedIn, controllerEn.getListaExamenes);
router.post('/examen', isLoggedIn, controllerEn.postExamenes);
router.delete('/deleteExamenes',isLoggedIn,controllerEn.delexamen);
/******************************************/
/**************Equipos****************/

router.get('/equipo', isLoggedIn, controllerrender.renderequipo);
router.get('/listarequipos',isLoggedIn,controllerEn.getequipos);
router.get('/equiposcreate', isLoggedIn, controllerrender.renderequiposcreate);
router.post('/equipos',isLoggedIn,controllerEn.postequipos);
router.get('/equiposedit/:id', isLoggedIn, controllerrender.renderequiposedit);
router.delete('/equiposdel',isLoggedIn,controllerEn.deleteequipos);
/******************************************/

/**************Rangos****************/
router.get('/rangos', isLoggedIn, controllerrender.renderrangos);
router.get('/rangoscreate', isLoggedIn, controllerrender.renderrangoscreate);
router.get('/listarrangos',isLoggedIn,controllerEn.getrangos);
router.post('/rangos',isLoggedIn,controllerEn.postrangos);
/******************************************/
/**************Pruebas Examen****************/
router.get('/listarpruebas',isLoggedIn,controllerEn.getpruebas);
/******************************************/

/**************Parametros examen (parexa_id)****************/
router.get('/listarparametros',isLoggedIn,controllerEn.getparametros);
/******************************************/
/**************Unidades (codlabuni_id)****************/
router.get('/listarunidadesandsexo',isLoggedIn,controllerEn.getunidadesandsexo);
/******************************************/



module.exports = router;