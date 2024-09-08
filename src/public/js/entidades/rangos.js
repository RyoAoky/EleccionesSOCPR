$(document).ready(function () {
    $('#rango_ini, #rango_fin').inputmask("currency", {
        radixPoint: '.',
        inputtype: "text",
        allowMinus: false,
        autoUnmask: true,
        placeholder: "00.000",
        showMaskOnHover: true,
        scale: 3,
        integerDigits: 9,
        digits: 3, // Add this line to allow 3 decimal places

    });
    $("#edad_inicio, #edad_fin").inputmask("numeric", {
        rightAlign: false,
        value: 18,
        max: 100,
        radixPoint: "",
        allowMinus: false,
        allowPlus: false
    });
});

function GetPruebaExamen() {
    var parametro = $("#examenmodal").val();
    mostrarDiv("cargaExamen");
    ocultarDiv("tableExamenmodal");
    $.ajax({
        url: "/listarpruebas",
        method: "GET",
        data: {
            parametro: parametro,
        },
        success: function (examenes) {
            ocultarDiv("cargaExamen");
            mostrarDiv("tableExamenmodal");
            const tbodycli = $("#bodyExamen");
            tbodycli.empty();
            if (examenes.length === 0) {
                tbodycli.append(`
            <tr class="text-center">
              <td colspan="2">No hay resultados disponibles</td>
            </tr>
          `);
            } else {
                examenes.forEach((examen) => {
                    tbodycli.append(`
                            <tr>
                                <td>${examen.desexadet}</td>
                                <td class = "text-center">
                                    <button class="btn btn-info btn-circle btn-sm" onclick="event.preventDefault(); getExamen('${examen.codpru_id}', '${examen.desexadet}');"><i class="fa-solid fa-plus"></i></button>
                                </td>
                            </tr>
                    `);
                });
                mensaje(examenes[0].icono, examenes[0].mensaje, 1500);
            }
        },
        error: function () {
            alert("Error en la solicitud AJAX");
        },
    });
}
function getExamen(codpru_id, desexadet) {
    $("#desexadet").val(desexadet);
    $("#codpru_id").val(codpru_id);
    GetParametroExamen(codpru_id);
    var btncerrar = document.getElementById(`cerrarExamenModal`);
    btncerrar.click();
}
document.getElementById("examenmodal").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        GetPruebaExamen();
    }
});

//Lista la tabla de parametros
function GetParametroExamen(codpru_id) {
    let parametro = ''
    ocultarDiv("tableparexa")
    mostrarDiv("cargaparexa");
    $.ajax({
        url: "/listarparametros",
        method: "GET",
        data: {
            parametro: parametro,
            codpru_id: codpru_id,
        },
        success: function (examenes) {
            ocultarDiv("cargaparexa");
            mostrarDiv("tableparexa");
            const tbodycli = $("#tbodyParametro");
            tbodycli.empty();
            if (examenes.length === 0) {
                tbodycli.append(`
            <tr class="text-center">
              <td colspan="2">No hay resultados disponibles</td>
            </tr>
          `);
            } else {
                examenes.forEach((examen) => {
                    tbodycli.append(`
                            <tr>
                                <td>${examen.despar}</td>
                                <td>
                                    <button onclick="getRangos('${examen.parexa_id}', '${examen.despar}');" class="btn btn-circle btn-sm btn-info mr-1"><i class="fas fa-align-justify"></i></button>
                                </td>
                            </tr>
                    `);
                });
                mensaje(examenes[0].icono, examenes[0].mensaje, 1500);
            }
        },
        error: function () {
            alert("Error en la solicitud AJAX");
        },
    });
}
//Listar tabla de rangos
function getRangos(parexa_id, despar) {
    let parametro = 0;
    $("#parexa_id").val(parexa_id);
    let codpru_id = $("#codpru_id").val();
    $("#despar").val(despar);
    mostrarDiv('cargaRangos');
    ocultarDiv('tableRangos');
    ocultarDiv("btnNuevoRango");
    $.ajax({
        url: '/listarrangos',
        method: 'GET',
        data: {
            parametro: parametro,
            codpru_id: codpru_id,
            parexa_id: parexa_id,
        },
        success: function (rangos) {
            $('#tituloRegistro').text('Registro de Rango de Referencia de ' + despar);
            comboUnidadAndSexo();
            ocultarDiv('cargaRangos');
            mostrarDiv('btnNuevoRango');
            mostrarDiv('tableRangos');

            const tbody = $('#tbodyRangos');
            tbody.empty();
            if (rangos.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="9" class="text-center" id>No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                rangos.forEach(rango => {
                    tbody.append(`
                        <tr data-id="${rango.ran_id}">
                            <td>${rango.edad_inicio}</td>
                            <td>${rango.edad_fin}</td>
                            <td>${rango.desabrv}</td>
                            <td>${rango.Rango}</td>
                            <td>${rango.sta_rango_normal}</td>
                            <td>${rango.desrango}</td>
                            <td>${rango.valor_ref}</td> 
                            <td>${rango.metodo}</td>
                            <td>
                                <button class="btn btn-circle btn-sm btn-warning mr-1" onclick="poblarcampos(${rango.ran_id});" data-toggle="modal"
                                data-target="#modalRegistroRango"><i class="fa-solid fa-pencil-alt"></i></button>
                            </td>
                        </tr>
                    `);
                });
                mensaje(rangos[0].icono, rangos[0].mensaje, 1500);
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
            ocultarDiv('cargaRangos');
        },
    });
}
function CambiarTitutlo(accion) {
    // Selecciona todos los elementos <input> en el documento
    var inputs = document.getElementsByTagName('input');
    // Itera sobre todos los elementos <input> y remueve la clase especificada
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].classList.remove('is-valid', 'is-invalid');
    }
    let titleMFormatos = document.getElementById('titleMFormatos');
    let inputid = document.getElementById('inputid');
    if (accion === 'Grabar') {
        LimpiarInputModal();
        $('#codlabuni_id').val('0');
        $('#sexo_id').val('1');
        titleMFormatos.textContent = 'Nuevo de Rango de Referencia';
        inputid.value = '0';
    } else if (accion === 'Editar') {
        titleMFormatos.textContent = 'Edición de Rango de Referencia';
    }
}
function LimpiarInputModal() {
    $("#rango_ini").val('');
    $("#rango_fin").val('');
    $("#edad_inicio").val('');
    $("#edad_fin").val('');
    $("#desrango").val('');
    $("#sta_rango_normal").val('S');
    $("#valor_ref").val('');
    $("#metodo").val('');
}

async function comboUnidadAndSexo() {
    $.ajax({
        url: '/listarunidadesandsexo',
        success: function (lista) {
            let codlabuni_id = $('#codlabuni_id'); // Selecionar el select de unidad
            let sexo = $('#sexo_id'); // Selecionar el select de sexo
            codlabuni_id.html('');
            sexo.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'Unidad') {
                    codlabuni_id.append(option);
                }
                if (item.tabla === 'Sexo') {
                    sexo.append(option);
                }
            });
        },
        error: function () {
            alert('error');
        }
    });
}
//Listar edicición
async function poblarcampos(ran_id) {
    CambiarTitutlo('Editar');
    $("#inputid").val(ran_id);
    let codpru_id = 0;
    let parexa_id = 0;
    $.ajax({
        url: '/listarrangos',
        method: 'GET',
        data: {
            parametro: ran_id,
            codpru_id: codpru_id,
            parexa_id: parexa_id,
        },
        success: function (data) {
            $("#codlabuni_id").val(data[0].codlabuni_id);
            $("#sexo_id").val(data[0].sexo_id);
            $("#rango_ini").val(data[0].rango_ini);
            $("#rango_fin").val(data[0].rango_fin);
            $("#edad_inicio").val(data[0].edad_inicio);
            $("#edad_fin").val(data[0].edad_fin);
            $("#desrango").val(data[0].desrango);
            $("#sta_rango_normal").val(data[0].sta_rango_normal);
            $("#valor_ref").val(data[0].valor_ref);
            $("#metodo").val(data[0].metodo);
            mensaje(data[0].icono, data[0].mensaje, 1500);
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

function validarInputsAlMenosUno(ids) {
    var idsArray = ids.split(',');
    var alMenosUnoLleno = false;
    idsArray.forEach(function (id) {
        var input = document.getElementById(id.trim());
        if (input) {
            input.classList.remove('is-valid', 'is-invalid');
            if (input.value.trim() !== '') {
                input.classList.add('is-valid'); // Input válido
                alMenosUnoLleno = true;
            } else {
                input.classList.add('is-invalid'); // Input inválido
            }
        }
    });
    if (!alMenosUnoLleno) {
        mensaje('error', 'Por favor, complete al menos uno de los campos.', 1800);
        return false;
    } else {
        idsArray.forEach(function (id) {
            var input = document.getElementById(id.trim());
            if (input) {
                input.classList.remove('is-invalid'); // Quitar clase 'is-invalid' a los demás inputs
            }
        });
    }
    return true;
}
function GrabarRango() {
    var camposValidos = validarInputsAlMenosUno('rango_ini,rango_fin,edad_inicio,edad_fin, desrango, valor_ref');
    if (!camposValidos) {
        return;
    }
    var btnGrabar = document.getElementById("btnGrabar");
    btnGrabar.disabled = true;

    let inputid = $("#inputid").val();
    let codpru_id = $("#codpru_id").val();
    let parexa_id = $("#parexa_id").val();
    let codlabuni_id = $("#codlabuni_id").val();
    let sexo_id = $("#sexo_id").val();
    let rango_ini = $("#rango_ini").val();
    let rango_fin = $("#rango_fin").val();
    let edad_inicio = $("#edad_inicio").val();
    let edad_fin = $("#edad_fin").val();
    let desrango = $("#desrango").val();
    let sta_rango_normal = $("#sta_rango_normal").val();
    let valor_ref = $("#valor_ref").val();
    let metodo = $("#metodo").val();
    $.ajax({
        url: '/rangos',
        method: 'POST',
        data: {
            inputid: inputid,
            codpru_id: codpru_id,
            parexa_id: parexa_id,
            codlabuni_id: codlabuni_id,
            sexo_id: sexo_id,
            rango_ini: rango_ini,
            rango_fin: rango_fin,
            edad_inicio: edad_inicio,
            edad_fin: edad_fin,
            desrango: desrango,
            sta_rango_normal: sta_rango_normal,
            valor_ref: valor_ref,
            metodo: metodo,
        },
        success: function (data) {
            mensaje(data[0].icono, data[0].mensaje, 1500);
            btnGrabar.disabled = false;
			var btncerrar = document.getElementById(`btnCerrar`);
            btncerrar.click();

            let parexa_id = $("#parexa_id").val();
            let despar = $("#despar").val();
            setTimeout(function() {
                getRangos(parexa_id, despar);
            }, 1500);
            /*if (inputid === '0') {
                agregarNuevaFila(data[0].UltimoID);
            } else {
                editarFila();
            }*/
        },
        error: function () {
            alert('Error en la solicitud AJAX');
            btnGrabar.disabled = false;
        },
    });
}

function agregarNuevaFila(ran_id) {
    var codlabuni_idSelect = document.getElementById('codlabuni_id');
    var codlabuni_id = codlabuni_idSelect.value;
    var codlabuni_idText = codlabuni_idSelect.options[codlabuni_idSelect.selectedIndex].text;
    var sexo_idSelect = document.getElementById('sexo_id');
    var sexo_id = sexo_idSelect.value;
    var sexo_idText = sexo_idSelect.options[sexo_idSelect.selectedIndex].text;
    var rango_ini = $("#rango_ini").val();
    var rango_fin = $("#rango_fin").val();
    var edad_inicio = $("#edad_inicio").val();
    var edad_fin = $("#edad_fin").val();
    var sta_rango_normalSelect = document.getElementById('sta_rango_normal');
    var sta_rango_normal = sta_rango_normalSelect.value;
    var sta_rango_normalText = sta_rango_normalSelect.options[sta_rango_normalSelect.selectedIndex].text;
    var desrango = $("#desrango").val();
    var valor_ref = $("#valor_ref").val();
    var metodo = $("#metodo").val();

    var tbody = document.getElementById('tbodyRangos');
    var nuevaFila = tbody.insertRow(-1);

    nuevaFila.setAttribute('data-id', ran_id);
    nuevaFila.insertCell(0).textContent = edad_inicio;
    nuevaFila.insertCell(1).textContent = edad_fin;
    nuevaFila.insertCell(2).innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + codlabuni_id + '">' + codlabuni_idText;
    nuevaFila.insertCell(3).innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + sexo_id + '">' + sexo_idText + ' ' + rango_ini + ' - ' + rango_fin;
    nuevaFila.insertCell(4).innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + sta_rango_normal + '">' + sta_rango_normalText;
    nuevaFila.insertCell(5).textContent = desrango;
    nuevaFila.insertCell(6).textContent = valor_ref;
    nuevaFila.insertCell(7).textContent = metodo;
    nuevaFila.insertCell(8).innerHTML = '<button class="btn btn-circle btn-sm btn-warning mr-1" type="button" onclick="poblarcampos(' + ran_id + ');" data-toggle="modal"  data-target="#modalRegistroRango"><i class="fa-solid fa-pencil-alt"></i></button>';
}
function editarFila() {
    var filaEditable = document.getElementById('tbodyRangos').querySelector('tr[data-id="' + $("#inputid").val() + '"]');
    var codlabuni_id = $("#codlabuni_id").val();
    var sexo_id = $("#sexo_id").val();
    var rango_ini = $("#rango_ini").val();
    var rango_fin = $("#rango_fin").val();
    var sta_rango_normal = $("#sta_rango_normal").val();

    filaEditable.cells[0].textContent = $("#edad_inicio").val();
    filaEditable.cells[1].textContent = $("#edad_fin").val();
    filaEditable.cells[2].innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + codlabuni_id + '">' + $("#codlabuni_id option:selected").text();
    filaEditable.cells[3].innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + sexo_id + '">' + $("#sexo_id option:selected").text() + ' ' + rango_ini + ' - ' + rango_fin;
    filaEditable.cells[4].innerHTML = '<input type="hidden" name="esp_id_hidden" value="' + sta_rango_normal + '">' + $("#sta_rango_normal option:selected").text();
    filaEditable.cells[5].textContent = $("#desrango").val();
    filaEditable.cells[6].textContent = $("#valor_ref").val();
    filaEditable.cells[7].textContent = $("#metodo").val();
}