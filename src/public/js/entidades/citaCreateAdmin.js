$(document).ready(function () {
    getPacienteCombos();
    $('#fecprocitaTime').clockTimePicker({
        duration: true,
        durationNegative: false,
        alwaysSelectHoursFirst: true,
        afternoonHoursInOuterCircle: true,
        //precision: 10,
        required: true,
        i18n: {
            cancelButton: 'Abbrechen'
        },
        onAdjust: function (newVal, oldVal) {
        }
    });
});

function getcitas(id) {
    let fecini = '';//fecha inicio
    let fecfin = '';//fecha fin
    let paciente = '';//busqueda por dni o nombre
    let parametro3 = '';//estados
    let parametro4 = '';//protocolo
    let parametro5 = '';//checked por auditar
    let parametro6 = '';
    parametro6 = id;

    $.ajax({
        url: '/listarcitas',
        method: 'GET',
        data: {
            fecini: fecini,
            fecfin: fecfin,
            paciente: paciente,
            parametro3: parametro3,
            parametro4: parametro4,
            parametro5: parametro5,
            parametro6: parametro6
        },
        success: function (citas) {
            $('#razsoc').val(citas[0].razsoc);
            $('#nompro').val(citas[0].nompro);
            $('#desexa').val(citas[0].desexa); //tiene que mostrar el nombre, no el id
            $('#appm_nom').val(citas[0].appm_nom);
            $('#fecprocitaDate').val(citas[0].fecprocitaDate);
            $('#fecprocitaTime').val(citas[0].fecprocitaTime);
            $('#obscita').val(citas[0].obscita);
            $('#cargo_actual').val(citas[0].cargo_actual);
            $('#fecing_cargo').val(citas[0].fecing_cargo);
            $('#area_actual').val(citas[0].area_actual);
            $('#fecing_area').val(citas[0].fecing_area);
            $('#fecing_empresa').val(citas[0].fecing_empresa);
            $('#altilab_id').val(citas[0].altilab_id);
            $('#superf_id').val(citas[0].superf_id);
            $('#tipseg_id').val(citas[0].tipseg_id);
            $('input[name="cond_vehiculo"][value="' + citas[0].cond_vehiculo + '"]').prop('checked', true);
            $('input[name="ope_equipo_pesado"][value="' + citas[0].ope_equipo_pesado + '"]').prop('checked', true);
            $('input[name="envresult_correo"][value="' + citas[0].envresult_correo + '"]').prop('checked', true);
            $('input[name="com_info_medica"][value="' + citas[0].com_info_medica + '"]').prop('checked', true);
            $('input[name="ent_result_fisico"][value="' + citas[0].ent_result_fisico + '"]').prop('checked', true);
            $('input[name="usa_firma_formatos"][value="' + citas[0].usa_firma_formatos + '"]').prop('checked', true);
            $('input[name="res_lugar_trabajo"][value="' + citas[0].res_lugar_trabajo + '"]').prop('checked', true);
            mensaje(citas[0].tipo, citas[0].response, 1500);
        },
        error: function () {
            console.error('Error en la solicitud AJAX');
        },
    });
}
function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosCitas',
        success: function (lista) {

            let altilab_id = $('#altilab_id'); // Selecionar el select de altitud
            let superf_id = $('#superf_id'); // Selecionar el select superficie
            let tipseg_id = $('#tipseg_id'); // Selecionar el select de tipo de seguro
            altilab_id.html('');
            superf_id.html('');
            tipseg_id.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;//sirve para que liste todos los combo
                if (item.tabla === 'altitud_labor') {
                    //altitud_labor
                    altilab_id.append(option); //Hace que liste el combo
                } else if (item.tabla === 'superficie') {
                    superf_id.append(option);
                } else if (item.tabla === 'tipo_seguros') {
                    tipseg_id.append(option);
                }
            });
            const id = document.getElementById("inputid").value;
            getcitas(id);
        },
        error: function () {
            alert('error');
        }
    });
}
function Grabar() {
    var btnCita = document.getElementById("btnCita");
    btnCita.disabled = true;
    let inputid = $('#inputid');
    let cargo_actual = $('#cargo_actual');
    let fecing_cargo = $('#fecing_cargo');
    let area_actual = $('#area_actual');
    let fecing_area = $('#fecing_area');
    let fecing_empresa = $('#fecing_empresa');
    let altilab_id = $('#altilab_id');
    let superf_id = $('#superf_id');
    let tipseg_id = $('#tipseg_id');
    let cond_vehiculo = document.querySelector("input[name='cond_vehiculo']:checked").value;
    let ope_equipo_pesado = document.querySelector("input[name='ope_equipo_pesado']:checked").value;
    let envresult_correo = document.querySelector("input[name='envresult_correo']:checked").value;
    let com_info_medica = document.querySelector("input[name='com_info_medica']:checked").value;
    let ent_result_fisico = document.querySelector("input[name='ent_result_fisico']:checked").value;
    let usa_firma_formatos = document.querySelector("input[name='usa_firma_formatos']:checked").value;
    let res_lugar_trabajo = document.querySelector("input[name='res_lugar_trabajo']:checked").value;
    $.ajax({
        url: '/citaAdmin',
        method: "POST",
        data: {
            inputid: inputid.val(),
            cargo_actual: cargo_actual.val(),
            fecing_cargo: fecing_cargo.val(),
            area_actual: area_actual.val(),
            fecing_area: fecing_area.val(),
            fecing_empresa: fecing_empresa.val(),
            altilab_id: altilab_id.val(),
            superf_id: superf_id.val(),
            tipseg_id: tipseg_id.val(),
            cond_vehiculo: cond_vehiculo,
            ope_equipo_pesado: ope_equipo_pesado,
            envresult_correo: envresult_correo,
            com_info_medica: com_info_medica,
            ent_result_fisico: ent_result_fisico,
            usa_firma_formatos: usa_firma_formatos,
            res_lugar_trabajo: res_lugar_trabajo,
        },
        success: function (response) {
            btnCita.disabled = false;
            opc = 0;
            if (response[0].tipo === 'success') {
                MensajeSIyNO(response[0].tipo, response[0].mensaje, '¿Desea volver?', function (respuesta) {
                    if (respuesta) {
                        $('input[type="text"]').val("");
                        rendersub('/cita');
                    } else {
						console.log(response[0].inputid)
                        $('#inputid').val(response[0].inputid);
                        return;
                    }
                });
            } else {
                btnCita.disabled = false;
                mensaje(response[0].tipo, response[0].mensaje, 1500);
            }
        },
        error: function (error) {
            mensaje('error', 'Error al guardar, intente nuevamente ' + error, 1500);
            btnCita.disabled = false;
        }
    });
}


