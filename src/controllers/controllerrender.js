const { getConnection } = require('../database/conexionsql');

async function permisos(opcsis, ruta, req, res, id) {
    try {
        const pool = await getConnection();
        const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
        if (permiso.recordset[0].acceso === 1) {
            res.render(ruta, { layout: false, id: id });
        } else {
            res.render('configuracion/401', { layout: false });
        }
    } catch (error) {
        console.log(error);
    }

}
async function permisosprueba(opcsis, ruta, req, res, id) {
    const pool = await getConnection();
    const permiso = await pool.query(`sp_selVerificarPermisos '${req.user.codrol}','${opcsis}'`);
    if (permiso.recordset[0].acceso === 1) {
        res.render(ruta, { layout: false, id: id });
    } else {
        res.render('configuracion/401pb', { layout: false });
    }
}

module.exports = {
    //render de Bienvenida   
    async renderIniciarSesion(req, res) {
        res.render('auth/iniciarsesion', { layout: false });
    },
    async renderbienvenida(req, res) {
        res.render('inicio');
    },
    //render de configuracion
    async renderusuario(req, res) {
        const parametro = "US";
        permisos(parametro, 'configuracion/usuario', req, res);
    },
    async renderroles(req, res) {
        const parametro = "PE"
        permisos(parametro, 'configuracion/permisos', req, res);
    },
	async rendercambiarContrasena(req, res) {
        res.render('configuracion/cambiarContrasena', { layout: false });
    },
    //historiaclinica
    async renderpacientescitados(req, res) {
        const parametro = "PH";
        permisos(parametro, 'historiaclinica/pacientescitados', req, res);
    },
    async rendermenuexamenes(req, res) {
        const { id } = req.params;

        res.render('historiaclinica/menuexamenes/menuexamenes', { id, layout: false });
    },
    async rendersignosvitalesprueba(req, res) {
        const parametro = "SG";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbsignosvitales', req, res);
    },
    async renderlaboratorioprueba(req, res) {
        const parametro = "LB";
        permisosprueba(parametro, 'historiaclinica/pruebas/pblaboratorio', req, res);
    },
    async renderespirometriaprueba(req, res) {
        const parametro = "ES";
        permisos(parametro, 'historiaclinica/pruebas/pbespirometria', req, res, 0)
    },
    async rendercuestionarioespirometriaprueba(req, res) {
        const parametro = "CE";
        permisos(parametro, 'historiaclinica/pruebas/pbcuestionarioespirometria', req, res, 0)
    },
    async renderpsicologiaprueba(req, res) {
        const parametro = "TP";
        permisos(parametro, 'historiaclinica/pruebas/pbpsicologia', req, res, 0)
    },
    async renderfichamusculoesqueleticaprueba(req, res) {
        const parametro = "ME";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbfichamusculoesqueletica', req, res);
    },
    async renderfichamedicoocupacional312prueba(req, res) {
        const parametro = "MO";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbfichamedicoocupacional312', req, res);
    },
    async renderaudiometriaprueba(req, res) {
        const parametro = "AD";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbaudiometria', req, res);
    },
    async renderrayosxprueba(req, res) {
        const parametro = "IM";
        permisosprueba(parametro, 'historiaclinica/pruebas/pbrayosx', req, res);
    },
    async renderpboftalmologia(req, res) {
        const parametro = "OF";
        permisos(parametro,'historiaclinica/pruebas/pboftalmologia', req, res,0)
    },
	async renderpbprocedimientos(req, res) {
        try {
            const parametro = "PD";
            permisos(parametro, 'historiaclinica/pruebas/pbprocedimientos', req, res, 0);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto' + error });
        }
    },
    async renderpbtamizajedermatologico(req, res) {
        const parametro = "PD";
        permisos(parametro, 'historiaclinica/pruebas/pbtamizajedermatologico', req, res, 0);
    },
    //entidades
    async renderprotocolo(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocolo', req, res);
    },
    async renderprotocolocreate(req, res) {
        const parametro = "PT";
        permisos(parametro, 'entidades/protocoloCreate', req, res, 0);
    },
    async renderprotocoloedit(req, res) {
        const { id } = req.params;
        const parametro = "PT";
        permisos(parametro, 'entidades/protocoloCreate', req, res, id);
    },
    /*Paciente*/
    async renderpaciente(req, res) {
        const parametro = "PC";
        permisos(parametro, 'entidades/paciente', req, res);
    },
    async renderpacientecreate(req, res) {
        const parametro = "PC";
        permisos(parametro, 'entidades/pacienteCreate', req, res, 0);
    }, async renderpacienteedit(req, res) {
        const { id } = req.params;
        const parametro = "PC";
        permisos(parametro, 'entidades/pacienteCreate', req, res, id);
    },
    /*Cita */
    async rendercita(req, res) {
        const parametro = "CT";
        permisos(parametro, 'entidades/cita', req, res)
    },
    async rendercitacreate(req, res) {
        const parametro = "CT";
        permisos(parametro, 'entidades/citaCreate', req, res, 0)
    },
    async rendercitaedit(req, res) {
        const { id } = req.params;
        const parametro = "CT";
        permisos(parametro, 'entidades/citaCreate', req, res, id)
    },
	async rendercitaeditAdmin(req, res) {
        const { id } = req.params;
        const parametro = "CT";
        permisos(parametro, 'entidades/citaCreateAdmin', req, res, id)
    },
    /**Medico */
    async renderemedico(req, res) {
        const parametro = "MD";
        permisos(parametro, 'entidades/medicos', req, res)
    },
    async rendermedicocreate(req, res) {
        const parametro = "MD";
        permisos(parametro, 'entidades/medicosCreate', req, res, 0);
    },
    async rendermedicoedit(req, res) {
        const { id } = req.params;
        const parametro = "MD";
        permisos(parametro, 'entidades/medicosCreate', req, res, id);
    },
    /**Cliente */
    async rendercliente(req, res) {
        const parametro = "CL";
        permisos(parametro, 'entidades/cliente', req, res);
    },
    async renderclientecreate(req, res) {
        const parametro = "CL";
        permisos(parametro, 'entidades/clienteCreate', req, res, 0);
    },
    async renderclienteedit(req, res) {
        const { id } = req.params;
        const parametro = "CL";
        permisos(parametro, 'entidades/clienteCreate', req, res, id);
    },
    /*Examen */
    async renderexamen(req, res) {
        const parametro = "EX";
        permisos(parametro, 'entidades/examen', req, res)
    },
    async renderexamencreate(req, res) {
        const parametro = "EX";
        permisos(parametro, 'entidades/examenCreate', req, res, 0)
    },
    async renderexamenedit(req, res) {
        const { id } = req.params;
        const parametro = "EX";
        permisos(parametro, 'entidades/examenCreate', req, res, id);
    },

    /*Descargas*/
    async renderinformes(req, res) {

        const parametro = "IN";
        permisos(parametro, 'descargas/informes', req, res)
    },
    /*Equipos*/
    async renderequipo(req, res) {
        const parametro = "EQ";
        permisos(parametro, 'entidades/equipos', req, res)
    },
    async renderequiposcreate(req, res) {
        const parametro = "EQ";
        permisos(parametro, 'entidades/equiposCreate', req, res, 0)
    },
    async renderequiposedit(req, res) {
        const { id } = req.params;
        const parametro = "EQ";
        permisos(parametro, 'entidades/equiposCreate', req, res, id)
    },
    /*Rangos */
    async renderrangos(req, res) {
        const parametro = "RG";
        permisos(parametro, 'entidades/rangos', req, res)
    },
    async renderrangoscreate(req, res) {
        const parametro = "RG";
        permisos(parametro, 'entidades/rangosCreate', req, res, 0)
    },
    async renderrangosedit(req, res) {
        const { id } = req.params;
        const parametro = "RG";
        permisos(parametro, 'entidades/rangosCreate', req, res, id)
    },
    
};
