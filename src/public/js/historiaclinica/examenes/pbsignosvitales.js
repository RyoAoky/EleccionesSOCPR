(function poblarcampos() {
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;

    let nuncom = document.getElementById('nuncom');

    let fc = document.getElementById('inpfc');
    let fr = document.getElementById('inpfr');
    let pa = document.getElementById('inppa');
    let sato2 = document.getElementById('inpsato2');
    let peso = document.getElementById('inppeso');
    let talla = document.getElementById('inptalla');
    let imc = document.getElementById('inpimc');
    let peab = document.getElementById('inppeab');
    let temp = document.getElementById('inptemp');
    let doc_adic_id = document.getElementById('doc_adic_id');

    let codcie101 = document.getElementById('1codcie10');
    let codcie10desc1 = document.getElementById('1codcie10desc');
    let codcie10comen1 = document.getElementById('1codcie10comen');
    let codcie102 = document.getElementById('2codcie10');
    let codcie10desc2 = document.getElementById('2codcie10desc');
    let codcie10comen2 = document.getElementById('2codcie10comen');
    let codcie103 = document.getElementById('3codcie10');
    let codcie10desc3 = document.getElementById('3codcie10desc');
    let codcie10comen3 = document.getElementById('3codcie10comen');

    let recomendacion1 = document.getElementById('recomendacion1');
    let control1 = document.getElementById('control1');
    let recomendacion2 = document.getElementById('recomendacion2');
    let control2 = document.getElementById('control2');
    let recomendacion3 = document.getElementById('recomendacion3');
    let control3 = document.getElementById('control3');
    $.ajax({
        url: '/resultsignosvitales',
        method: "GET",
        data: {
            cita_id: cita_id,
            soexa: soexa
        },
        success: function (result) {
            if (result[0].mensaje != 'sin datos') {
                nuncom.value = result[0].nuncom;
                fc.value = result[0].fc;
                fr.value = result[0].fr;
                pa.value = result[0].pa;
                sato2.value = result[0].SATO2;
                peso.value = result[0].peso;
                talla.value = result[0].talla;
                imc.value = result[0].imc;
                peab.value = result[0].pead;
                temp.value = result[0].temp;
                doc_adic_id.value = result[0].doc_adic_id;
                if (result[0].doc_adic_id != '0') {
                    resultcrearMiniatura(result[0].nomarch);
                }
                if (result[0].diagnosticos) {
                    let diagnosticosArray = JSON.parse(result[0].diagnosticos);
                    for (let i = 0; i < diagnosticosArray.length && i < 3; i++) {
                        let registro = diagnosticosArray[i];
                        let codigo = registro.diacod;
                        let descripcion = registro.diades;
                        let comentario = registro.obs;
                        let combo = registro.tipdia;

                        if (i === 0) {
                            codcie101.value = codigo;
                            codcie10desc1.value = descripcion;
                            combocie101.value = combo;
                            codcie10comen1.value = comentario;
                        } else if (i === 1) {
                            codcie102.value = codigo;
                            codcie10desc2.value = descripcion;
                            combocie102.value = combo;
                            codcie10comen2.value = comentario;
                        } else if (i === 2) {
                            codcie103.value = codigo;
                            codcie10desc3.value = descripcion;
                            combocie103.value = combo;
                            codcie10comen3.value = comentario;
                        }
                    }
                }
                if (result[0].recomendaciones) {
                    let recomendacionArray = JSON.parse(result[0].recomendaciones);
                    for (let i = 0; i < recomendacionArray.length && i < 3; i++) {
                        let registro = recomendacionArray[i];
                        let desrec = registro.desrec;
                        let des_control = registro.des_control;

                        if (i === 0) {
                            recomendacion1.value = desrec;
                            control1.value = des_control;
                        } else if (i === 1) {
                            recomendacion2.value = desrec;
                            control2.value = des_control;
                        } else if (i === 2) {
                            recomendacion3.value = desrec;
                            control3.value = des_control;
                        }
                    }
                }
            }
        },
        error: function (Examenes) {
            alert('error');
        }
    });
})();

function calcularIMC() {
    const inppeso = document.getElementById('inppeso');
    const inptalla = document.getElementById('inptalla');
    const inpimc = document.getElementById('inpimc');

    // Verificar si ambos inputs contienen valor
    if (inppeso.value !== '' && inptalla.value !== '') {
        // Realizar el cálculo
        const valor1 = parseFloat(inppeso.value);
        const valor2 = parseFloat(inptalla.value);

        const resultadoCalculado = valor1 / (valor2 * valor2);

        // Mostrar el resultado en el input
        inpimc.value = resultadoCalculado.toFixed(2);
    } else {
        // Si alguno de los inputs está vacío, borra el resultado
        inpimc.value = '';
    }
}

function Grabar() {
    let btnGrabar = document.getElementById('btnGrabar');
    btnGrabar.disabled = true;
    btnGrabar.innerHTML = `<lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
                                    speed="1" style="width: 38px; height: 35px;" loop
                                    autoplay></lottie-player>`
    let incluirIds = 'inpfc,inpfr,inppa,inpsato2,inppeso,inptalla,inpimc,inppeab,inptemp';
    let cita_id = document.getElementById('id').value;
    let nuncom = document.getElementById('nuncom').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    let fc = document.getElementById('inpfc').value;
    let fr = document.getElementById('inpfr').value;
    let pa = document.getElementById('inppa').value;
    let sato2 = document.getElementById('inpsato2').value;
    let peso = document.getElementById('inppeso').value;
    let talla = document.getElementById('inptalla').value;
    let imc = document.getElementById('inpimc').value;
    let peab = document.getElementById('inppeab').value;
    let temp = document.getElementById('inptemp').value;
    let doc_adic_id = document.getElementById('doc_adic_id').value;
    
    validarFormulario2(incluirIds);
    if (!cita_id || !fc || !fr || !pa || !sato2 || !peso || !talla || !imc || !peab || !temp) {
        btnGrabar.disabled = false;
        mensaje('error', 'Por favor, complete todos los campos antes de continuar.', 1500);
        btnGrabar.innerHTML = `<i class="fa-regular fa-floppy-disk" style="margin: 8px 12px;">`
        return;
    } else {
        var datains = obtenerDataIns();
        var datainsrec = obtenerDataInsRec();
        const datosCompletos = {
            cita_id: cita_id,
            nuncom: nuncom,
            soexa: soexa,
            codpru_id: codpru_id,
            fc: fc,
            fr: fr,
            pa: pa,
            sato2: sato2,
            peso: peso,
            talla: talla,
            imc: imc,
            peab: peab,
            temp: temp,
            datains: datains,
            doc_adic_id: doc_adic_id,
            datainsrec: datainsrec
        };

        fetch('/pbsignosvitales', {
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
				getPacienteExamen();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}
function getPacienteExamen() {
    const id = document.getElementById('id').value;
    var formElements = {
        fecaten: document.getElementById('fecaten'),
        dni: document.getElementById('dni'),
        nombres: document.getElementById('nombres'),
        fecnac: document.getElementById('fecnac'),
        edad: document.getElementById('edad'),
        sexo: document.getElementById('sexo'),
        empresa: document.getElementById('empresa'),
        tipoexamen: document.getElementById('tipoexamen'),
        protocolo: document.getElementById('protocolo'),
        area: document.getElementById('area'),
        fc: document.getElementById('fc'),
        pa: document.getElementById('pa'),
        fr: document.getElementById('fr'),
        sato2: document.getElementById('sato2'),
        talla: document.getElementById('talla'),
        peso: document.getElementById('peso'),
        imc: document.getElementById('imc')
    }
    $.ajax({
        url: '/pacienteexamen/' + id,
        method: "GET",
        success: function (paciente) {
            var data = paciente[0];
            formElements.fecaten.value = new Date(data.fecprocita).toISOString().split('T')[0];
            formElements.dni.value = data.numdoc;
            formElements.nombres.value = data.appm_nom;
            formElements.fecnac.value = new Date(data.fecnac).toISOString().split('T')[0];
            formElements.edad.value = data.Edad;
            formElements.sexo.value = data.des_sexo;
            formElements.empresa.value = data.razsoc;
            formElements.tipoexamen.value = data.desexa;
            formElements.protocolo.value = data.nompro;
            formElements.area.value = data.area_actual;
            formElements.fc.value = data.fc;
            formElements.pa.value = data.pa;
            formElements.fr.value = data.fr;
            formElements.sato2.value = data.SATO2;
            formElements.talla.value = data.talla;
            formElements.peso.value = data.peso;
            formElements.imc.value = data.imc;
        },
        error: function () {
            $('#error-message').text('Se produjo un error al cargar los protocolos.');
        }
    });
}