$(document).ready(function () {
    poblarcampos();
    Notificaciones312();
});
function poblarInfo() {
    let cita_id = document.getElementById('id').value;
    let Nroficha = document.getElementById('Nroficha');
    let fechaficha = document.getElementById('fechaficha');
    let preocuficha = document.getElementById('preocuficha');
    let periodicaficha = document.getElementById('periodicaficha');
    let retiroficha = document.getElementById('retiroficha');
    let otrosficha = document.getElementById('otrosficha');
    let puestraficha = document.getElementById('puestraficha');
    let artraficha = document.getElementById('artraficha');
    let razemp = document.getElementById('razemp');
    let actecoemp = document.getElementById('actecoemp');
    let trabjemp = document.getElementById('trabjemp');
    let depaemp = document.getElementById('depaemp');
    let provemp = document.getElementById('provemp');
    let distemp = document.getElementById('distemp');
    let puespostemp = document.getElementById('puespostemp');
    let nombapefiltra = document.getElementById('nombapefiltra');
    let diafiltra = document.getElementById('diafiltra');
    let mesfiltra = document.getElementById('mesfiltra');
    let añofiltra = document.getElementById('añofiltra');
    let edadfiltra = document.getElementById('edadfiltra');
    let dnifiltra = document.getElementById('dnifiltra');
    let dirfiltra = document.getElementById('dirfiltra');
    let numfiltra = document.getElementById('numfiltra');
    let distfiltra = document.getElementById('distfiltra');
    let provfiltra = document.getElementById('provfiltra');
    let depafiltra = document.getElementById('depafiltra');
    let sifiltra = document.getElementById('sifiltra');
    let nofiltra = document.getElementById('nofiltra');
    let trfiltra = document.getElementById('trfiltra');
    let essaludfiltra = document.getElementById('essaludfiltra');
    let epsfiltra = document.getElementById('epsfiltra');
    let otrofiltra = document.getElementById('otrofiltra');
    let mailfiltra = document.getElementById('mailfiltra');
    let telfiltra = document.getElementById('telfiltra');
    let celfiltra = document.getElementById('celfiltra');
    let escivfiltra = document.getElementById('escivfiltra');
    let grinsfiltra = document.getElementById('grinsfiltra');
    let hvfiltra = document.getElementById('hvfiltra');
    let depfiltra = document.getElementById('depfiltra');
    $.ajax({
        url: '/datosPacienteFicha312',
        method: "GET",
        data: {
            cita_id: cita_id
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                Nroficha.textContent = '';
                fechaficha.textContent = result[0].fecprocita;
                if (result[0].desexa === 'PRE OCUPACIONAL') {
                    preocuficha.textContent = 'X';
                } else if (result[0].desexa === 'PERIODICO') {
                    periodicaficha.textContent = 'X';
                } else if (result[0].desexa === 'RETIRO') {
                    retiroficha.textContent = 'X';
                } else {
                    otrosficha.textContent = result[0].desexa;
                }
                puestraficha.textContent = result[0].cargo_actual;
                artraficha.textContent = result[0].area_actual;
                razemp.textContent = result[0].razsoc;
                actecoemp.textContent = result[0].actividad_economica;
                trabjemp.textContent = result[0].Direccion;
                depaemp.textContent = result[0].cldistrito;
                provemp.textContent = result[0].clprovincia;
                distemp.textContent = result[0].cldepartamento;
                puespostemp.textContent = result[0].clpuesto;
                nombapefiltra.textContent = result[0].appm_nom;
                diafiltra.textContent = result[0].fecnacDia;
                mesfiltra.textContent = result[0].fecnacMes;
                añofiltra.textContent = result[0].fecnacAnio;
                edadfiltra.textContent = result[0].Edad;
                dnifiltra.textContent = result[0].Dni;
                dirfiltra.textContent = result[0].dirdes;
                numfiltra.textContent = result[0].dirnum;
                distfiltra.textContent = result[0].distrito;
                provfiltra.textContent = result[0].provincia;
                depafiltra.textContent = result[0].departamento;
                if (result[0].res_lugar_trabajo === 'SI') {
                    sifiltra.textContent = 'X';
                } else {
                    nofiltra.textContent = 'X';
                }
                trfiltra.textContent = result[0].res_lugar_trabajo_des;
                if (result[0].destipseg === 'ESSALUD') {
                    essaludfiltra.textContent = 'X'
                } else if (result[0].destipseg === 'EPS') {
                    epsfiltra.textContent = 'X'
                } else {
                    otrofiltra.textContent = result[0].destipseg
                }
                mailfiltra.textContent = result[0].correo;
                telfiltra.textContent = result[0].telefono;
                celfiltra.textContent = result[0].celular;
                escivfiltra.textContent = result[0].desestciv;
                grinsfiltra.textContent = result[0].desgrainst;
                hvfiltra.textContent = result[0].numhijos;
                depfiltra.textContent = result[0].numdep;
            }
        },
        error: function (Examenes) {
            console.log('error: ' + Examenes)
        }
    });


}
function poblarcampos() {
    poblarInfo();
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let nuncom = document.getElementById('nuncom');
    let ap_alergias = document.getElementById('alerantpato');
    let ap_RAM = document.getElementById('ramantpato');
    let ap_asma = document.getElementById('asmaantpato');
    let ap_HTA = document.getElementById('htaantpato');
    let ap_TBC = document.getElementById('tbcantpato');
    let ap_diabetes = document.getElementById('diabeantpato');
    let ap_bronquitis = document.getElementById('bronqantpato');
    let ap_hepatitis = document.getElementById('hepaantpato');
    let ap_neoplasia = document.getElementById('neoantpato');
    let ap_convulsiones = document.getElementById('convantpato');
    let ap_ITS = document.getElementById('itsantpato');
    let ap_quemaduras = document.getElementById('quemantpato');
    let ap_intoxicaciones = document.getElementById('intoxantpato');
    let ap_fiebre_tiroidea = document.getElementById('fitiantpato');
    let ap_cirugias = document.getElementById('cirantpato');
    let ap_actividad_fisica = document.getElementById('acfiantpato');
    let ap_patologia_renal = document.getElementById('pareantpato');
    let ap_neumonia = document.getElementById('neuantpato');
    let ap_pato_tiroides = document.getElementById('patiantpato');
    let ap_fracturas = document.getElementById('fracantpato');
    let ap_otros = document.getElementById('otrosantpato');
    let ant_padre = document.getElementById('padreantoatofam');
    let ant_madre = document.getElementById('madreantoatofam');
    let ant_hermanos = document.getElementById('hermantoatofam');
    let ant_esposa = document.getElementById('espantoatofam');
    let num_hijos_vivos = document.getElementById('hvantoatofam');
    let num_hijos_fallecidos = document.getElementById('hfantoatofam');
    let ant_otros = document.getElementById('otrosantoatofam');
    let ev_ananesis = document.getElementById('anamevamed');
    let ev_ectoscopia = document.getElementById('ectoevamed');
    let ev_estado_mental = document.getElementById('esmeevamed');
    let con_eva_psicologica = document.getElementById('conevapsico');
    let con_radiograficas = document.getElementById('conradio');
    let con_laboratorio = document.getElementById('hallpatolab');
    let con_audiometria = document.getElementById('conaudio');
    let con_espirometria = document.getElementById('conespiro');
    let con_otros = document.getElementById('concluotros');
    let Apto = document.getElementById("Apto");
    let AptoRestricciones = document.getElementById("AptoRestricciones");
    let NoApto = document.getElementById("NoApto");
    let ConObservaciones = document.getElementById("ConObservaciones");
    let Evaluado = document.getElementById("Evaluado");
    let Pendiente = document.getElementById("Pendiente");
    let restricciones = $('#restricciones');

    let empantocu1 = document.getElementById('empantocu1');
    let areaantocu1 = document.getElementById('areaantocu1');
    let ocupantocu1 = document.getElementById('ocupantocu1');
    let inicioantocu1 = document.getElementById('inicioantocu1');
    let finantocu1 = document.getElementById('finantocu1');
    let tiempoocu1 = document.getElementById('tiempoocu1');
    let peliantocu1 = document.getElementById('peliantocu1');
    let eqprantocu1 = document.getElementById('eqprantocu1');

    let empantocu2 = document.getElementById('empantocu2');
    let areaantocu2 = document.getElementById('areaantocu2');
    let ocupantocu2 = document.getElementById('ocupantocu2');
    let inicioantocu2 = document.getElementById('inicioantocu2');
    let finantocu2 = document.getElementById('finantocu2');
    let tiempoocu2 = document.getElementById('tiempoocu2');
    let peliantocu2 = document.getElementById('peliantocu2');
    let eqprantocu2 = document.getElementById('eqprantocu2');

    let empantocu3 = document.getElementById('empantocu3');
    let areaantocu3 = document.getElementById('areaantocu3');
    let ocupantocu3 = document.getElementById('ocupantocu3');
    let inicioantocu3 = document.getElementById('inicioantocu3');
    let finantocu3 = document.getElementById('finantocu3');
    let tiempoocu3 = document.getElementById('tiempoocu3');
    let peliantocu3 = document.getElementById('peliantocu3');
    let eqprantocu3 = document.getElementById('eqprantocu3');

    let altipoantpato = document.getElementById('altipoantpato');
    let alcantantpato = document.getElementById('alcantantpato');
    let alfrecantpato = document.getElementById('alfrecantpato');

    let tatipoantpato = document.getElementById('tatipoantpato');
    let tacantantpato = document.getElementById('tacantantpato');
    let tafrecantpato = document.getElementById('tafrecantpato');

    let drtipoantpato = document.getElementById('drtipoantpato');
    let drcantantpato = document.getElementById('drcantantpato');
    let drfrecantpato = document.getElementById('drfrecantpato');

    let mdtipoantpato = document.getElementById('mdtipoantpato');
    let mdcantantpato = document.getElementById('mdcantantpato');
    let mdfrecantpato = document.getElementById('mdfrecantpato');

    let enfantoatofam1 = document.getElementById('enfantoatofam1');
    let siantoatofam1 = document.getElementById('siantoatofam1');
    let noantoatofam1 = document.getElementById('noantoatofam1');
    let añoantoatofam1 = document.getElementById('añoantoatofam1');
    let desantoatofam1 = document.getElementById('desantoatofam1');

    let enfantoatofam2 = document.getElementById('enfantoatofam2');
    let siantoatofam2 = document.getElementById('siantoatofam2');
    let noantoatofam2 = document.getElementById('noantoatofam2');
    let añoantoatofam2 = document.getElementById('añoantoatofam2');
    let desantoatofam2 = document.getElementById('desantoatofam2');

    let enfantoatofam3 = document.getElementById('enfantoatofam3');
    let siantoatofam3 = document.getElementById('siantoatofam3');
    let noantoatofam3 = document.getElementById('noantoatofam3');
    let añoantoatofam3 = document.getElementById('añoantoatofam3');
    let desantoatofam3 = document.getElementById('desantoatofam3');

    let pielsinhevamed = document.getElementById('pielsinhevamed');
    let pielconhevamed = document.getElementById('pielconhevamed');
    let cabesinhevamed = document.getElementById('cabesinhevamed');
    let cabeconhevamed = document.getElementById('cabeconhevamed');
    let ojansinhevamed = document.getElementById('ojansinhevamed');
    let ojanconhevamed = document.getElementById('ojanconhevamed');
    let oidossinhevamed = document.getElementById('oidossinhevamed');
    let oidosconhevamed = document.getElementById('oidosconhevamed');
    let narizsinhevamed = document.getElementById('narizsinhevamed');
    let narizconhevamed = document.getElementById('narizconhevamed');
    let bocasinhevamed = document.getElementById('bocasinhevamed');
    let bocaconhevamed = document.getElementById('bocaconhevamed');
    let faringesinhevamed = document.getElementById('faringesinhevamed');
    let faringeconhevamed = document.getElementById('faringeconhevamed');
    let cuellosinhevamed = document.getElementById('cuellosinhevamed');
    let cuelloconhevamed = document.getElementById('cuelloconhevamed');
    let arsinhevamed = document.getElementById('arsinhevamed');
    let arconhevamed = document.getElementById('arconhevamed');
    let acsinhevamed = document.getElementById('acsinhevamed');
    let acconhevamed = document.getElementById('acconhevamed');
    let adsinhevamed = document.getElementById('adsinhevamed');
    let adconhevamed = document.getElementById('adconhevamed');
    let agsinhevamed = document.getElementById('agsinhevamed');
    let agconhevamed = document.getElementById('agconhevamed');
    let alsinhevamed = document.getElementById('alsinhevamed');
    let alconhevamed = document.getElementById('alconhevamed');
    let marchasinhevamed = document.getElementById('marchasinhevamed');
    let marchaconhevamed = document.getElementById('marchaconhevamed');
    let columsinhevamed = document.getElementById('columsinhevamed');
    let columconhevamed = document.getElementById('columconhevamed');
    let mssinhevamed = document.getElementById('mssinhevamed');
    let msconhevamed = document.getElementById('msconhevamed');
    let misinhevamed = document.getElementById('misinhevamed');
    let miconhevamed = document.getElementById('miconhevamed');
    let slsinhevamed = document.getElementById('slsinhevamed');
    let slconhevamed = document.getElementById('slconhevamed');
    let snsinhevamed = document.getElementById('snsinhevamed');
    let snconhevamed = document.getElementById('snconhevamed');

    let talla312 = document.getElementById('talla312');
    let peso312 = document.getElementById('peso312');
    let IMC312 = document.getElementById('IMC312');
    let Per_abdo312 = document.getElementById('Per_abdo312');
    let FR312 = document.getElementById('FR312');
    let FC312 = document.getElementById('FC312');
    let PA312 = document.getElementById('PA312');
    let Per_Cadera312 = document.getElementById('Per_Cadera312');
    let Temp312 = document.getElementById('Temp312');
    let ICC312 = document.getElementById('ICC312');


    $.ajax({
        url: '/resultfichamedicoocupacional312',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                ap_alergias.value = result[0].ap_alergias;
                ap_RAM.value = result[0].ap_RAM;
                ap_asma.value = result[0].ap_asma;
                ap_HTA.value = result[0].ap_HTA;
                ap_TBC.value = result[0].ap_TBC;
                ap_diabetes.value = result[0].ap_diabetes;
                ap_bronquitis.value = result[0].ap_bronquitis;
                ap_hepatitis.value = result[0].ap_hepatitis;
                ap_neoplasia.value = result[0].ap_neoplasia;
                ap_convulsiones.value = result[0].ap_convulsiones;
                ap_ITS.value = result[0].ap_ITS;
                ap_quemaduras.value = result[0].ap_quemaduras;
                ap_intoxicaciones.value = result[0].ap_intoxicaciones;
                ap_fiebre_tiroidea.value = result[0].ap_fiebre_tiroidea;
                ap_cirugias.value = result[0].ap_cirugias;
                ap_actividad_fisica.value = result[0].ap_actividad_fisica;
                ap_patologia_renal.value = result[0].ap_patologia_renal;
                ap_neumonia.value = result[0].ap_neumonia;
                ap_pato_tiroides.value = result[0].ap_pato_tiroides;
                ap_fracturas.value = result[0].ap_fracturas;
                ap_otros.value = result[0].ap_otros;

                ant_padre.value = result[0].ant_padre;
                ant_madre.value = result[0].ant_madre;
                ant_hermanos.value = result[0].ant_hermanos;
                ant_esposa.value = result[0].ant_esposa;
                num_hijos_vivos.value = result[0].num_hijos_vivos;
                num_hijos_fallecidos.value = result[0].num_hijos_fallecidos;
                ant_otros.value = result[0].ant_otros;

                ev_ananesis.value = result[0].ev_ananesis;
                ev_ectoscopia.value = result[0].ev_ectoscopia;
                ev_estado_mental.value = result[0].ev_estado_mental;

                con_eva_psicologica.value = result[0].con_eva_psicologica;
                con_radiograficas.value = result[0].con_radiograficas;
                con_laboratorio.value = result[0].con_laboratorio;
                con_audiometria.value = result[0].con_audiometria;
                con_espirometria.value = result[0].con_espirometria;
                con_otros.value = result[0].con_otros;

                const tipresult_id = result[0].tipresult_id;

                switch (tipresult_id) {
                    case 1:
                        Apto.checked = true;
                        break;
                    case 2:
                        NoApto.checked = true;
                        break;
                    case 3:
                        AptoRestricciones.checked = true;
                        break;
                    case 4:
                        ConObservaciones.checked = true;
                        break;
                    case 5:
                        Evaluado.checked = true;
                        break;
                    case 6:
                        Pendiente.checked = true;
                        break;

                    default:
                        break;
                }
                restricciones.val(result[0].restricciones);
                if (result[0].antecedentes_ocupacionales) {
                    let antecedentes_ocupacionales_Array = JSON.parse(result[0].antecedentes_ocupacionales);
                    for (let i = 0; i < antecedentes_ocupacionales_Array.length && i < 3; i++) {
                        let registro = antecedentes_ocupacionales_Array[i];
                        let empantocu = registro.empresa;
                        let areaantocu = registro.area_trabajo;
                        let ocupantocu = registro.ocupacion;
                        let inicioantocu = '';
                        let finantocu = '';
                        if (registro.fec_ini !== undefined) {
                            inicioantocu = new Date(registro.fec_ini).toISOString().split('T')[0];
                        }
                        if (registro.fec_fin !== undefined) {
                            finantocu = new Date(registro.fec_fin).toISOString().split('T')[0];
                        }
                        let tiempoocu = registro.tiempo;
                        let peliantocu = registro.pel_ries_ocup;
                        let eqprantocu = registro.epp;
                        if (i === 0) {
                            empantocu1.value = empantocu;
                            areaantocu1.value = areaantocu;
                            ocupantocu1.value = ocupantocu;
                            inicioantocu1.value = inicioantocu;
                            finantocu1.value = finantocu;
                            tiempoocu1.value = tiempoocu;
                            peliantocu1.value = peliantocu;
                            eqprantocu1.value = eqprantocu;
                        } else if (i === 1) {
                            empantocu2.value = empantocu;
                            areaantocu2.value = areaantocu;
                            ocupantocu2.value = ocupantocu;
                            inicioantocu2.value = inicioantocu;
                            finantocu2.value = finantocu;
                            tiempoocu2.value = tiempoocu;
                            peliantocu2.value = peliantocu;
                            eqprantocu2.value = eqprantocu;
                        } else if (i === 2) {
                            empantocu3.value = empantocu;
                            areaantocu3.value = areaantocu;
                            ocupantocu3.value = ocupantocu;
                            inicioantocu3.value = inicioantocu;
                            finantocu3.value = finantocu;
                            tiempoocu3.value = tiempoocu;
                            peliantocu3.value = peliantocu;
                            eqprantocu3.value = eqprantocu;
                        }
                    }
                }
                if (result[0].js_habitos_nocibos) {
                    let js_habitos_nocibos_Array = JSON.parse(result[0].js_habitos_nocibos);
                    for (let i = 0; i < js_habitos_nocibos_Array.length && i < 4; i++) {
                        let registro = js_habitos_nocibos_Array[i];
                        let tipo = registro.tipo;
                        let cantidad = registro.cantidad;
                        let frecuencia = registro.frecuencia;
                        if (i === 0) {
                            altipoantpato.value = tipo;
                            alcantantpato.value = cantidad;
                            alfrecantpato.value = frecuencia;
                        } else if (i === 1) {
                            tatipoantpato.value = tipo;
                            tacantantpato.value = cantidad;
                            tafrecantpato.value = frecuencia;
                        } else if (i === 2) {
                            drtipoantpato.value = tipo;
                            drcantantpato.value = cantidad;
                            drfrecantpato.value = frecuencia;
                        } else if (i === 3) {
                            mdtipoantpato.value = tipo;
                            mdcantantpato.value = cantidad;
                            mdfrecantpato.value = frecuencia;
                        }
                    }
                }
                if (result[0].js_enferm_acci) {
                    let js_enferm_acci_Array = JSON.parse(result[0].js_enferm_acci);
                    for (let i = 0; i < js_enferm_acci_Array.length && i < 3; i++) {
                        let registro = js_enferm_acci_Array[i];
                        let enfermedad = registro.enfermedad;
                        let asostrab = registro.asostrab;
                        let año = registro.año;
                        let diasdescanso = registro.diasdescanso;

                        if (i === 0) {
                            enfantoatofam1.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam1.checked = true;
                            } else {
                                siantoatofam1.checked = true;
                            }
                            añoantoatofam1.value = año;
                            desantoatofam1.value = diasdescanso;
                        } else if (i === 1) {
                            enfantoatofam2.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam2.checked = true;
                            } else {
                                siantoatofam2.checked = true;
                            }
                            añoantoatofam2.value = año;
                            desantoatofam2.value = diasdescanso;
                        } else if (i === 2) {
                            enfantoatofam3.value = enfermedad;
                            if (asostrab === 'NO') {
                                noantoatofam3.checked = true;
                            } else {
                                siantoatofam3.checked = true;
                            }
                            añoantoatofam3.value = año;
                            desantoatofam3.value = diasdescanso;
                        }
                    }
                }
                if (result[0].js_examen_fisico) {
                    const js_examen_fisico_Array = JSON.parse(result[0].js_examen_fisico);

                    const organosMap = {
                        'Piel': { sinhevamed: pielsinhevamed, conhevamed: pielconhevamed },
                        'Cabello': { sinhevamed: cabesinhevamed, conhevamed: cabeconhevamed },
                        'Ojosyanexos': { sinhevamed: ojansinhevamed, conhevamed: ojanconhevamed },
                        'Oidos': { sinhevamed: oidossinhevamed, conhevamed: oidosconhevamed },
                        'Nariz': { sinhevamed: narizsinhevamed, conhevamed: narizconhevamed },
                        'Boca': { sinhevamed: bocasinhevamed, conhevamed: bocaconhevamed },
                        'Faringe': { sinhevamed: faringesinhevamed, conhevamed: faringeconhevamed },
                        'Cuello': { sinhevamed: cuellosinhevamed, conhevamed: cuelloconhevamed },
                        'Aparatorespiratorio': { sinhevamed: arsinhevamed, conhevamed: arconhevamed },
                        'Aparatocardiovascular': { sinhevamed: acsinhevamed, conhevamed: acconhevamed },
                        'Aparatodigestivo': { sinhevamed: adsinhevamed, conhevamed: adconhevamed },
                        'Aparatogenitourinario': { sinhevamed: agsinhevamed, conhevamed: agconhevamed },
                        'Aparatolocomotor': { sinhevamed: alsinhevamed, conhevamed: alconhevamed },
                        'Marcha': { sinhevamed: marchasinhevamed, conhevamed: marchaconhevamed },
                        'Columna': { sinhevamed: columsinhevamed, conhevamed: columconhevamed },
                        'MiembrosSuperiores': { sinhevamed: mssinhevamed, conhevamed: msconhevamed },
                        'MiembrosInferiores': { sinhevamed: misinhevamed, conhevamed: miconhevamed },
                        'SistemaLinfatico': { sinhevamed: slsinhevamed, conhevamed: slconhevamed },
                        'SistemaNervioso': { sinhevamed: snsinhevamed, conhevamed: snconhevamed },
                    };

                    for (let i = 0; i < Math.min(js_examen_fisico_Array.length, 20); i++) {
                        const registro = js_examen_fisico_Array[i];
                        const organo = registro.organo;

                        if (organosMap[organo]) {
                            const { sinhevamed, conhevamed } = organosMap[organo];
                            sinhevamed.value = registro.sinhallazgo;
                            conhevamed.value = registro.conhallazgo;
                        }
                    }
                }
                if (result[0].diagnosticos) {
                    const diagnosticosArray = JSON.parse(result[0].diagnosticos);
                    const tbodydiagmedocu = $('#tbodydiagmedocu');
                    tbodydiagmedocu.empty();

                    diagnosticosArray.forEach(diagnostico => {
                        let [P, D, R] = ['', '', ''];

                        if (diagnostico.tipdia === 'P') {
                            P = 'X';
                        } else if (diagnostico.tipdia === 'D') {
                            D = 'X';
                        } else if (diagnostico.tipdia === 'R') {
                            R = 'X';
                        }

                        tbodydiagmedocu.append(`
                            <tr>
                                <td style="vertical-align: middle;" class="text-start align-middle" colspan="7">${diagnostico.diades}</td>
                                <td style="vertical-align: middle;" class="align-middle">${P}</td>
                                <td style="vertical-align: middle;" class="align-middle">${D}</td>
                                <td style="vertical-align: middle;" class="align-middle">${R}</td>
                                <td style="vertical-align: middle;" class="align-middle">${diagnostico.diacod}</td>
                                <td style="vertical-align: middle;" class="text-center estado">
                                    <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFila(this)">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </td>
                            </tr>
                        `);
                    });
                }
                if (result[0].recomendaciones) {
                    const recomendacionesArray = JSON.parse(result[0].recomendaciones);
                    const tbodyrecomencontrol = $('#tbodyrecomencontrol');
                    tbodyrecomencontrol.empty();

                    recomendacionesArray.forEach(recomendacion => {
                        tbodyrecomencontrol.append(`
                            <tr nuncom_r = "${recomendacion.nuncom_r}" codpru_id_r = "${recomendacion.codpru_id_r}" ord_itm_r = "${recomendacion.ord_itm_r}">
                                <td style="vertical-align: middle;" class="text-center">${recomendacion.ord_itm}</td>
                                <td style="vertical-align: middle;" class="text-start">${recomendacion.desrec}</td>
                                <td style="vertical-align: middle;" class="text-center">
                                <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFilarec(this)"><i class="fa-solid fa-trash-can"></i></button>
                                </td>
                            </tr>
                        `);
                    });
                }
                ajustartextArea(conevapsico);
                ajustartextArea(conradio);
                ajustartextArea(restricciones);



                if (result[0].signos_vitales && result[0].signos_vitales != 0) {
                    const signos_vitalesArray = JSON.parse(result[0].signos_vitales);
                    signos_vitalesArray.forEach(objSignosVitales => {
                        if (objSignosVitales.parexa_id === 45) {
                            FC312.textContent = 'FC: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 46) {
                            FR312.textContent = 'FR: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 47) {
                            PA312.textContent = 'PA: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 49) {
                            peso312.textContent = 'PESO: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 50) {
                            talla312.textContent = 'TALLA: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 51) {
                            IMC312.textContent = 'IMC: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 60) {
                            Per_abdo312.textContent = 'PER. ABDOMINAL: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }
                        if (objSignosVitales.parexa_id === 61) {
                            Temp312.textContent = 'TEMP: ' + objSignosVitales.Resultados + ' ' + objSignosVitales.Unimed;
                        }

                        Per_Cadera312.textContent = 'Per. Cadera';
                        ICC312.textContent = 'ICC:';
                    });
                }
            }
        },
        error: function (error) {
            console.log('error', error);
        }
    });
};

function Grabar() {
    let btnGrabar = document.getElementById('btnGrabar');

    let cita_id = document.getElementById('id').value;
    let nuncom = document.getElementById('nuncom').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;

    let AntecedentesOcupacionales = obtenerAntecedentesOcupacionales();

    let ap_alergias = $('#alerantpato').val();
    let ap_RAM = $('#ramantpato').val();
    let ap_asma = $('#asmaantpato').val();
    let ap_HTA = $('#htaantpato').val();
    let ap_TBC = $('#tbcantpato').val();
    let ap_diabetes = $('#diabeantpato').val();
    let ap_bronquitis = $('#bronqantpato').val();
    let ap_hepatitis = $('#hepaantpato').val();
    let ap_neoplasia = $('#neoantpato').val();
    let ap_convulsiones = $('#convantpato').val();
    let ap_ITS = $('#itsantpato').val();
    let ap_quemaduras = $('#quemantpato').val();
    let ap_intoxicaciones = $('#intoxantpato').val();
    let ap_fiebre_tiroidea = $('#fitiantpato').val();
    let ap_cirugias = $('#cirantpato').val();
    let ap_actividad_fisica = $('#acfiantpato').val();
    let ap_patologia_renal = $('#pareantpato').val();
    let ap_neumonia = $('#neuantpato').val();
    let ap_pato_tiroides = $('#patiantpato').val();
    let ap_fracturas = $('#fracantpato').val();
    let ap_otros = $('#otrosantpato').val();

    let HabitosNocivos = obtenerHabitosNocivos();

    let ant_padre = $('#padreantoatofam').val();
    let ant_madre = $('#madreantoatofam').val();
    let ant_hermanos = $('#hermantoatofam').val();
    let ant_esposa = $('#espantoatofam').val();
    let num_hijos_vivos = $('#hvantoatofam').val();
    let num_hijos_fallecidos = $('#hfantoatofam').val();
    let ant_otros = $('#otrosantoatofam').val();

    let Absentismo = obtenerAbsentismo();

    let ev_ananesis = $('#anamevamed').val();
    let ev_ectoscopia = $('#ectoevamed').val();
    let ev_estado_mental = $('#esmeevamed').val();

    let ExamenFisico = obtenerExamenFisico();

    let con_eva_psicologica = $('#conevapsico').val();
    let con_radiograficas = $('#conradio').val();
    let con_laboratorio = $('#hallpatolab').val();
    let con_audiometria = $('#conaudio').val();
    let con_espirometria = $('#conespiro').val();
    let con_otros = $('#concluotros').val();
    let Diagnosticos = obtenerDiagnosticos();
    let tipresult_id = $('input[name="estado"]:checked').val();
    let restricciones = $('#restricciones').val();
    let Recomendaciones = obtenerRecomendaciones();
    const datosCompletos = {
        cita_id: cita_id,
        nuncom: nuncom,
        soexa: soexa,
        codpru_id: codpru_id,
        AntecedentesOcupacionales: AntecedentesOcupacionales,
        ap_alergias: ap_alergias,
        ap_RAM: ap_RAM,
        ap_asma: ap_asma,
        ap_HTA: ap_HTA,
        ap_TBC: ap_TBC,
        ap_diabetes: ap_diabetes,
        ap_bronquitis: ap_bronquitis,
        ap_hepatitis: ap_hepatitis,
        ap_neoplasia: ap_neoplasia,
        ap_convulsiones: ap_convulsiones,
        ap_ITS: ap_ITS,
        ap_quemaduras: ap_quemaduras,
        ap_intoxicaciones: ap_intoxicaciones,
        ap_fiebre_tiroidea: ap_fiebre_tiroidea,
        ap_cirugias: ap_cirugias,
        ap_actividad_fisica: ap_actividad_fisica,
        ap_patologia_renal: ap_patologia_renal,
        ap_neumonia: ap_neumonia,
        ap_pato_tiroides: ap_pato_tiroides,
        ap_fracturas: ap_fracturas,
        ap_otros: ap_otros,
        HabitosNocivos: HabitosNocivos,
        ant_padre: ant_padre,
        ant_madre: ant_madre,
        ant_hermanos: ant_hermanos,
        ant_esposa: ant_esposa,
        num_hijos_vivos: num_hijos_vivos,
        num_hijos_fallecidos: num_hijos_fallecidos,
        ant_otros: ant_otros,
        Absentismo: Absentismo,
        ev_ananesis: ev_ananesis,
        ev_ectoscopia: ev_ectoscopia,
        ev_estado_mental: ev_estado_mental,
        ExamenFisico: ExamenFisico,
        con_eva_psicologica: con_eva_psicologica,
        con_radiograficas: con_radiograficas,
        con_laboratorio: con_laboratorio,
        con_audiometria: con_audiometria,
        con_espirometria: con_espirometria,
        con_otros: con_otros,
        Diagnosticos: Diagnosticos,
        tipresult_id: tipresult_id,
        restricciones: restricciones,
        Recomendaciones: Recomendaciones
    };
    btnGrabar.disabled = true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
                                    speed="1" style="width: 38px; height: 35px;" loop
                                    autoplay></lottie-player>`
    if (tipresult_id == 1 || tipresult_id == 2 || tipresult_id == 3 || tipresult_id == 4) {
        $.ajax({
            url: '/validarficha312',
            method: "GET",
            data: {
                cita_id: cita_id,
                nuncom: nuncom,
            },
            success: function (result) {
                if (result[0].mostrarModal === 'N') {
                    MensajeSIyNO("warning", "¿Estás seguro?", "¿Desea concluir el acto médico?", function (confirmado) {
                        if (confirmado) {
                            switch (result[0].EstadoCita) {
                                case 'X':
                                    mensaje('error', 'La atención ha sido cerrada', 2000);
                                    btnGrabar.disabled = false;
                                    btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
                                    return;
                                case 'C':
                                    mensajecentral('error', 'Atención', 'La atención ha sido concluida, tiempo excedido para modificar');
                                    btnGrabar.disabled = false;
                                    btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
                                    return;
                                case 'S':
                                    fetch('/pbfichamedicoocupacional312', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(datosCompletos)
                                    })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Error en la solicitud');
                                            }
                                            return response.json();
                                        })
                                        .then(data => {
                                            mensaje(data[0].icono, data[0].mensaje, 2000);
                                            let nuncom = document.getElementById('nuncom');
                                            nuncom.value = data[0].nuncom;
                                            btnGrabar.disabled = false;
                                            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`

                                        })
                                        .catch(error => {
                                            console.error('Error:', error);
                                        });
                                    return;
                            }
                        } else {
                            btnGrabar.disabled = false;
                            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
                        }
                    });
                } else {
                    switch (result[0].EstadoCita) {
                        case 'X':
                            mensaje('error', 'La atención ha sido cerrada', 2000);
                            btnGrabar.disabled = false;
                            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
                            return;
                        case 'C':
                            mensajecentral('error', 'La atención ha sido concluida, tiempo excedido');
                            btnGrabar.disabled = false;
                            btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`
                            return;
                        case 'S':
                            fetch('/pbfichamedicoocupacional312', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(datosCompletos)
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error en la solicitud');
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    mensaje(data[0].icono, data[0].mensaje, 2000);
                                    let nuncom = document.getElementById('nuncom');
                                    nuncom.value = data[0].nuncom;
                                    btnGrabar.disabled = false;
                                    btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`

                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                            return;
                    }
                }
            }
        });
    } else {
        fetch('/pbfichamedicoocupacional312', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosCompletos)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                mensaje(data[0].icono, data[0].mensaje, 2000);
                let nuncom = document.getElementById('nuncom');
                nuncom.value = data[0].nuncom;
                btnGrabar.disabled = false;
                btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;"></i>`

            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function obtenerAntecedentesOcupacionales() {
    var table = document.getElementById('tablaantocupacionales');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var inputs = rows[i].getElementsByTagName('input');
        var algunaColumnadigitada = false;
        for (var j = 1; j < inputs.length; j++) {
            if (inputs[j].value.trim() !== '') {
                algunaColumnadigitada = true;
                break;
            }
        }
        if (algunaColumnadigitada) {
            var rowData = {
                ord: inputs[0].value,
                empresa: inputs[1].value,
                area_trabajo: inputs[2].value,
                ocupacion: inputs[3].value,
                fecini: inputs[4].value.trim() !== '' ? inputs[4].value : null,
                fec_fin: inputs[5].value.trim() !== '' ? inputs[5].value : null,
                tiempo: inputs[6].value,
                pel_ries_ocup: inputs[7].value,
                epp: inputs[8].value
            };
            data.push(rowData);
        }
    }
    return data;
}


function obtenerAbsentismo() {
    var table = document.getElementById('absentismo');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var ord = input[0].value;
            var enfermedad = input[1].value;
            let valor;
            if (input[2].checked === true) {
                valor = 'SI'
            } else {
                valor = 'NO'
            }
            var año = input[4].value;
            var diasdescanso = input[5].value;
            var rowData = {
                ord: ord,
                enfermedad: enfermedad,
                asostrab: valor,
                año: año,
                diasdescanso: diasdescanso
            };
            data.push(rowData);
        }
    }
    return data;
}

function obtenerHabitosNocivos() {
    var table = document.getElementById('habitosnocivos');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var habito = input[0].value;
            var tipo = input[1].value;
            var cantidad = input[2].value;
            var frecuencia = input[3].value;
            var rowData = {
                habito: habito,
                tipo: tipo,
                cantidad: cantidad,
                frecuencia: frecuencia
            };
            data.push(rowData);
        }
    }
    return data;
}

function obtenerExamenFisico() {
    var table = document.getElementById('examenfisico');
    var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    var data = [];

    for (var i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input');

        if (input.length >= 3) {
            var organo = input[0].value;
            var sinhallazgo = input[1].value;
            var conhallazgo = input[2].value;
            var rowData = {
                organo: organo,
                sinhallazgo: sinhallazgo,
                conhallazgo: conhallazgo
            };
            data.push(rowData);
        }
    }
    return data;
}

function agregarFilarec() {
    let modalrec312 = $('#modalrec312');
    var tbody = document.getElementById('tbodyrecomencontrol');
    if (modalrec312.val() === '') {
        mensaje('error', 'Debe ingresar una recomendación', 1500);
        return;
    }
    // Obtener el número actual de filas en el tbody
    var numeroFilas = tbody.rows.length;

    var nuevaFila = tbody.insertRow(-1);

    var cell0 = nuevaFila.insertCell(0);
    cell0.textContent = numeroFilas + 1; // Incrementar el número de filas y asignarlo a cell0
    cell0.style = 'width: 5%';
    var cell1 = nuevaFila.insertCell(1);
    cell1.textContent = modalrec312.val();
    cell1.className = 'text-start align-middle';

    var cell2 = nuevaFila.insertCell(2);
    cell2.innerHTML = '<button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFilarec(this)"><i class="fa-solid fa-trash-can"></i></button>';
    let cerrarRecomendaciones = document.getElementById('cerrarRecomendaciones');
    cerrarRecomendaciones.click();
    modalrec312.val('');
}


function eliminarFila(boton) {
    MensajeSIyNO("warning", "¿Estás seguro?", "¿Quieres eliminar la fila seleccionada?", function (confirmado) {
        if (confirmado) {
            var fila = boton.parentNode.parentNode;
            fila.parentNode.removeChild(fila);
        }
    });
}

function eliminarFilarec(boton) {
    MensajeSIyNO("warning", "¿Estás seguro?", "¿Quieres eliminar la fila seleccionada?", function (confirmado) {
        if (confirmado) {
            var fila = boton.parentNode.parentNode;
            var tbody = fila.parentNode;

            // Obtener el índice de la fila actual
            var rowIndex = fila.rowIndex;

            // Eliminar la fila
            tbody.removeChild(fila);

            // Recalcular los números en la primera celda de todas las filas restantes
            var filas = tbody.getElementsByTagName('tr');

            for (var i = 0; i < filas.length; i++) {
                var celdas = filas[i].getElementsByTagName('td');
                celdas[0].textContent = i + 1;
            }
        }
    });
}

function obtenerDiagnosticos() {
    var table = document.getElementById('tabladiagmedocu');
    var tbody = table.tBodies[0];
    var data = [];

    for (var i = 0; i < tbody.rows.length; i++) {
        var celdas = tbody.rows[i].cells;
        let tipdia;
        if (celdas[1].innerText === 'X') {
            tipdia = 'P'
        } if (celdas[2].innerText === 'X') {
            tipdia = 'D'
        } if (celdas[3].innerText === 'X') {
            tipdia = 'R'
        }

        var rowData = {
            diadesc: celdas[0].innerText,
            tipdia: tipdia,
            diacod: celdas[4].innerText
        };
        data.push(rowData);
    }

    return data;
}

function obtenerRecomendaciones() {
    var table = document.getElementById('tablarecomencontrol');
    var tbody = table.tBodies[0];
    var data = [];

    for (var i = 0; i < tbody.rows.length; i++) {
        var fila = tbody.rows[i];
        var celdas = fila.cells;

        var nuncom_r = fila.getAttribute('nuncom_r');
        var codpru_id_r = fila.getAttribute('codpru_id_r');
        var ord_itm_r = fila.getAttribute('ord_itm_r');
		function toInteger(value) {
            var intValue = parseInt(value, 10);
            return isNaN(intValue) ? 0 : intValue;
        }

        nuncom_r = toInteger(nuncom_r);
        codpru_id_r = toInteger(codpru_id_r);
        ord_itm_r = toInteger(ord_itm_r);
		
        var rowData = {
            ord_itm: celdas[0].innerText,
            recomen: celdas[1].innerText,
            nuncom_r: nuncom_r,
            codpru_id_r: codpru_id_r,
            ord_itm_r: ord_itm_r
        };
        data.push(rowData);
    }

    return data;
}
function Ajustar(textareaId) {
    var textarea = document.getElementById(textareaId);
    if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
    }
}
function llenarfichas(soexa, event) {
    let btnExportarPsico = event.target;
    let btnExportarRadio = event.target;

    if (btnExportarPsico.id === 'btnExportarPsico') {
        btnExportarPsico.disabled = true;
    }

    if (btnExportarRadio.id === 'btnExportarRadio') {
        btnExportarRadio.disabled = true;
    }
    let cita_id = document.getElementById('id').value;
    $.ajax({
        url: '/getresultadosfichas',
        method: "GET",
        data: {
            cita_id: cita_id,
        },
        success: function (result) {
            if (soexa === '032') {
                $('#conevapsico').val(result[0].conevapsico);
                btnExportarPsico.disabled = false;
                mensaje(result[0].icono, result[0].mensaje, 1500);
            } else if (soexa === '013') {
                $('#conradio').val(result[0].conradio);
                btnExportarRadio.disabled = false;
                mensaje(result[0].icono2, result[0].mensaje2, 1500);
            }
            var btncerrar = document.getElementById(`cerrarFormatosModal`);
            btncerrar.click();
        },
        error: function (error) {
            console.log('error', error);
        }
    });
}

async function llenarmodalFormato(soexaClick) {
    mostrarDiv('cargaFormato');
    ocultarDiv('contenedorFormato');
    ocultarDiv('btnMostrarFichaAdjunto');
    mostrarDiv('btnMostrarDocAdjunto');
    let titleMFormatos = document.getElementById('titleMFormatos');

    if (soexaClick === '032') {
        $('#soexa_id').val('032');
        titleMFormatos.innerHTML = 'Formato de Psicología';
        ocultarDiv('divExportarRadio');
        mostrarDiv('divExportarPsico');
    }
    if (soexaClick === '013') {
        $('#soexa_id').val('013');
        titleMFormatos.innerHTML = 'Formato de Diagnóstico por imágenes';
        ocultarDiv('divExportarPsico');
        mostrarDiv('divExportarRadio');
    }
    if (soexaClick === '009') {
        $('#soexa_id').val('009');
        titleMFormatos.innerHTML = 'Formato de Laboratorio';
        ocultarDiv('divExportarPsico');
        ocultarDiv('divExportarRadio');
    }
    if (soexaClick === '003') {
        $('#soexa_id').val('003');
        titleMFormatos.innerHTML = 'Formato de Audiometría';
        ocultarDiv('divExportarPsico');
        ocultarDiv('divExportarRadio');
    }
    if (soexaClick === '005') {
        $('#soexa_id').val('005');
        titleMFormatos.innerHTML = 'Formato de Espirometría';
        ocultarDiv('divExportarPsico');
        ocultarDiv('divExportarRadio');
    }
    if (soexaClick === 'btnDoc') {
        soexaClick = $('#soexa_id').val();
        mostrarDiv('btnMostrarFichaAdjunto')
        ocultarDiv('btnMostrarDocAdjunto');
    }
    if (soexaClick === 'btnFicha') {
        soexaClick = $('#soexa_id').val();
        mostrarDiv('btnMostrarDocAdjunto')
        ocultarDiv('btnMostrarFichaAdjunto');
    }
    let accion;
    if (document.getElementById("btnMostrarFichaAdjunto").style.display === "none") {
        accion = 'Ficha';
    } else {
        accion = 'Adjunto';
    }
    let cita_id = document.getElementById('id').value;


    $.ajax({
        url: '/getdatosformatosficha312',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexaClick,
        },
        success: function (result) {
            //let nombreExamen = result.nombreExamen;
            let contenedor = document.getElementById("contenedorFormato");
            var modalContentHeight = document.getElementById("modalFormatos").offsetHeight;
            var windowHeight = window.innerHeight;
            var minHeight = windowHeight * 0.6;
            var maxHeight = windowHeight * 0.6;
            contenedor.style.minHeight = "600px";
            contenedor.style.maxHeight = "600px";
            contenedor.style.overflowY = "auto";

            if (result.length === 0) {
                contenedor.innerHTML = 'No se ha registrado resultados para este examen';
                mostrarDiv('contenedorFormato');
                ocultarDiv('cargaFormato');
                return;
            }

            let totalFichas = result.length;
            let renderedHtmlArray = [];
            result.forEach((objResultrenderedHtml) => {
                renderedHtmlArray.push(objResultrenderedHtml.renderedHtml);
            });

            let soexacase = soexaClick;

            let contenedorPaginacion = document.getElementById("contenedorPaginacion");
            let PaginasTotalFicha = totalFichas;
            if (accion === 'Ficha') {
                let $pagination = $('#pagination-container');
                if ($pagination.data('twbs-pagination')) {
                    $pagination.twbsPagination('destroy');
                }
                $pagination.remove();
                switch (soexacase) {
                    case '032':
                        contenedor.innerHTML = result[0].renderedHtml;
                        setTimeout(function () {
                            Ajustar('mot_eva');
                            Ajustar('prin_riesgos');
                            Ajustar('med_seguridad');
                            Ajustar('historia_familiar');
                            Ajustar('accid_enfer');
                            Ajustar('habitos');
                            Ajustar('conclusionesPsico');
                            Ajustar('con_area_cognitiva');
                            Ajustar('con_area_emocional');
                            Ajustar('recomendacionesInforme');
                        }, 1);
                        break;
                    case '013':
                        contenedor.innerHTML = result[0].renderedHtml;
                        mostrarContenido(renderedHtmlArray, contenedorPaginacion);
                        Paginacion(PaginasTotalFicha);
                        break;
                    case '009':
                        contenedor.innerHTML = result[0].renderedHtml;
                        break;
                    case '003':
                        contenedor.innerHTML = result[0].renderedHtml;
                        let resultadoBase64GrafiosAudio = result[0].base64GrafiosAudio;
                        if (result[0].rutaArchivo !== "S/N") {
                            let base64GrafiosAudio_OD = resultadoBase64GrafiosAudio.base64Image_OD;
                            let base64GrafiosAudio_OI = resultadoBase64GrafiosAudio.base64Image_OI;

                            //OD
                            let canvasOD = document.getElementById('graf_OD');
                            let ctxOD = canvasOD.getContext('2d');

                            let imgOD = new Image();
                            imgOD.onload = function () {
                                canvasOD.width = imgOD.width;
                                canvasOD.height = imgOD.height;
                                ctxOD.drawImage(imgOD, 0, 0, canvasOD.width, canvasOD.height);
                            };
                            imgOD.src = "data:image/png;base64," + base64GrafiosAudio_OD;
                            //OI
                            let canvasOI = document.getElementById('graf_OI');
                            let ctxOI = canvasOI.getContext('2d');

                            let imgOI = new Image();
                            imgOI.onload = function () {
                                ctxOI.drawImage(imgOI, 0, 0);
                                canvasOI.width = imgOI.width;
                                canvasOI.height = imgOI.height;
                                ctxOI.drawImage(imgOI, 0, 0, canvasOI.width, canvasOI.height);
                            };
                            imgOI.src = "data:image/png;base64," + base64GrafiosAudio_OI;
                        }
                        break;
                    case '005':
                        contenedor.innerHTML = result[0].renderedHtml;
                        break;
                }
            } else {
                contenedor.innerHTML = '';
                let paginacionSeleccionada = $('#pagination-container').twbsPagination('getCurrentPage');
                if (result[paginacionSeleccionada - 1].rutaArchivo === "0") {
                    contenedor.innerHTML = 'No se ha registrado documentos para este examen';
                    mostrarDiv('contenedorFormato');
                    ocultarDiv('cargaFormato');
                    let $pagination = $('#pagination-container');
                    if ($pagination.data('twbs-pagination')) {
                        $pagination.twbsPagination('destroy');
                    }

                    $pagination.remove();
                    return;
                }
                let rutaArchivoSeleccionadaArray = JSON.parse(result[paginacionSeleccionada - 1].rutaArchivo);
                let rutasArray = [];
                rutaArchivoSeleccionadaArray.forEach((objrutaArchivo) => {
                    rutasArray.push(objrutaArchivo.ruta);
                });

                let paginasTotalDocument = rutasArray.length;


                let ContenidoArrays = mostrarDocumentos(rutasArray);
                contenedor.innerHTML = ContenidoArrays[0];


                mostrarContenido(ContenidoArrays, contenedorPaginacion);
                Paginacion(paginasTotalDocument);
            }
            mostrarDiv('contenedorFormato');
            ocultarDiv('cargaFormato');
        },
        error: function (error) {
            console.log("error", error);
        }
    });
}
function Paginacion(totalPages) {
    let $pagination = $('#pagination-container');

    if ($pagination.data('twbs-pagination')) {
        $pagination.twbsPagination('destroy');
    }

    $pagination.remove();

    $('#pag').html('<div id="pagination-container" class="pagination"></div>');
    $pagination = $('#pagination-container');
    $pagination.twbsPagination({
        totalPages: totalPages,
        startPage: 1,
        visiblePages: 3,
        first: '',
        last: '',
        prev: '&laquo;',
        next: '&raquo;',
        onPageClick: function (event, page) {
        }
    });
}
function mostrarContenido(contenidos, contenedorPaginacion) {
    let contenedor = document.getElementById("contenedorFormato");
    $(contenedorPaginacion).on('click', function (event) {
        var textoActivo = $('.page-item.active .page-link').text();
        contenedor.innerHTML = contenidos[textoActivo - 1];
    });
}

function mostrarDocumentos(rutaArchivo) {
    let contenedor = document.getElementById("contenedorFormato");
    contenedor.innerHTML = '';
    let ContenidoDocumentos = [];

    rutaArchivo.forEach(function (DocObj) {
        let baseUrl = window.location.origin;
        let tipoExtension = DocObj.split('.').pop().toLowerCase();
        if (tipoExtension === 'jpg' || tipoExtension === 'jpeg' || tipoExtension === 'png') {
            contenedor.style.overflowY = "auto";
            let imgElement = document.createElement('img');
            imgElement.src = baseUrl + DocObj;
            imgElement.style.width = '100%';
            imgElement.style.height = 'auto';
            imgElement.setAttribute('scrolling', 'auto');
            contenedor.appendChild(imgElement);
            ContenidoDocumentos.push(imgElement.outerHTML);

        } else if (tipoExtension === 'pdf') {
            let pdfUrl = baseUrl + DocObj + '#toolbar=0';
            let embedContainer = document.createElement('div');
            embedContainer.style.width = '100%';
            embedContainer.style.height = '100%';
            let embed = document.createElement('embed');
            embed.src = pdfUrl;
            embed.type = 'application/pdf';
            embed.width = '100%';
            embed.height = '100%';
            embed.setAttribute('scrolling', 'auto');
            embedContainer.appendChild(embed);
            contenedor.appendChild(embedContainer);
            ContenidoDocumentos.push(embedContainer.outerHTML);
        }
    });
    return ContenidoDocumentos;
}

document.getElementById("cie10modal").addEventListener("keydown", function (event) {
    if (event.key === 'Enter') {
        listarCie10();
    }
});

function listarCie10() {
    mostrarDiv('cargacie10modal');
    ocultarTabla('tablecie10modal');
    let cie10modal = $('#cie10modal').val();
    event.preventDefault();
    $.ajax({
        url: '/cie10list',
        method: "GET",
        data: {
            cie10: cie10modal,
        },
        success: function (lista) {
            ocultarDiv('cargacie10modal');
            mostrarTabla('tablecie10modal');
            let bodycie10modal = $('#bodycie10modal');
            bodycie10modal.html('');
            if (lista.length === 0) {
                bodycie10modal.append(`
                    <tr>
                        <td colspan="3">No existe CIE 10 con el dato proporcionado</td>
                    </tr>
                    `);
            } else {
                if (lista[0].icono === 'error') {
                } else {
                    lista.forEach(list => {
                        bodycie10modal.append(`
                        <tr>
                            <td class="align-middle"><button class="btn btn-info btn-circle btn-sm" onclick="AgregarCie10(this)"><i class="fa-solid fa-plus"></i></button></td>
                            <td style="vertical-align: middle;" class="text-left">${list.diacod}</td>
                            <td style="vertical-align: middle;" class="text-left asignado">${list.diades}</td>
                            <td style="vertical-align: middle; width: 14%" class="text-left">
                                <select name="" id="modalCombocie10" class="form-control form-control-sm">
                                    <option value="P">
                                            PRESUNTIVO
                                    </option>
                                    <option value="D">
                                            DEFINITIVO
                                    </option>
                                    <option value="R">
                                            REPETITIVO
                                    </option>
                                </select>
                            </td>
                        </tr>
                    `);
                    });
                }
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
            }

        },
        error: function () {
            console.log('error', error);
        }
    });
}
function AgregarCie10(btn) {
    var filaOrigen = $(btn).closest("tr");
    var ciecod = filaOrigen.find("td:eq(1)").text();
    var ciedes = filaOrigen.find("td:eq(2)").text();
    var cietip = filaOrigen.find("select#modalCombocie10").val();

    var tbody = document.getElementById('tbodydiagmedocu');

    var cie10Existente = Array.from(tbody.rows).find(row => row.cells[4].textContent === ciecod);

    if (cie10Existente) {
        mensaje('error', 'Ya existe el cie10 seleccionado', 1500);
        return;
    }
    var nuevaFila = tbody.insertRow(-1);

    var cell0 = nuevaFila.insertCell(0);
    var cell1 = nuevaFila.insertCell(1);
    var cell2 = nuevaFila.insertCell(2);
    var cell3 = nuevaFila.insertCell(3);
    var cell4 = nuevaFila.insertCell(4);
    cell0.colSpan = 7;
    cell0.className = 'text-start align-middle';
    cell1.className = 'align-middle';
    cell2.className = 'align-middle';
    cell3.className = 'align-middle';
    cell4.className = 'align-middle';

    cell0.textContent = ciedes;
    switch (cietip) {
        case 'P':
            cell1.textContent = 'X';
            cell2.textContent = '';
            cell3.textContent = '';
            break;
        case 'D':
            cell1.textContent = '';
            cell2.textContent = 'X';
            cell3.textContent = '';
            break;
        case 'R':
            cell1.textContent = '';
            cell2.textContent = '';
            cell3.textContent = 'X';
            break;
    }
    var btncerrar = document.getElementById(`cerrarcie10`);
    btncerrar.click();
    cell4.textContent = ciecod;
    nuevaFila.insertCell(5).innerHTML = '<button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFila(this)"><i class="fa-solid fa-trash-can"></i></button>';
}

function importarCie10() {
    let cita_id = document.getElementById('id').value;
    let btnImportarCie10 = document.getElementById('btnImportarCIE10');
    btnImportarCie10.disabled = true;
    $.ajax({
        url: '/importarcie10',
        method: "GET",
        data: {
            cita_id: cita_id,
        },
        success: function (result) {
            const tbodydiagmedocu = $('#tbodydiagmedocu');
            let validos = [];
            for (let i = 0; i < result.length; i++) {
                let cie10Existente = Array.from(tbodydiagmedocu[0].rows).find(row => row.cells[4].textContent === result[i].diacod);
                if (!cie10Existente) {
                    validos.push(result[i]);
                }
            }
            if (validos.length === 0) {
                mensaje('error', 'No se encontraron más CIE10 para importar', 1500);
                btnImportarCie10.disabled = false;
                return;
            }
            for (let i = 0; i < validos.length; i++) {

                let [P, D, R] = ['', '', ''];

                if (validos[i].tipdia === 'P') {
                    P = 'X';
                } else if (validos[i].tipdia === 'D') {
                    D = 'X';
                } else if (validos[i].tipdia === 'R') {
                    R = 'X';
                }

                tbodydiagmedocu.append(`
                    <tr>
                        <td style="vertical-align: middle;" class="text-start align-middle" colspan="7">${validos[i].diades}</td>
                        <td style="vertical-align: middle;" class="align-middle">${P}</td>
                        <td style="vertical-align: middle;" class="align-middle">${D}</td>
                        <td style="vertical-align: middle;" class="align-middle">${R}</td>
                        <td style="vertical-align: middle;" class="align-middle">${validos[i].diacod}</td>
                        <td style="vertical-align: middle;" class="text-center estado">
                            <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFila(this)">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `);
            }
            btnImportarCie10.disabled = false;
            mensaje(result[0].icono, result[0].mensaje, 1500);
        },
        error: function (error) {
            console.log('error', error);
        }
    });
}
function importarRecomendaciones() {
    let cita_id = document.getElementById('id').value;
    let btnImportarRecomendaciones = document.getElementById('btnImportarRecomendaciones');
    btnImportarRecomendaciones.disabled = true;
    $.ajax({
        url: '/importarrecomendaciones',
        method: "GET",
        data: {
            cita_id: cita_id,
        },
        success: function (result) {
            const tbodydiagmedocu = $('#tbodyrecomencontrol');

            let validos = [];
            const filas = tbodydiagmedocu[0].querySelectorAll('tr');
            let ultimoFila = filas.length;
            let filaExistentes = [];
            for (let i = 0; i < filas.length; i++) {
                var fila = tbodydiagmedocu[0].rows[i];
                var nuncom_r = fila.getAttribute('nuncom_r');
                var codpru_id_r = fila.getAttribute('codpru_id_r');
                var ord_itm_r = fila.getAttribute('ord_itm_r');

                filaExistentes.push(nuncom_r + '_' + codpru_id_r + '_' + ord_itm_r);
            }
            for (let i = 0; i < result.length; i++) {
                let filaImportadas = result[i].nuncom + '_' + result[i].codpru_id + '_' + result[i].ord_itm;
                if (!filaExistentes.includes(filaImportadas)) {
                    validos.push(result[i]);
                }
            }
            if (validos.length === 0) {
                mensaje('error', 'No se encontraron más recomendaciones para importar', 1500);
                btnImportarRecomendaciones.disabled = false;
                return;
            }
            for (let i = 0; i < validos.length; i++) {
                ultimoFila++;
                tbodydiagmedocu.append(`
                    <tr nuncom_r = "${validos[i].nuncom}" codpru_id_r = "${validos[i].codpru_id}" ord_itm_r = "${validos[i].ord_itm}">
                        <td class="text-center" style = "max-width : 5%">${ultimoFila}</td>
                        <td class="text-start">${validos[i].desrec}</td>
                        <td style="vertical-align: middle;" class="text-center">
                            <button style="color:white" type="button" class="btn btn-circle btn-sm btn-danger mr-1 ms-1" onclick="eliminarFilarec(this)">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `);
            }
            btnImportarRecomendaciones.disabled = false;
            mensaje(result[0].icono, result[0].mensaje, 1500);
        },
        error: function (error) {
            console.log('error', error);
        }
    });
}
function Notificaciones312() {
    let cita_id = document.getElementById('id').value;
    let soexa = ['032', '013', '009', '003', '005'];
    $.ajax({
        url: '/notificacionficha312',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa,
        },
        success: function (result) {
            result.forEach(objExamenes => {
                if (objExamenes.soexa === '032' && objExamenes.existe === 'S') {
                    mostrarDiv('notificacionPsico');
                }
                if (objExamenes.soexa === '013' && objExamenes.existe === 'S') {
                    mostrarDiv('notificacionRadio');
                }
                if (objExamenes.soexa === '009' && objExamenes.existe === 'S') {
                    mostrarDiv('notificacionLab');
                }
                if (objExamenes.soexa === '003' && objExamenes.existe === 'S') {
                    mostrarDiv('notificacionAudiometria');
                }
                if (objExamenes.soexa === '005' && objExamenes.existe === 'S') {
                    mostrarDiv('notificacionEspirometria');
                }
            });
        },
        error: function (error) {
            console.log('error', error);
        }
    });
}
