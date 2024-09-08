const { getConnection } = require('../database/conexionsql');
const sql = require('mssql');
const fs = require('fs').promises;
const fs1 = require('fs');
const sharp = require('sharp');
const path = require('path');
const mustache = require('mustache');
const { PDFDocument, rgb } = require('pdf-lib');
const puppeteer = require('puppeteer');


function obtenerArray(dataJSON, propiedad) {
    let resultado = "";
    dataJSON.forEach((obj) => {
        resultado = obj[propiedad];
    });
    return resultado;
}
async function actualizarRutas(pool, doc_adic_id) {
    if (doc_adic_id != 0) {
        const resultDocumento = await pool.query(`pa_SelDocumento ${doc_adic_id}`);
        const jsonAntiguo = resultDocumento.recordset[0].file_cont;
        const rutas = JSON.parse(jsonAntiguo);
        const jsonActualizado = await Promise.all(rutas.map(async (doc) => {
            const rutaAntigua = doc.ruta;
            const rutaNueva = rutaAntigua.replace('.temp', '');

            const rutaArchivoAntiguo = path.join(__dirname, '..', 'public', rutaAntigua);
            const rutaArchivoNuevo = path.join(__dirname, '..', 'public', rutaNueva);

            try {
                await fs.rename(rutaArchivoAntiguo, rutaArchivoNuevo);
            } catch (error) {
                console.error(`Error renaming file: ${error}`);
            }

            return {
                nombre: doc.nombre,
                ruta: rutaNueva
            };
        }));
        let jsonNuevo = JSON.stringify(jsonActualizado);
        const actualizar = await pool.query(`pa_InsDocumento '${jsonNuevo}', ${doc_adic_id}`);
        return actualizar.recordset[0].icono;
    }
}
module.exports = {
    /*****************Pacientes citados*****************/
    async getcmbexamen(req, res) {
        try {
            const pool = await getConnection();
            const examenes = await pool.query(`pa_SelCmbExamenes`);
            res.json(examenes.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }

    },
    async getpacientescitados(req, res) {
        try {
            let { fechainicio, fechafin, paciente, estado, examen, cliente, protocolo } = req.query;
            if (paciente === '') {
                paciente = '%';
            }
            const pool = await getConnection();
            const pacientescitados = await pool.query(`pa_SelPacientesCitados '${fechainicio}','${fechafin}','${paciente}','${estado}','${examen}', '${cliente}', '${protocolo}'`);
            if (pacientescitados.recordset === undefined) {
                res.json([]);
            } else {
                res.json(pacientescitados.recordset);
            }
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getrecordexamenes(req, res) {
        try {
            let { cita_id } = req.query;
            const pool = await getConnection();
            const record = await pool.query(`pa_SelRecord '${cita_id}'`);
            res.json(record.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getpacienteexamen(req, res) {
        try {
            const { id } = req.params;
            const pool = await getConnection();
            const pruebas = await pool.query(`pa_SelPacienteExamen '${id}'`);
            res.json(pruebas.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getarbolpruebas(req, res) {
        try {
            const { id } = req.params;
            const pool = await getConnection();
            const pruebas = await pool.query(`pa_SelMenuExamenes '${id}'`);
            res.json(pruebas.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getcie10(req, res) {
        try {
            let { cie10 } = req.query;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();
            const cie10unique = await pool.query(`pa_Selcie10unique '${cie10}','${codrolUser}'`);
            res.json(cie10unique.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getcie10list(req, res) {
        try {
            let { cie10 } = req.query;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();
            const cie10list = await pool.query(`pa_Selcie10list '${cie10}','${codrolUser}'`);
            res.json(cie10list.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });

        }
    },
    async postdocumento(req, res) {
        try {
            const { archivos, cita_id, soexa, codpru_id, doc_adic_id } = req.body;
            const pool = await getConnection();
            const mimeToExtension = {
                'application/pdf': 'pdf',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/jpeg': 'jpeg',
            };
            if (doc_adic_id !== 0 || doc_adic_id !== '0') {
                try {
                    const resultDocumento = await pool.query(`pa_SelDocumento ${doc_adic_id}`);
                    const jsonAntiguo = resultDocumento.recordset[0].file_cont;
                    const rutas = JSON.parse(jsonAntiguo);
                    rutas.forEach(rutaArch => {
                        const rutaUnlink = path.join(__dirname, '..', 'public', rutaArch.ruta);
                        try {
                            fs.unlink(rutaUnlink);
                        } catch (err) {
                            console.log(`Error al eliminar el archivo: ${rutaUnlink}`);
                        }
                    });
                } catch (err) {
                    console.error('jsonAntiguo no es un JSON válido');
                }
            }
            const codrolUser = req.user.codrol;

            const newArchivo = [];

            for (let i = 0; i < archivos.length; i++) {
                const archivo = archivos[i];
                const nombreArchivo = archivo.nombreArchivo;
                const base64Data = archivo.base64;

                const imagenBase64SinPrefijo = base64Data.replace(/^data:.*;base64,/, '');
                const buffer = Buffer.from(imagenBase64SinPrefijo, 'base64');

                const tipoMime = base64Data.match(/^data:(.*?);base64,/)[1];
                let extension = mimeToExtension[tipoMime];

                if (!extension) {
                    throw new Error('Tipo de archivo no soportado');
                }
                let nombreModificado = "";
                if (doc_adic_id === 0 || doc_adic_id === '0') {
                    nombreModificado = `${soexa}_${codpru_id}_${cita_id}_${i + 1}.${extension}.temp`;

                } else {
                    nombreModificado = `${soexa}_${codpru_id}_${cita_id}_${i + 1}.${extension}`;
                }
                const rutaArchivo = path.join(__dirname, '..', 'public', 'documentos', nombreModificado);
                const rutaArchivo1 = `/documentos/${nombreModificado}`;

                var rowData = {
                    nombre: nombreArchivo,
                    ruta: rutaArchivo1
                };

                newArchivo.push(rowData);

                fs1.writeFileSync(rutaArchivo, buffer);
            }
            const newArchivoJson = JSON.stringify(newArchivo);
            const documento = await pool.query(`pa_InsDocumento '${newArchivoJson}',${doc_adic_id}`);
            res.json(documento.recordset);
        } catch (error) {
            console.error("Error en la función postDocumento:" + error);
            res.status(500).json({ error: "Error en el servidor: " + error });
        }
    },
    async postdocumentoCita(req, res) {
        try {
            const { archivos, cita_id, soexa, codpru_id, doc_adic_id } = req.body;
            const pool = await getConnection();
            const mimeToExtension = {
                'application/pdf': 'pdf',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/jpeg': 'jpeg',
            };
            if (doc_adic_id !== 0 || doc_adic_id !== '0') {
                try {
                    const resultDocumento = await pool.query(`pa_SelDocumento ${doc_adic_id}`);
                    const jsonAntiguo = resultDocumento.recordset[0].file_cont;
                    const rutas = JSON.parse(jsonAntiguo);
                    rutas.forEach(rutaArch => {
                        const rutaUnlink = path.join(__dirname, '..', 'public', rutaArch.ruta);
                        try {
                            fs.unlink(rutaUnlink);
                        } catch (err) {
                            console.log(`Error al eliminar el archivo: ${rutaUnlink}`);
                        }
                    });
                } catch (err) {
                    console.error('jsonAntiguo no es un JSON válido');
                }
            }
            const codrolUser = req.user.codrol;

            const newArchivo = [];

            for (let i = 0; i < archivos.length; i++) {
                const archivo = archivos[i];
                const nombreArchivo = archivo.nombreArchivo;
                const base64Data = archivo.base64;

                const imagenBase64SinPrefijo = base64Data.replace(/^data:.*;base64,/, '');
                const buffer = Buffer.from(imagenBase64SinPrefijo, 'base64');

                const tipoMime = base64Data.match(/^data:(.*?);base64,/)[1];
                let extension = mimeToExtension[tipoMime];

                if (!extension) {
                    throw new Error('Tipo de archivo no soportado');
                }
                let nombreModificado = "";
                if (doc_adic_id === 0 || doc_adic_id === '0') {
                    nombreModificado = `${soexa}_${codpru_id}_${cita_id}_${i + 1}.${extension}.temp`;

                } else {
                    nombreModificado = `${soexa}_${codpru_id}_${cita_id}_${i + 1}.${extension}`;
                }
                const rutaArchivo = path.join(__dirname, '..', 'public', 'documentos', 'cita', nombreModificado);
                const rutaArchivo1 = `/documentos/cita/${nombreModificado}`;

                var rowData = {
                    nombre: nombreArchivo,
                    ruta: rutaArchivo1
                };

                newArchivo.push(rowData);

                fs1.writeFileSync(rutaArchivo, buffer);
            }
            const newArchivoJson = JSON.stringify(newArchivo);
            const documento = await pool.query(`pa_InsDocumento '${newArchivoJson}',${doc_adic_id}`);
            res.json(documento.recordset);
        } catch (error) {
            console.error("Error en la función postDocumento:" + error);
            res.status(500).json({ error: "Error en el servidor: " + error });
        }
    },
    async deldocumento(req, res) {
        try {
            const { doc_adic_id, cita_id, soexa, codpru_id } = req.body;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();

            if (doc_adic_id !== 0) {
                try {
                    const resultDocumento = await pool.query(`pa_SelDocumento ${doc_adic_id}`);
                    const jsonAntiguo = resultDocumento.recordset[0].file_cont;
                    const rutas = JSON.parse(jsonAntiguo);
                    rutas.forEach(rutaArch => {
                        const rutaUnlink = path.join(__dirname, '..', 'public', rutaArch.ruta);
                        try {
                            fs.unlink(rutaUnlink);
                        } catch (err) {
                            console.log(`Error al eliminar el archivo: ${rutaUnlink}`);
                        }
                    });
                } catch (err) {
                    console.error('dataJSON no es un JSON válido');
                }
            }

            const documento = await pool.query(`pa_DelDocumento '${doc_adic_id}','${codrolUser}'`);
            res.json(documento.recordset);

        } catch (error) {
            console.error("Error en la función postDocumento:", error);
            res.status(500).json({ error: "Error en el servidor" });
        }
    },
    async deldocumentoCitas(req, res) {
        try {
            const { doc_adic_id, cita_id, soexa, codpru_id } = req.body;
            const codrolUser = req.user.codrol;
            const pool = await getConnection();
            if (doc_adic_id !== 0) {
                try {
                    const resultDocumento = await pool.query(`pa_SelDocumento ${doc_adic_id}`);
                    const jsonAntiguo = resultDocumento.recordset[0].file_cont;
                    const rutas = JSON.parse(jsonAntiguo);
                    rutas.forEach(rutaArch => {
                        const rutaUnlink = path.join(__dirname, '..', 'public', rutaArch.ruta);
                        try {
                            fs.access(rutaUnlink);
                            fs.unlink(rutaUnlink);
                        } catch (err) {
                            if (err.code === 'ENOENT') {
                                res.status(500).json({ error: `El archivo no existe: ${rutaUnlink}` + err });
                                console.log(`El archivo no existe: ${rutaUnlink}`);
                            } else {
                                res.status(500).json({ error: `Error al eliminar el archivo: ${rutaUnlink}` + err });
                                console.log(`Error al eliminar el archivo: ${rutaUnlink}`);
                                throw err; // Lanzar el error para que sea capturado por el catch externo
                            }
                        }
                    });
                } catch (err) {
                    res.status(500).json({ error: 'dataJSON no es un JSON válido' + err });
                    console.error('dataJSON no es un JSON válido');
                }
            }
            const documento = await pool.query(`pa_DelDocumento_citas '${doc_adic_id}','${codrolUser}'`);
            res.json(documento.recordset);

        } catch (err) {
            console.error("Error en la función postDocumento:", err);
            res.status(500).json({ error: "Error en el servidor" + err });
        }
    },
    async getresultsignosvitales(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultSignosVitales '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postsignosvitales(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, fc, fr, pa, sato2, peso, talla, imc, peab, temp, datains, doc_adic_id, datainsrec } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';

            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error a');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbSignosVitales';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('fc', sql.VarChar(20), fc);
            request.input('fr', sql.VarChar(20), fr);
            request.input('pa', sql.VarChar(20), pa);
            request.input('sato2', sql.VarChar(20), sato2);
            request.input('peso', sql.VarChar(20), peso);
            request.input('talla', sql.VarChar(20), talla);
            request.input('imc', sql.VarChar(20), imc);
            request.input('peab', sql.VarChar(20), peab);
            request.input('temp', sql.VarChar(20), temp);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getpruebascards(req, res) {
        try {
            let { soexa, cita_id } = req.query;
            const pool = await getConnection();
            const pruebas = await pool.query(`pa_SelPruebasPorExamen '${soexa}','${cita_id}'`);
            res.json(pruebas.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getparametros(req, res) {
        try {
            let { codpru_id, nuncom, pachis } = req.query;
            const pool = await getConnection();
            const parametros = await pool.query(`pa_selparametroslab '${codpru_id}','${nuncom}',${pachis}`);
            res.json(parametros.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postlaboratorio(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbLaboratorio';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsonparametros', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultlaboratorio(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultlaboratorio '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /**************** Espirometria ***********************/
    async getparametrosespiro(req, res) {
        try {
            let { codpru_id, nuncom } = req.query;
            const pool = await getConnection();
            const parametros = await pool.query(`pa_SelParametrosEspiro ${codpru_id},${nuncom}`);
            res.json(parametros.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postespirometria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbEspirometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsonespiro', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultespirometria(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultespirometria '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /************************************************/
    /*************** Ficha Musculo Esqueletica *****************/
    async getresultfichamusculoesqueletica(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultFichaMusculoesqueletica '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postfichamusculoesqueletica(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, aptitud_espalda, flex_fuerza, rangos_articulares, datains, doc_adic_id, datainsrec, conclusion } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonflex_fuerza = JSON.stringify(flex_fuerza);
            const detalleJsonrangos_articulares = JSON.stringify(rangos_articulares);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbFichaMusculoEsqueletica';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('conclusion', sql.VarChar(sql.MAX), conclusion);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('aptitud_espalda', sql.VarChar(40), aptitud_espalda);
            request.input('flex_fuerza', sql.VarChar(sql.MAX), detalleJsonflex_fuerza);
            request.input('rangos_articulares', sql.VarChar(sql.MAX), detalleJsonrangos_articulares);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /***************************************************/
    /*************** Cuestionario Espirometria *****************/
    async postcuestionarioespiromeria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbCuestionarioEspirometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsoncuestionarioespiro', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultcuestionarioespirometria(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultCuestionarioEspirometria '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /***************************************************/
    /**************** Psicologia ******************/
    async postpsicologia(req, res) {
        try {

            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, cod_present, cod_postura, dis_ritmo, dis_tono, dis_articulacion, ori_tiempo, ori_espacio, ori_persona, pro_cog_lucido_atento, pro_cog_pensamiento, pro_cog_percepcion, pro_cog_memoria, pro_cog_inteligencia, pro_cog_apetito, pro_cog_sueño, re_nivel_inte, re_coord_visomotriz, re_nivel_memoria, re_personalidad, re_afectividad, con_area_cognitiva, con_area_emocional, tipresult_id, dataparametros, mot_eva, tiem_lab, prin_riesgos, med_seguridad, dataantrelacionados, historia_familiar, accid_enfer, habitos, otras_observ, conducta_sexual } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const detalleJstonant_empresas = JSON.stringify(dataantrelacionados);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbPsicologia';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('cod_present', sql.VarChar(60), cod_present);
            request.input('cod_postura', sql.VarChar(60), cod_postura);
            request.input('dis_ritmo', sql.VarChar(60), dis_ritmo);
            request.input('dis_tono', sql.VarChar(60), dis_tono);
            request.input('dis_articulacion', sql.VarChar(60), dis_articulacion);
            request.input('ori_tiempo', sql.VarChar(60), ori_tiempo);
            request.input('ori_espacio', sql.VarChar(60), ori_espacio);
            request.input('ori_persona', sql.VarChar(60), ori_persona);
            request.input('pro_cog_lucido_atento', sql.VarChar(60), pro_cog_lucido_atento);
            request.input('pro_cog_pensamiento', sql.VarChar(60), pro_cog_pensamiento);
            request.input('pro_cog_percepcion', sql.VarChar(60), pro_cog_percepcion);
            request.input('pro_cog_memoria', sql.VarChar(60), pro_cog_memoria);
            request.input('pro_cog_inteligencia', sql.VarChar(60), pro_cog_inteligencia);
            request.input('pro_cog_apetito', sql.VarChar(20), pro_cog_apetito);
            request.input('pro_cog_sueño', sql.VarChar(20), pro_cog_sueño);
            request.input('re_nivel_inte', sql.VarChar(20), re_nivel_inte);
            request.input('re_coord_visomotriz', sql.VarChar(60), re_coord_visomotriz);
            request.input('re_nivel_memoria', sql.VarChar(20), re_nivel_memoria);
            request.input('re_personalidad', sql.VarChar(80), re_personalidad);
            request.input('re_afectividad', sql.VarChar(20), re_afectividad);
            request.input('con_area_cognitiva', sql.VarChar(sql.MAX), con_area_cognitiva);
            request.input('con_area_emocional', sql.VarChar(sql.MAX), con_area_emocional);
            request.input('tipresult_id', sql.Int, tipresult_id);
            request.input('detalleJsonpsicodet', sql.NVarChar(sql.MAX), detalleJsonparametros);
            request.input('mot_eva', sql.VarChar(100), mot_eva);
            request.input('tiem_lab', sql.VarChar(20), tiem_lab);
            request.input('prin_riesgos', sql.VarChar(200), prin_riesgos);
            request.input('med_seguridad', sql.VarChar(200), med_seguridad);
            request.input('detalleJsonant_empresas', sql.NVarChar(sql.MAX), detalleJstonant_empresas);
            request.input('historia_familiar', sql.VarChar(sql.MAX), historia_familiar);
            request.input('accid_enfer', sql.VarChar(sql.MAX), accid_enfer);
            request.input('habitos', sql.VarChar(sql.MAX), habitos);
            request.input('otras_observ', sql.VarChar(sql.MAX), otras_observ);
            request.input('conducta_sexual', sql.VarChar(150), conducta_sexual);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultpsicologia(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultPsicologia '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getpsicologiatest(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelTablaPsicologiaTest '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /**************** Audiometria ******************/
    async getequipos(req, res) {
        try {
            let { codpru_id, opc, equipos } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelEquiposForm '${codpru_id}','${equipos}','${opc}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postaudiometria(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, equi_id, tiem_exp_hrs, uso_pro_uditivo, apre_ruido, ante_relacionados, sintomas_actuales, otos_oido_derecho, otos_oido_izquierdo, logoaudiometria_oido_der, logoaudiometria_oido_izq, val_oido_derecho, val_oido_izquierdo, datains, doc_adic_id, datainsrec,ante_audio } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonante_relacionados = JSON.stringify(ante_relacionados);
            const detalleJsonsintomas_actuales = JSON.stringify(sintomas_actuales);
            const detalleJsonotos_oido_derecho = JSON.stringify(otos_oido_derecho);
            const detalleJsonotos_oido_izquierdo = JSON.stringify(otos_oido_izquierdo);
            const detalleJsonval_oido_derecho = JSON.stringify(val_oido_derecho);
            const detalleJsonval_oido_izquierdo = JSON.stringify(val_oido_izquierdo);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbAudiometria';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('equi_id', sql.Int, equi_id);
            request.input('tiem_exp_hrs', sql.Int, tiem_exp_hrs);
            request.input('uso_pro_uditivo', sql.VarChar(40), uso_pro_uditivo);
            request.input('apre_ruido', sql.VarChar(40), apre_ruido);
            request.input('ante_relacionados', sql.VarChar(sql.MAX), detalleJsonante_relacionados);
            request.input('sintomas_actuales', sql.VarChar(sql.MAX), detalleJsonsintomas_actuales);
            request.input('otos_oido_derecho', sql.VarChar(sql.MAX), detalleJsonotos_oido_derecho);
            request.input('otos_oido_izquierdo', sql.VarChar(sql.MAX), detalleJsonotos_oido_izquierdo);
            request.input('logoaudiometria_oido_der', sql.Char(2), logoaudiometria_oido_der);
            request.input('logoaudiometria_oido_izq', sql.Char(2), logoaudiometria_oido_izq);
            request.input('val_oido_derecho', sql.VarChar(sql.MAX), detalleJsonval_oido_derecho);
            request.input('val_oido_izquierdo', sql.VarChar(sql.MAX), detalleJsonval_oido_izquierdo);
			request.input('ante_audio', sql.VarChar(sql.MAX), ante_audio);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultaudiometria(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultAudiometria'${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*********************************************/
    /**************** Rayos X ******************/
    async getresultparametrosrayosx(req, res) {
        try {
            let { cita_id, nuncom, codpru_id } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelParametrosRayosX ${codpru_id},${nuncom}`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultrayosx(req, res) {
        try {
            let { nuncom, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultRayosX'${nuncom}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postrayosx(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, codigo_ref, det_informe, conclusion, datains, doc_adic_id, datainsrec } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbRayosX';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('codigo_ref', sql.VarChar(20), codigo_ref);
            request.input('det_informe', sql.VarChar(sql.MAX), det_informe);
            request.input('conclusion', sql.VarChar(sql.MAX), conclusion);

            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*********************************************/
    /**************** ficha 312 ******************/
    async getdatosPacienteFicha312(req, res) {
        try {
            let { cita_id } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelDatosPacienteFicha312 '${cita_id}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultfichamedicoocupacional312(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultfichamedicoocupacional312 '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async validarFicha312(req, res) {
        const { cita_id, nuncom } = req.query;
        const pool = await getConnection();
        const request = pool.request();
        const resultado = await request.query(`pa_SelValidarFicha312 '${cita_id}', '${nuncom}'`);
        res.json(resultado.recordset);
        pool.close();
    },
    async postfichamedicoocupacional312(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, AntecedentesOcupacionales, ap_alergias, ap_RAM, ap_asma, ap_HTA, ap_TBC, ap_diabetes, ap_bronquitis, ap_hepatitis, ap_neoplasia, ap_convulsiones,
                ap_ITS, ap_quemaduras, ap_intoxicaciones, ap_fiebre_tiroidea, ap_cirugias, ap_actividad_fisica, ap_patologia_renal, ap_neumonia, ap_pato_tiroides, ap_fracturas, ap_otros,
                HabitosNocivos, ant_padre, ant_madre, ant_hermanos, ant_esposa, num_hijos_vivos, num_hijos_fallecidos, ant_otros, Absentismo, ev_ananesis, ev_ectoscopia, ev_estado_mental, ExamenFisico,
                con_eva_psicologica, con_radiograficas, con_laboratorio, con_audiometria, con_espirometria, con_otros, Diagnosticos, Recomendaciones, restricciones, tipresult_id } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsonAntecedentes = JSON.stringify(AntecedentesOcupacionales);
            const detalleJsonHabitosNocivos = JSON.stringify(HabitosNocivos);
            const detalleJsonAbsentismo = JSON.stringify(Absentismo);
            const detalleJsonExamenFisico = JSON.stringify(ExamenFisico);
            const detalleJsonDiagnosticos = JSON.stringify(Diagnosticos);
            const detalleJsonRecomendaciones = JSON.stringify(Recomendaciones);
            const pool = await getConnection();
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbFichamedicoocupacional312';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('detalleJsonAntecedentes', sql.NVarChar(sql.MAX), detalleJsonAntecedentes);
            request.input('ap_alergias', sql.VarChar(100), ap_alergias);
            request.input('ap_RAM', sql.VarChar(100), ap_RAM);
            request.input('ap_asma', sql.VarChar(100), ap_asma);
            request.input('ap_HTA', sql.VarChar(100), ap_HTA);
            request.input('ap_TBC', sql.VarChar(100), ap_TBC);
            request.input('ap_diabetes', sql.VarChar(100), ap_diabetes);
            request.input('ap_bronquitis', sql.VarChar(100), ap_bronquitis);
            request.input('ap_hepatitis', sql.VarChar(100), ap_hepatitis);
            request.input('ap_neoplasia', sql.VarChar(100), ap_neoplasia);
            request.input('ap_convulsiones', sql.VarChar(100), ap_convulsiones);
            request.input('ap_ITS', sql.VarChar(100), ap_ITS);
            request.input('ap_quemaduras', sql.VarChar(100), ap_quemaduras);
            request.input('ap_intoxicaciones', sql.VarChar(100), ap_intoxicaciones);
            request.input('ap_fiebre_tiroidea', sql.VarChar(100), ap_fiebre_tiroidea);
            request.input('ap_cirugias', sql.VarChar(100), ap_cirugias);
            request.input('ap_actividad_fisica', sql.VarChar(100), ap_actividad_fisica);
            request.input('ap_patologia_renal', sql.VarChar(100), ap_patologia_renal);
            request.input('ap_neumonia', sql.VarChar(100), ap_neumonia);
            request.input('ap_pato_tiroides', sql.VarChar(100), ap_pato_tiroides);
            request.input('ap_fracturas', sql.VarChar(100), ap_fracturas);
            request.input('ap_otros', sql.VarChar(100), ap_otros);
            request.input('detalleJsonHabitosNocivos', sql.NVarChar(sql.MAX), detalleJsonHabitosNocivos);
            request.input('ant_padre', sql.VarChar(sql.MAX), ant_padre);
            request.input('ant_madre', sql.VarChar(sql.MAX), ant_madre);
            request.input('ant_hermanos', sql.VarChar(sql.MAX), ant_hermanos);
            request.input('ant_esposa', sql.VarChar(sql.MAX), ant_esposa);
            request.input('num_hijos_vivos', sql.Int, num_hijos_vivos);
            request.input('num_hijos_fallecidos', sql.Int, num_hijos_fallecidos);
            request.input('ant_otros', sql.VarChar(sql.MAX), ant_otros);
            request.input('detalleJsonAbsentismo', sql.NVarChar(sql.MAX), detalleJsonAbsentismo);
            request.input('ev_ananesis', sql.VarChar(sql.MAX), ev_ananesis);
            request.input('ev_ectoscopia', sql.VarChar(sql.MAX), ev_ectoscopia);
            request.input('ev_estado_mental', sql.VarChar(sql.MAX), ev_estado_mental);
            request.input('detalleJsonExamenFisico', sql.NVarChar(sql.MAX), detalleJsonExamenFisico);
            request.input('con_eva_psicologica', sql.VarChar(sql.MAX), con_eva_psicologica);
            request.input('con_radiograficas', sql.VarChar(sql.MAX), con_radiograficas);
            request.input('con_laboratorio', sql.VarChar(sql.MAX), con_laboratorio);
            request.input('con_audiometria', sql.VarChar(sql.MAX), con_audiometria);
            request.input('con_espirometria', sql.VarChar(sql.MAX), con_espirometria);
            request.input('con_otros', sql.VarChar(sql.MAX), con_otros);
            request.input('detalleJsonDiagnosticos', sql.NVarChar(sql.MAX), detalleJsonDiagnosticos);
            request.input('tipresult_id', sql.Int, tipresult_id);
            request.input('restricciones', sql.VarChar(sql.MAX), restricciones);
            request.input('detalleJsonRecomendaciones', sql.NVarChar(sql.MAX), detalleJsonRecomendaciones);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },

    async getimportarcie10(req, res) {
        try {
            let { cita_id } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelDiagnosticoFicha312 '${cita_id}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto' + error });
        }
    },
    async getimportarrecomendaciones(req, res) {
        try {
            let { cita_id } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelRecomendacionesFicha312 '${cita_id}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto' + error });
        }
    },

    async getnotificacionficha312(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelNotificaciones312 '${cita_id}', '${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto' + error });
        }
    },
    /**************** Procedimientos ******************/
    async getresultparametrosprocedimientos(req, res) {
        try {
            let { codpru_id, nuncom } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelParametrosProcedimientos'${codpru_id}','${nuncom}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultprocedimientos(req, res) {
        try {
            let { nuncom, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultProcedimientos'${nuncom}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postprocedimientos(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, codigo_ref, det_informe, conclusion, doc_adic_id, datains, datainsrec } = req.body;

            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);

            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbProcedimientos';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('codigo_ref', sql.VarChar(20), codigo_ref);
            request.input('det_informe', sql.VarChar(sql.MAX), det_informe);
            request.input('conclusion', sql.VarChar(sql.MAX), conclusion);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto' + error });
        }
    },
    async getdatosformatoprocedimientos(req, res) {
        try {

            let { nuncom } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelProcedimientos ${nuncom}`);
            let rutaArchivo, nombreArchivo;
            const dataJSON = result.recordset;
            if (dataJSON[0].nomarch !== 'N') {
                rutaArchivo = dataJSON[0].rutarch;
                nombreArchivo = dataJSON[0].nomarch;
            } else {
                rutaArchivo = 'N'
                nombreArchivo = 'N'
            }
            const resultado = {
                rutaArchivo: rutaArchivo,
                nombreArchivo: nombreArchivo,
            }
            res.json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /**************************************************/

    /******************Tamizaje dermatológico*********************/
    async getresulttamizajedermatologico(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultTamizajeDermatologico '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postpbtamizajedermatologico(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, datains, datainsrec, dataparametros } = req.body;
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const detalleJsonparametros = JSON.stringify(dataparametros);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbTamizajeDermatologico';

            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('detalleJsontamizajedermatologico', sql.NVarChar(sql.MAX), detalleJsonparametros);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*************************************************************/
    async getresultadofichas(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_Selllenarconclusiones'${cita_id}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getdatosformatosficha312(req, res) {
        try {

            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelExaFormatos ${cita_id},'${soexa}'`);
            let resultadoFinal = [];

            const htmlPath = `src/public/templates/${soexa}.html`;
            const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');

            for (const objresponse of result.recordset) {
                let paciente = JSON.parse(objresponse.paciente);
                let { appm_nom, numdoc, fecnac, Edad, des_sexo, destipcon, cargo_actual, razsoc, desexa, fechaAtencion, actividad_economica_clie, area_actual, desgrainst } = paciente[0];
                let cie10 = [];
                let recomendaciones = [];
                async function captureChartImage(data) {
                    const browser = await puppeteer.launch({ headless: 'shell' });

                    // Cargar la página que contiene los gráficos
                    const htmlPath = path.resolve('src/templates/003.html');
                    const htmlTemplate = await fs.readFile(htmlPath, 'utf-8');


                    const renderedHtml = mustache.render(htmlTemplate, data);
                    const page = await browser.newPage();
                    await page.setContent(renderedHtml);
                    // Esperar a que los gráficos se rendericen
                    await page.waitForSelector('#graf_OD');
                    await page.waitForSelector('#graf_OI');


                    // Seleccionar los gráficos
                    const graf_OD = await page.$('#graf_OD');
                    const graf_OI = await page.$('#graf_OI');
                    // Tomar una captura de pantalla de cada gráfico
                    const screenshot_OD = await graf_OD.screenshot();
                    const screenshot_OI = await graf_OI.screenshot();

                    const base64Image_OD = screenshot_OD.toString('base64');
                    const base64Image_OI = screenshot_OI.toString('base64');
                    // Cerrar el navegador
                    await browser.close();

                    // Devolver las imágenes base64
                    return { base64Image_OD, base64Image_OI };
                }
                if (soexa === '032') {
                    if (objresponse.resultado !== 'N') {
                        const dataJSON = JSON.parse(objresponse.resultado);
                        const { mot_eva, superf_id, tiem_lab, prin_riesgos, med_seguridad, historia_familiar, accid_enfer, habitos, otras_observ,
                            cod_present, cod_postura, dis_ritmo, dis_tono, dis_articulacion, ori_tiempo, ori_espacio, ori_persona, pro_cog_lucido_atento, pro_cog_pensamiento, pro_cog_percepcion,
                            pro_cog_memoria, pro_cog_inteligencia, pro_cog_apetito, pro_cog_sueño, re_nivel_inte, re_coord_visomotriz, re_nivel_memoria, re_personalidad, re_afectividad,
                            con_area_cognitiva, con_area_emocional, tipresult_id, conclusionesPsico, lugarNacimiento, lugarResidencia, diaAte, mesAte, anioAte,
                            conducta_sexual, recomendacionesInforme } = dataJSON[0];

                        let rutaArchivo = dataJSON[0].nomarch;
                        let Arrayant_empresas = [];
                        const antEmpresasJSON = JSON.parse(dataJSON[0].ant_empresas);

                        if (antEmpresasJSON && antEmpresasJSON.length > 0) {
                            antEmpresasJSON.forEach((objant_empresas) => {
                                let { fecha, nombemp, actiemp, puesto, tiempo, causaret } = objant_empresas;
                                Arrayant_empresas.push({ fecha, nombemp, actiemp, puesto, tiempo, causaret });
                            });
                        } else {
                            Arrayant_empresas.push({ fecha: '&nbsp;', nombemp: '&nbsp;', actiemp: '&nbsp;', puesto: '&nbsp;', tiempo: '&nbsp;', causaret: '&nbsp;' });
                        }
                        let = [cod_presentAde, cod_presentIna] = ['', ''];
                        if (cod_present === 'ADECUADO') {
                            cod_presentAde = 'X';
                        } else {
                            cod_presentIna = 'X';
                        }
                        let = [cod_posturaErg, cod_posturaEnc] = ['', ''];
                        if (cod_postura === 'ERGUIDA') {
                            cod_posturaErg = 'X';
                        } else {
                            cod_posturaEnc = 'X';
                        }
                        let = [dis_ritmoLent, dis_ritmoRap, dis_ritmoFlu] = ['', ''];
                        if (dis_ritmo === 'LENTO') {
                            dis_ritmoLent = 'X';
                        } else if (dis_ritmo === 'RAPIDO') {
                            dis_ritmoRap = 'X';
                        } else {
                            dis_ritmoFlu = 'X';
                        }
                        let = [dis_tonoBajo, dis_tonoMode, dis_tonoAlto] = ['', '', ''];
                        if (dis_tono === 'BAJO') {
                            dis_tonoBajo = 'X';
                        } else if (dis_tono === 'MODERADO') {
                            dis_tonoMode = 'X';
                        } else {
                            dis_tonoAlto = 'X';
                        }
                        let = [dis_articulacionConDif, dis_articulacionSinDis] = ['', ''];
                        if (dis_articulacion === 'CON DIFICULTAD') {
                            dis_articulacionConDif = 'X';
                        } else {
                            dis_articulacionSinDis = 'X';
                        }
                        let = [ori_tiempoOri, ori_tiempoDeso] = ['', ''];
                        if (ori_tiempo === 'ORIENTADO') {
                            ori_tiempoOri = 'X';
                        } else {
                            ori_tiempoDeso = 'X';
                        }
                        let = [ori_espacioOri, ori_espacioDeso] = ['', ''];
                        if (ori_espacio === 'ORIENTADO') {
                            ori_espacioOri = 'X';
                        } else {
                            ori_espacioDeso = 'X';
                        }
                        let = [ori_personaOri, ori_personaDeso] = ['', ''];
                        if (ori_persona === 'ORIENTADO') {
                            ori_personaOri = 'X';
                        } else {
                            ori_personaDeso = 'X';
                        }
                        let [pro_cog_memoriaCortPlazo, pro_cog_percepcionMediPlazo, pro_cog_percepcionLargPlazo] = ['', '', ''];
                        if (pro_cog_memoria === 'CORTO PLAZO') {
                            pro_cog_memoriaCortPlazo = 'X';
                        } else if (pro_cog_memoria === 'MEDIANO PLAZO') {
                            pro_cog_percepcionMediPlazo = 'X';
                        } else {
                            pro_cog_percepcionLargPlazo = 'X';
                        }
                        let [pro_cog_inteligenciaMuySup, pro_cog_inteligenciaSup, pro_cog_inteligenciaNorBri, pro_cog_inteligenciaNorPro, pro_cog_inteligenciaNorTor, pro_cog_inteligenciaFro,
                            pro_cog_inteligenciaRMLev, pro_cog_inteligenciaRMMod, pro_cog_inteligenciaRMSev, pro_cog_inteligenciaRMPro] = ['', '', '', '', '', '', '', '', '', ''];
                        if (pro_cog_inteligencia === 'MUY SUPERIOR') {
                            pro_cog_inteligenciaMuySup = 'X';
                        } else if (pro_cog_inteligencia === 'SUPERIOR') {
                            pro_cog_inteligenciaSup = 'X';
                        } else if (pro_cog_inteligencia === 'NORMAL BRILLANTE') {
                            pro_cog_inteligenciaNorBri = 'X';
                        } else if (pro_cog_inteligencia === 'NORMAL PROMEDIO') {
                            pro_cog_inteligenciaNorPro = 'X';
                        } else if (pro_cog_inteligencia === 'NORMAL TORPE') {
                            pro_cog_inteligenciaNorTor = 'X';
                        } else if (pro_cog_inteligencia === 'FRONTERIZO') {
                            pro_cog_inteligenciaFro = 'X';
                        } else if (pro_cog_inteligencia === 'RM LEVE') {
                            pro_cog_inteligenciaRMLev = 'X';
                        } else if (pro_cog_inteligencia === 'RM MODERADO') {
                            pro_cog_inteligenciaRMMod = 'X';
                        } else if (pro_cog_inteligencia === 'RM SEVERO') {
                            pro_cog_inteligenciaRMSev = 'X';
                        } else {
                            pro_cog_inteligenciaRMPro = 'X';
                        }
                        let [superNoEsp, superSuper, superConce, superSubsu, superSoca] = ['', '', '', '', ''];
                        if (superf_id === 1) {
                            superNoEsp = 'X';
                        } else if (superf_id === 2) {
                            superSuper = 'X';
                        } else if (superf_id === 3) {
                            superConce = 'X';
                        } else if (superf_id === 4) {
                            superSubsu = 'X';
                        } else if (superf_id === 5) {
                            superSoca = 'X';
                        }
                        let ArrayTest = [];
                        dataJSON.forEach((objTest) => {
                            if (objTest.desexadet.length > 0 && objTest.valor_test.length > 0) {
                                let { desexadet, valor_test } = objTest;
                                ArrayTest.push({ desexadet, valor_test });
                            } else {
                                ArrayTest.push({ desexadet: '&nbsp;', valor_test: '&nbsp;' });
                            }

                        });
                        let tipresult_idData = '';
                        if (tipresult_id === 1) {
                            tipresult_idData = 'APTO';
                        } else if (tipresult_id === 2) {
                            tipresult_idData = 'NO APTO';
                        } else if (tipresult_id === 3) {
                            tipresult_idData = 'Apto con Restricciones';
                        } else if (tipresult_id === 4) {
                            tipresult_idData = 'Con Observaciones';
                        } else if (tipresult_id === 5) {
                            tipresult_idData = 'Evaluado';
                        } else if (tipresult_id === 6) {
                            tipresult_idData = 'Pendiente';
                        }

                        if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                            dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                let { diacod, diades } = objdiagnosticos;
                                cie10.push({ diacod, diades });
                            });
                        } else {
                            cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                        }
                        if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                            dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                let { desrec, des_control } = objrecomendaciones;
                                recomendaciones.push({ desrec, des_control });
                            });
                        } else {
                            recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                        }
                        data = {
                            numdoc: numdoc,
                            appm_nom: appm_nom,
                            fecnac: fecnac,
                            Edad: Edad,
                            des_sexo: des_sexo,
                            cargo_actual: cargo_actual,
                            desexa: desexa,
                            fechaAtencion: fechaAtencion,
                            mot_eva: mot_eva,
                            razsoc: razsoc,
                            actividad_economica_clie: actividad_economica_clie,
                            area_actual: area_actual,
                            superNoEsp: superNoEsp,
                            superSuper: superSuper,
                            superConce: superConce,
                            superSubsu: superSubsu,
                            superSoca: superSoca,
                            tiem_lab: tiem_lab,
                            prin_riesgos: prin_riesgos,
                            med_seguridad: med_seguridad,
                            Arrayant_empresas: Arrayant_empresas,
                            historia_familiar: historia_familiar,
                            accid_enfer: accid_enfer,
                            habitos: habitos,
                            otras_observ: otras_observ,
                            cod_presentAde: cod_presentAde,
                            cod_presentIna: cod_presentIna,
                            cod_posturaErg: cod_posturaErg,
                            cod_posturaEnc: cod_posturaEnc,
                            dis_ritmoLent: dis_ritmoLent,
                            dis_ritmoRap: dis_ritmoRap,
                            dis_ritmoFlu: dis_ritmoFlu,
                            dis_tonoBajo: dis_tonoBajo,
                            dis_tonoMode: dis_tonoMode,
                            dis_tonoAlto: dis_tonoAlto,
                            dis_articulacionConDif: dis_articulacionConDif,
                            dis_articulacionSinDis: dis_articulacionSinDis,
                            ori_tiempoOri: ori_tiempoOri,
                            ori_tiempoDeso: ori_tiempoDeso,
                            ori_espacioOri: ori_espacioOri,
                            ori_espacioDeso: ori_espacioDeso,
                            ori_personaOri: ori_personaOri,
                            ori_personaDeso: ori_personaDeso,
                            pro_cog_lucido_atento: pro_cog_lucido_atento,
                            pro_cog_pensamiento: pro_cog_pensamiento,
                            pro_cog_percepcion: pro_cog_percepcion,
                            pro_cog_memoriaCortPlazo: pro_cog_memoriaCortPlazo,
                            pro_cog_percepcionMediPlazo: pro_cog_percepcionMediPlazo,
                            pro_cog_percepcionLargPlazo: pro_cog_percepcionLargPlazo,
                            pro_cog_inteligenciaMuySup: pro_cog_inteligenciaMuySup,
                            pro_cog_inteligenciaSup: pro_cog_inteligenciaSup,
                            pro_cog_inteligenciaNorBri: pro_cog_inteligenciaNorBri,
                            pro_cog_inteligenciaNorPro: pro_cog_inteligenciaNorPro,
                            pro_cog_inteligenciaNorTor: pro_cog_inteligenciaNorTor,
                            pro_cog_inteligenciaFro: pro_cog_inteligenciaFro,
                            pro_cog_inteligenciaRMLev: pro_cog_inteligenciaRMLev,
                            pro_cog_inteligenciaRMMod: pro_cog_inteligenciaRMMod,
                            pro_cog_inteligenciaRMSev: pro_cog_inteligenciaRMSev,
                            pro_cog_inteligenciaRMPro: pro_cog_inteligenciaRMPro,
                            pro_cog_apetito: pro_cog_apetito,
                            pro_cog_sueño: pro_cog_sueño,
                            re_nivel_inte: re_nivel_inte,
                            re_coord_visomotriz: re_coord_visomotriz,
                            re_nivel_memoria: re_nivel_memoria,
                            re_personalidad: re_personalidad,
                            re_afectividad: re_afectividad,
                            con_area_cognitiva: con_area_cognitiva,
                            con_area_emocional: con_area_emocional,
                            ArrayTest: ArrayTest,
                            tipresult_idData: tipresult_idData,
                            conclusionesPsico: conclusionesPsico,
                            desgrainst: desgrainst,
                            lugarNacimiento: lugarNacimiento,
                            lugarResidencia: lugarResidencia,
                            diaAte: diaAte,
                            mesAte: mesAte,
                            anioAte: anioAte,
                            conducta_sexual: conducta_sexual,
                            recomendacionesInforme: recomendacionesInforme,
                            cie10: cie10,
                            recomendaciones: recomendaciones,
                        };
                        renderedHtml = mustache.render(htmlTemplate, data);
                        dataFinal = {
                            renderedHtml: renderedHtml,
                            rutaArchivo: rutaArchivo
                        }
                        resultadoFinal.push(dataFinal);
                    } else {
                        rutaArchivo = 'S/N' //significa que no a grabado ningun resultado del examen
                        renderedHtml = 'No se ha registrado resultados para este examen';
                    }
                }
                if (soexa === '009') {
                    if (objresponse.resultado !== 'N') {
                        const dataJSON = JSON.parse(objresponse.resultado);
                        let rutaArchivo = dataJSON[0].nomarch;
                        let ArrayLaboratorio = [];
                        dataJSON.forEach((objLaboratorio) => {
                            let { analisis, metodo, result, unid, valref } = objLaboratorio;
                            ArrayLaboratorio.push({ analisis, metodo, result, unid, valref });
                        });

                        if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                            dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                let { diacod, diades } = objdiagnosticos;
                                cie10.push({ diacod, diades });
                            });
                        } else {
                            cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                        }
                        if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                            dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                let { desrec, des_control } = objrecomendaciones;
                                recomendaciones.push({ desrec, des_control });
                            });
                        } else {
                            recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                        }
                        data = {
                            numdoc: numdoc,
                            appm_nom: appm_nom,
                            fecnac: fecnac,
                            Edad: Edad,
                            des_sexo: des_sexo,
                            cargo_actual: cargo_actual,
                            destipcon: destipcon,
                            razsoc: razsoc,
                            cie10: cie10,
                            desexa: desexa,
                            recomendaciones: recomendaciones,
                            ArrayLaboratorio: ArrayLaboratorio
                        };
                        renderedHtml = mustache.render(htmlTemplate, data);
                        dataFinal = {
                            renderedHtml: renderedHtml,
                            rutaArchivo: rutaArchivo
                        }
                        resultadoFinal.push(dataFinal);
                    } else {
                        rutaArchivo = 'S/N'
                        renderedHtml = 'No se ha registrado resultados para este examen';
                    }
                }
                if (soexa === '005') {
                    if (objresponse.resultado !== 'N') {
                        const dataJSON = JSON.parse(objresponse.resultado);
                        let rutaArchivo = dataJSON[0].nomarch;
                        dataJSON.forEach(obj => {
                            if (obj.valor_ref === 0) {
                                obj.valor_ref = '';
                            }
                            if (obj.mejor_valor === 0) {
                                obj.mejor_valor = '';
                            }
                            if (obj.Mejor_val_porc === 0) {
                                obj.Mejor_val_porc = '';
                            }
                            if (obj.valor_pre1 === 0) {
                                obj.valor_pre1 = '';
                            }
                            if (obj.valor_pre2 === 0) {
                                obj.valor_pre2 = '';
                            }
                            if (obj.valor_pre3 === 0) {
                                obj.valor_pre3 = '';
                            }
                        });
                        const { antecedenteMed, Calidad, conclusion, std_fuma, fecaten } = dataJSON[0];
                        if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                            dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                let { desrec, des_control } = objrecomendaciones;
                                recomendaciones.push({ desrec, des_control });
                            });
                        }
                        data = {
                            numdoc: numdoc,
                            appm_nom: appm_nom,
                            fecnac: fecnac,
                            Edad: Edad,
                            des_sexo: des_sexo,
                            cargo_actual: cargo_actual,
                            razsoc: razsoc,
                            destipcon: destipcon,
                            antecedenteMed: antecedenteMed,
                            Calidad: Calidad,
                            conclusion: conclusion,
                            std_fuma: std_fuma,
                            fecaten: fecaten,
                            recomendaciones: recomendaciones,
                            rows: dataJSON
                        };
                        renderedHtml = mustache.render(htmlTemplate, data);
                        dataFinal = {
                            renderedHtml: renderedHtml,
                            rutaArchivo: rutaArchivo
                        }
                        resultadoFinal.push(dataFinal);
                    } else {
                        rutaArchivo = 'S/N'
                        renderedHtml = 'No se ha registrado resultados para este examen';
                    }
                }
                if (soexa === '003') {
                    if (objresponse.resultado !== 'N') {
                        const dataJSON = JSON.parse(objresponse.resultado);
                        let rutaArchivo = dataJSON[0].nomarch;
                        const { tiem_exp_hrs, apre_ruido, desequi, fecaten, logoaudiometria_oido_der,
                            logoaudiometria_oido_izq, marca, modelo, feccali, fecing_empresa, uso_pro_uditivo,ante_audio } = dataJSON[0];

                        const ante_relacionadoArray = obtenerArray(dataJSON, "ante_relacionados");
                        const sintomas_actualesArray = obtenerArray(dataJSON, "sintomas_actuales");
                        const otos_oido_derechoArray = obtenerArray(dataJSON, "otos_oido_derecho");
                        const otos_oido_izquierdoArray = obtenerArray(dataJSON, "otos_oido_izquierdo");


                        const val_oido_derechoArray = obtenerArray(dataJSON, "val_oido_derecho");
                        //Se renomba los numeros a una variable compatible
                        const { '125': VA_D_125, '250': VA_D_250, '500': VA_D_500, '1000': VA_D_1000, '2000': VA_D_2000, '3000': VA_D_3000, '4000': VA_D_4000, '6000': VA_D_6000, '8000': VA_D_8000 } = val_oido_derechoArray[0];
                        const { '125': VO_D_125, '250': VO_D_250, '500': VO_D_500, '1000': VO_D_1000, '2000': VO_D_2000, '3000': VO_D_3000, '4000': VO_D_4000, '6000': VO_D_6000, '8000': VO_D_8000 } = val_oido_derechoArray[1];

                        const val_oido_izquierdoArray = obtenerArray(dataJSON, "val_oido_izquierdo");
                        //Se renomba los numeros a una variable compatible
                        const { '125': VA_E_125, '250': VA_E_250, '500': VA_E_500, '1000': VA_E_1000, '2000': VA_E_2000, '3000': VA_E_3000, '4000': VA_E_4000, '6000': VA_E_6000, '8000': VA_E_8000 } = val_oido_izquierdoArray[0];
                        const { '125': VO_E_125, '250': VO_E_250, '500': VO_E_500, '1000': VO_E_1000, '2000': VO_E_2000, '3000': VO_E_3000, '4000': VO_E_4000, '6000': VO_E_6000, '8000': VO_E_8000 } = val_oido_izquierdoArray[1];

                        let [logoaudiometriaDer, logoaudiometriaIzq] = ['', ''];
                        if (logoaudiometria_oido_der !== 'N') {
                            logoaudiometriaDer = 'APLICA';
                        } else {
                            logoaudiometriaDer = 'NO APLICA'
                        }
                        if (logoaudiometria_oido_izq !== 'N') {
                            logoaudiometriaIzq = 'APLICA';
                        } else {
                            logoaudiometriaIzq = 'NO APLICA';
                        }


                        if (dataJSON[0].diagnosticos && dataJSON[0].diagnosticos.length > 0) {
                            dataJSON[0].diagnosticos.forEach((objdiagnosticos) => {
                                let { diacod, diades } = objdiagnosticos;
                                cie10.push({ diacod, diades });
                            });
                        } else {
                            cie10.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                        }
                        if (dataJSON[0].recomendaciones && dataJSON[0].recomendaciones.length > 0) {
                            dataJSON[0].recomendaciones.forEach((objrecomendaciones) => {
                                let { desrec, des_control } = objrecomendaciones;
                                recomendaciones.push({ desrec, des_control });
                            });
                        } else {
                            recomendaciones.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                        }
                        data = {
                            desexa: desexa,
                            numdoc: numdoc,
                            appm_nom: appm_nom,
                            fecnac: fecnac,
                            Edad: Edad,
                            des_sexo: des_sexo,
                            cargo_actual: cargo_actual,
                            destipcon: destipcon,
                            razsoc: razsoc,
                            tiem_exp_hrs: tiem_exp_hrs,
                            apre_ruido: apre_ruido,
                            desequi: desequi,
                            fecaten: fecaten,
                            fecing_empresa: fecing_empresa,
                            logoaudiometriaDer: logoaudiometriaDer,
                            logoaudiometriaIzq: logoaudiometriaIzq,
                            marca: marca,
                            modelo: modelo,
                            feccali: feccali,
                            uso_pro_uditivo: uso_pro_uditivo,
							ante_audio:ante_audio,
                            cie10: cie10,
                            recomendaciones: recomendaciones,
                            rows: dataJSON,
                            ante_relacionadoArray: ante_relacionadoArray,
                            sintomas_actualesArray: sintomas_actualesArray,
                            otos_oido_derechoArray: otos_oido_derechoArray,
                            otos_oido_izquierdoArray: otos_oido_izquierdoArray,
                            VA_D_125: VA_D_125, VA_D_250: VA_D_250, VA_D_500: VA_D_500, VA_D_1000: VA_D_1000, VA_D_2000: VA_D_2000,
                            VA_D_3000: VA_D_3000, VA_D_4000: VA_D_4000, VA_D_6000: VA_D_6000, VA_D_8000: VA_D_8000,

                            VO_D_125: VO_D_125, VO_D_250: VO_D_250, VO_D_500: VO_D_500, VO_D_1000: VO_D_1000, VO_D_2000: VO_D_2000,
                            VO_D_3000: VO_D_3000, VO_D_4000: VO_D_4000, VO_D_6000: VO_D_6000, VO_D_8000: VO_D_8000,

                            VA_E_125: VA_E_125, VA_E_250: VA_E_250, VA_E_500: VA_E_500, VA_E_1000: VA_E_1000, VA_E_2000: VA_E_2000,
                            VA_E_3000: VA_E_3000, VA_E_4000: VA_E_4000, VA_E_6000: VA_E_6000, VA_E_8000: VA_E_8000,

                            VO_E_125: VO_E_125, VO_E_250: VO_E_250, VO_E_500: VO_E_500, VO_E_1000: VO_E_1000, VO_E_2000: VO_E_2000,
                            VO_E_3000: VO_E_3000, VO_E_4000: VO_E_4000, VO_E_6000: VO_E_6000, VO_E_8000: VO_E_8000
                        };

                        let resultado = await captureChartImage(data);
                        let base64Image_OD = resultado.base64Image_OD;
                        let base64Image_OI = resultado.base64Image_OI;
                        let base64GrafiosAudio = { base64Image_OD, base64Image_OI };

                        renderedHtml = mustache.render(htmlTemplate, data);
                        dataFinal = {
                            renderedHtml: renderedHtml,
                            rutaArchivo: rutaArchivo,
                            base64GrafiosAudio: base64GrafiosAudio
                        }
                        resultadoFinal.push(dataFinal);
                    } else {
                        rutaArchivo = 'S/N'
                        renderedHtml = 'No se ha registrado resultados para este examen';
                    }
                }
                if (soexa === '013') {
                    if (objresponse.resultado !== '[{}]') {
                        const dataJSON = JSON.parse(objresponse.resultado);
                        const resultadoArray = JSON.parse(dataJSON[0].resultado);
                        for (const obj of resultadoArray) {
                            let cie10Img = [];
                            let recomendacionesImg = [];
                            let rutaArchivo = obj.nomarch;

                            let [conclusion, det_informe, codigo_ref, desexadet] =
                                [obj.conclusion, obj.det_informe, obj.codigo_ref, obj.desexadet];
                            if (obj.diagnosticos && obj.diagnosticos.length > 0) {
                                obj.diagnosticos.forEach((objdiagnosticos) => {
                                    let { diacod, diades } = objdiagnosticos;
                                    cie10Img.push({ diacod, diades });
                                });
                            } else {
                                cie10Img.push({ diacod: '&nbsp;', diades: '&nbsp;' });
                            }
                            if (obj.recomendaciones && obj.recomendaciones.length > 0) {
                                obj.recomendaciones.forEach((objrecomendaciones) => {
                                    let { desrec, des_control } = objrecomendaciones;
                                    recomendacionesImg.push({ desrec, des_control });
                                });
                            } else {
                                recomendacionesImg.push({ desrec: '&nbsp;', des_control: '&nbsp;' });
                            }
                            data = {
                                numdoc: numdoc,
                                appm_nom: appm_nom,
                                razsoc: razsoc,
                                fecnac: fecnac,
                                Edad: Edad,
                                des_sexo: des_sexo,
                                cargo_actual: cargo_actual,
                                area_actual: area_actual,
                                fechaAtencion: fechaAtencion,
                                codigo_ref: codigo_ref,
                                det_informe: det_informe,
                                conclusion: conclusion,
                                cie10Img: cie10Img,
                                recomendacionesImg: recomendacionesImg,
                                desexadet: desexadet,
                                rutaArchivo: rutaArchivo,
                            };
                            renderedHtml = mustache.render(htmlTemplate, data);
                            dataFinal = {
                                renderedHtml: renderedHtml,
                                rutaArchivo: rutaArchivo
                            }
                            resultadoFinal.push(dataFinal);
                        }
                    } else {
                        rutaArchivo = 'S/N';
                        renderedHtml = 'No se ha registrado resultados para este examen';
                    }
                }
            }
            res.json(resultadoFinal);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*********************************************/
    /*************** Formato Salud Ocupacional *****************/
    async getresultformatosaludocupacional(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelExaFormatos'${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*************** Oftamologia *****************/
    async getoftalmologiatest(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelTablaOftalmologiaTest '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async postoftalmologia(req, res) {
        try {
            const { cita_id, nuncom, soexa, codpru_id, doc_adic_id, usa_lentes,
                ultima_act, agudeza_visual, Refraccion, oftalmologiaTest,
                Reconoce_colores, hallazgos, antecedentes, datains, datainsrec, conclusion } = req.body;
            const detalleJsonagudeza_visual = JSON.stringify(agudeza_visual);
            const detalleJsonoftalmologiaTest = JSON.stringify(oftalmologiaTest);
            const detalleJsonRefraccion = JSON.stringify(Refraccion);
            const usenam = req.user.usuario;
            const hostname = '';
            const codrol = req.user.codrol;
            const med_id = req.user.med_id;
            const detalleJsoncie10 = JSON.stringify(datains);
            const detalleJsonrecomen = JSON.stringify(datainsrec);
            const pool = await getConnection();
            var resultado = await actualizarRutas(pool, doc_adic_id);
            if (resultado === 'success') {
                console.log('ok');
            } else {
                console.log('error');
            }
            const request = pool.request();
            const PROCEDURE_NAME = 'pa_InsPbOftalmologia';
            request.input('cita_id', sql.Int, cita_id);
            request.input('nuncom', sql.Int, nuncom);
            request.input('soexa', sql.VarChar(6), soexa);
            request.input('codpru_id', sql.Int, codpru_id);
            request.input('med_id', sql.Int, med_id);
            request.input('doc_adic_id', sql.Int, doc_adic_id);
            request.input('usenam', sql.VarChar(30), usenam);
            request.input('hostname', sql.VarChar(20), hostname);
            request.input('codrol', sql.Int, codrol);
            request.input('usa_lentes', sql.Char(1), usa_lentes);
            request.input('ultima_act', sql.VarChar(20), ultima_act);
            request.input('agudeza_visual', sql.NVARCHAR(sql.MAX), detalleJsonagudeza_visual);
            request.input('Refraccion', sql.VarChar(sql.MAX), detalleJsonRefraccion);
            request.input('detalleJsonoftadet', sql.NVARCHAR(sql.MAX), detalleJsonoftalmologiaTest);
            request.input('Reconoce_colores', sql.Char(1), Reconoce_colores);
            request.input('hallazgos', sql.NVARCHAR(sql.MAX), hallazgos);
            request.input('antecedentes', sql.NVARCHAR(sql.MAX), antecedentes);
            request.input('detalleJsoncie10', sql.NVarChar(sql.MAX), detalleJsoncie10);
            request.input('detalleJsonrecomen', sql.NVarChar(sql.MAX), detalleJsonrecomen);
            request.input('conclusion', sql.VarChar(sql.MAX), conclusion);
            const result = await request.execute(PROCEDURE_NAME);
            pool.close();
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    async getresultoftalmologia(req, res) {
        try {
            let { cita_id, soexa } = req.query;
            const pool = await getConnection();
            const result = await pool.query(`pa_SelResultOftalmologia '${cita_id}','${soexa}'`);
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: 'Incorrecto ' + error });
        }
    },
    /*********************************************/
};