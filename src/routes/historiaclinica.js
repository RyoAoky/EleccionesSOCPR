const express = require('express');
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const controllerrender = require("../controllers/controllerrender");
const controllerHI = require("../controllers/controllerHistoriaclinica");

/*****************Pacientes citados*****************/
router.get('/pacientescitados', isLoggedIn, controllerrender.renderpacientescitados);
router.get('/pacientescitadoslist', isLoggedIn, controllerHI.getpacientescitados);
router.get('/cmbexamen', isLoggedIn, controllerHI.getcmbexamen);
router.get('/recordexamenes', isLoggedIn, controllerHI.getrecordexamenes);
/***************************************************/

/*****************Menú examenes genéricos*****************/
router.get('/pacienteexamen/:id/', isLoggedIn, controllerHI.getpacienteexamen);
router.get('/arbolpruebas/:id', isLoggedIn, controllerHI.getarbolpruebas);
/*********************************************************/

/*****************CIE 1O*****************/
router.get('/cie10', isLoggedIn, controllerHI.getcie10);
router.get('/cie10list', isLoggedIn, controllerHI.getcie10list);
/************************************************/

/*****************Documentos adicionales*****************/
router.post('/subirdocumento', isLoggedIn, controllerHI.postdocumento);
router.post('/subirdocumentocita', isLoggedIn, controllerHI.postdocumentoCita);
router.delete('/eliminardocumento', isLoggedIn, controllerHI.deldocumento);
router.delete('/eliminardocumentocitas', isLoggedIn, controllerHI.deldocumentoCitas);
/************************************************/

/*************Menú de examenes y pruebas*************/
router.get('/menuexamenes/:id', isLoggedIn, controllerrender.rendermenuexamenes);
/************************************************/

/*****************Pruebas*****************/
router.get('/pbsignosvitales', isLoggedIn, controllerrender.rendersignosvitalesprueba);
router.post('/pbsignosvitales', isLoggedIn, controllerHI.postsignosvitales);
router.get('/resultsignosvitales', isLoggedIn, controllerHI.getresultsignosvitales);

router.get('/pblaboratorio', isLoggedIn, controllerrender.renderlaboratorioprueba); 
router.get('/pruebascards', isLoggedIn, controllerHI.getpruebascards); 
router.get('/parametros', isLoggedIn, controllerHI.getparametros); 
router.post('/pblaboratorio', isLoggedIn, controllerHI.postlaboratorio);
router.get('/resultlaboratorio', isLoggedIn, controllerHI.getresultlaboratorio);
/****************Espirometria*****************/
router.get('/pbespirometria', isLoggedIn, controllerrender.renderespirometriaprueba);
router.get('/resultespirometria', isLoggedIn, controllerHI.getresultespirometria);
router.get('/parametrosespiro', isLoggedIn, controllerHI.getparametrosespiro);
router.post('/pbespirometria', isLoggedIn, controllerHI.postespirometria);
/**********************************************/
/****************Cuestionario Espirometria*****************/
router.get('/pbcuestionarioespirometria', isLoggedIn, controllerrender.rendercuestionarioespirometriaprueba);
router.get('/resultcuestionarioespirometria', isLoggedIn, controllerHI.getresultcuestionarioespirometria);
router.post('/pbcuestionarioespiromeria', isLoggedIn, controllerHI.postcuestionarioespiromeria);
/*********************************************/
/****************Psicologia*****************/
router.get('/pbpsicologia', isLoggedIn, controllerrender.renderpsicologiaprueba);
router.get('/resultpsicologia', isLoggedIn, controllerHI.getresultpsicologia);
router.post('/pbpsicologia', isLoggedIn, controllerHI.postpsicologia);
router.get('/tablapsicologiatest', isLoggedIn, controllerHI.getpsicologiatest);
//pa_SelTablaPsicologiaTest

/*********************************************/
/****************Ficha medico ocupacional 312*****************/
router.get('/pbfichamedicoocupacional312', isLoggedIn, controllerrender.renderfichamedicoocupacional312prueba);
router.post('/pbfichamedicoocupacional312', isLoggedIn, controllerHI.postfichamedicoocupacional312);
router.get('/resultfichamedicoocupacional312', isLoggedIn, controllerHI.getresultfichamedicoocupacional312);
router.get('/datosPacienteFicha312', isLoggedIn, controllerHI.getdatosPacienteFicha312);
router.get('/getdatosformatosficha312', isLoggedIn, controllerHI.getdatosformatosficha312);
router.get('/getresultadosfichas', isLoggedIn, controllerHI.getresultadofichas);
router.get('/importarcie10', isLoggedIn, controllerHI.getimportarcie10);
router.get('/importarrecomendaciones', isLoggedIn, controllerHI.getimportarrecomendaciones);
router.get('/validarficha312', isLoggedIn, controllerHI.validarFicha312);
router.get('/notificacionficha312', isLoggedIn, controllerHI.getnotificacionficha312);
/************************************************/
/*****************Ficha Musculo Esqueletica*****************/
router.get('/pbfichamusculoesqueletica', isLoggedIn, controllerrender.renderfichamusculoesqueleticaprueba);
router.post('/pbfichamusculoesqueletica', isLoggedIn, controllerHI.postfichamusculoesqueletica);
router.get('/resultfichamusculoesqueletica', isLoggedIn, controllerHI.getresultfichamusculoesqueletica);
/**************** Audiometria *********************/
router.get('/pbaudiometria', isLoggedIn, controllerrender.renderaudiometriaprueba);
router.post('/pbaudiometria', isLoggedIn, controllerHI.postaudiometria);
router.get('/equipos', isLoggedIn, controllerHI.getequipos);
router.get('/resultaudiometria', isLoggedIn, controllerHI.getresultaudiometria);
/***************************************************/
/**************** Diagnostico imagen *********************/
router.get('/pbrayosx', isLoggedIn, controllerrender.renderrayosxprueba);
router.get('/rayosxparametros', isLoggedIn, controllerHI.getresultparametrosrayosx);
router.get('/resultrayosx', isLoggedIn, controllerHI.getresultrayosx);
router.post('/pbrayosx', isLoggedIn, controllerHI.postrayosx);

/***************************************************/

/*************** Formato Salud Ocupacional *****************/
router.get('/resultformatosaludocupacional', isLoggedIn, controllerHI.getresultformatosaludocupacional);


/*****Oftalmologia******/
router.get('/pboftalmologia', isLoggedIn, controllerrender.renderpboftalmologia);
router.get('/resultoftalmologia', isLoggedIn, controllerHI.getresultoftalmologia);
router.get('/tablaoftalmologiatest', isLoggedIn, controllerHI.getoftalmologiatest);
router.post('/pboftalmologia', isLoggedIn, controllerHI.postoftalmologia);
/***************/
/*****Procedimientos****/
router.get('/pbprocedimientos', isLoggedIn, controllerrender.renderpbprocedimientos);
router.get('/procedimientosparametros', isLoggedIn, controllerHI.getresultparametrosprocedimientos);
router.get('/resultprocedimientos', isLoggedIn, controllerHI.getresultprocedimientos);
router.post('/pbprocedimientos', isLoggedIn, controllerHI.postprocedimientos);
router.get('/getdatosformatosprocedimientos', isLoggedIn, controllerHI.getdatosformatoprocedimientos);
/*********************/
/***************Tamizaje dermatológico*********************/
router.get('/pbtamizajedermatologico', isLoggedIn, controllerrender.renderpbtamizajedermatologico);
router.get('/resulttamizajedermatologico', isLoggedIn, controllerHI.getresulttamizajedermatologico);
router.post('/pbtamizajedermatologico', isLoggedIn, controllerHI.postpbtamizajedermatologico);
/*********************/
module.exports = router;
