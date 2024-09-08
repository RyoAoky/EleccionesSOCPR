$(document).ready(function () {
  //fechahoy('fechainicio');
  //fechahoy('fechafin');
  var fechaActual = new Date().toISOString().split('T')[0];
  var fechaActual = new Date().toISOString().split('T')[0];
  $("#fechainicio").val(fechaActual);
  $("#fechafin").val(fechaActual);
  getExamen();

  document.getElementById("paciente").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      getPacientesCitados();
    }
  });

});
function getPacientesCitados() {
  mostrarDiv('carga');
  ocultarTabla('mydatatable');
  let fechainicio = $('#fechainicio').val();
  let fechafin = $('#fechafin').val();
  let paciente = $('#paciente').val();
  let estado = $('#estado').val();
  let examen = $('#examen').val();
  let cliente = $('#cli_id').val();//empresa
  let protocolo = $('#codpro_id').val();
  $.ajax({
    url: '/pacientescitadoslist',
    method: "GET",
    data: {
      fechainicio: fechainicio,
      fechafin: fechafin,
      paciente: paciente,
      estado: estado,
      examen: examen,
      cliente: cliente,
      protocolo: protocolo
    },
    success: function (Pacientes) {
      ocultarDiv('carga');
      mostrarTabla('mydatatable');
      let tablebody = $('#bodyCitas');
      tablebody.html('');
      if (Pacientes.length === 0) {
        tablebody.append(`
            <tr>
              <td colspan="8">No hay pacientes con los filtros proporcionados</td>
            </tr>
          `);
      } else {
        Pacientes.forEach(Paciente => {
          tablebody.append(`
              <tr>
              <td style="vertical-align: middle;" class="text-left">${Paciente.FECHADECITA}</td>
              <td style="vertical-align: middle;" class="text-left">${Paciente.PACIENTE}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.EDAD}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.CLIENTE}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.TIPOEX}</td>
                <td style="vertical-align: middle;" class="text-left">${Paciente.HADM}</td>
                <td class="text-center"><a style="color:white;background-color: cornflowerblue;" type="submit" href="${Paciente.RUTA}"  class="btn btn-circle btn-sm btn" target="_blank"><i class="fa-solid fa-file-lines"></i></a></td>
                <td><button style="color:white;background-color: cornflowerblue;" class="btn btn-circle btn-sm btn" onclick="RecordExamenes(${Paciente.cita_id})"><i class="fa-solid fa-ellipsis-vertical"></i></button></td>               
              </tr>
            `);
        });
        mensaje(Pacientes[0].ICONO, Pacientes[0].MENSAJE, 1500);

      }
    },
    error: function () {
      $('#error-message').text('Se produjo un error al cargar los pacientes citados.');
    }
  });
}

function getExamen() {
  $.ajax({
    url: '/cmbexamen',
    method: "GET",
    success: function (Examenes) {
      let combo = $('#examen');
      combo.html('');
      combo.append(`<option value="%">Todos</option>`);
      Examenes.forEach(Examen => {
        combo.append(`<option value="${Examen.desexa}">${Examen.desexa}</option>
    `);
      });
      getPacientesCitados()
    },
    error: function (Examenes) {
      alert('error');
    }
  });
}
document.getElementById("empresamodal").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    getclientes();
  }
});
function getclientes() {
  let parametro = $('#empresamodal').val();
  mostrarDiv('cargaEmpresa');
  ocultarDiv('tableEmpresamodal');
  $.ajax({
    url: '/empresas',
    method: 'GET',
    data: {
      empresa: parametro,
    },
    success: function (clientes) {
      ocultarDiv('cargaEmpresa');
      mostrarDiv('tableEmpresamodal');
      const tbodycli = $('#bodyEmpresa');
      tbodycli.empty();
      if (clientes.length === 0) {
        tbodycli.append(`
                  <tr>
                      <td colspan="3" class="text-center">No hay resultados disponibles </td>
                  </tr>
              `);
      } else {
        clientes.forEach(cliente => {
          tbodycli.append(`
                      <tr>  
                          <td>
                              <button onclick="getempresam('${cliente.razsoc}','${cliente.cli_id}')" class="btn btn-info btn-circle btn-sm"><i class="fa-solid fa-plus"></i></button>              
                          </td>           
                          <td>${cliente.razsoc}</td>
                          <td>${cliente.NumDoc}</td>                        
                      </tr>
                  `);
        });

      }
    },
    error: function () {
      alert('Error en la solicitud AJAX');
    },
  });
}
function getempresam(razsoc, cli_id) {
  $('#razsoc').val(razsoc);
  $('#cli_id').val(cli_id);
  //$('#modalFormEmpresa [data-dismiss="modal"]').trigger('click');
  getprotocolo(cli_id);
  var btncerrar = document.getElementById(`cerrarClienteModal`);
  btncerrar.click();
  event.preventDefault();
}
function getprotocolo(parametro) {
  $.ajax({
    url: '/listarprotocolo',
    method: 'GET',
    data: {
      parametro: parametro,
    },
    success: function (lista) {
      let codpro_id = $('#codpro_id');
      codpro_id.html('');
      if (lista.length === 0) {
        let defaultOption = '<option value=""></option>';
        codpro_id.append(defaultOption);
      } else {
        let option = `<option value="%">TODOS</option>`;
        codpro_id.append(option);
        lista.forEach(item => {
          let option = `<option value="${item.id}">${item.descripcion}</option>`;
          codpro_id.append(option);
        });

      }

    },
    error: function () {
      alert('Error en la solicitud AJAX');
    },
  });
}
function RecordExamenes(cita_id) {
  ocultarDiv('tablapacientemodal');
  mostrarDiv('cargaRecord');
  $('#modalFormExamenes').modal('show');
  $.ajax({
    url: '/recordexamenes',
    method: 'GET',
    data: {
      cita_id: cita_id,
    },
    success: function (result) {
      ocultarDiv('cargaRecord');
      mostrarDiv('tablapacientemodal');
      const tbodypac = $('#bodypacientemodal');
      tbodypac.empty();

      if(result.length === 0){
        tbodypac.append(`
          <tr>
              <td colspan="2" class="text-center">No hay resultados disponibles </td>
          </tr>
      `);
      }
      else{
        for (let i = 0; i < result.length; i++) {
          let nombreExamen = result[i].desexadet;
          let estadoExamen = result[i].estado;
          let estadoText = '';
          let color = '';
          let letra = '';
          switch (estadoExamen) {
            case 'A':
              estadoText = 'En proceso';
              color = '#1FBDE2'
              letra = 'white';
              break;
            case 'P':
              estadoText = 'Pendiente';
              color = '#FF9E0D'
              letra = 'white';
              break;
            case 'C':
              estadoText = 'Concluido';
              color = '#2FC458'
              letra = 'white';
              break;
            case 'X':
              estadoText = 'Cerrado';
              color = '#8A8688'
              letra = 'white';
              break;
            case 'N':
              estadoText = 'Cancelado';
              color = '#FF1111'
              letra = 'white';
              break;
          }
          tbodypac.append(`
            <tr>         
                <td>${nombreExamen}</td>
                <td class="text-center"><span class="badge estado" style="background-color:${color}; color:${letra}; font-size:90%">${estadoText}</span></td> 
            </tr>
        `);
        }
      }
    },
    error: function () {
      console.log('Error en la solicitud AJAX');
    },
  });
}