/*document.addEventListener('contextmenu', function (event) {
  var target = event.target;
  if (target.tagName === 'A') {
    event.preventDefault();
    alert("Acceso no permitido en nueva pestaña.");
  }
});*/

function render() {
  const contentContainer = $('#contenedoropciones');
  const loadingHtml = `
  <div class="jm-loadingpage">
      <lottie-player src="/img/jsonimg/loadingint.json" class="" background="transparent" speed="1"
      style="width: 250px; height: 250px;" loop autoplay></lottie-player>
  </div>
  `;
  const links = $('a.opcionform');
  if (!links.data('eventAssigned')) {
    links.data('eventAssigned', true);
    links.on('click', async (e) => {
      e.preventDefault();
      const url = e.currentTarget.getAttribute('href');
      contentContainer.html(loadingHtml);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await $.ajax({
          url: url,
          method: 'GET',
        });
        contentContainer.animate({ opacity: 0 }, 1000, () => {
          contentContainer.html(response);
          contentContainer.animate({ opacity: 1 }, 500);
        });
      } catch (error) {
        console.error(error);
        // Mostrar un mensaje de error al usuario si lo deseas
        contentContainer.html(`<div class="container">
                                      <div class="row justify-content-center">
                                          <div class="col-lg-6">
                                              <div class="text-center mt-4">
                                                  <img class="mb-4 img-error" src="/img/404logo.jpg" />
                                                  <p class="lead">
                                                      Esta URL solicitada no se encontró en este servidor.</p>
                                                  <a href="/">
                                                      <i class="fas fa-arrow-left me-1"></i>
                                                      Regresar
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`);
      }

    });
  }
}

function renderprueba() {
  const contentContainer = $('#contenedoropcionesprueba');
  const loadingHtml = `
<div class="jm-loadingpage">
<lottie-player src="/img/jsonimg/loadingint.json" class="" background="transparent" speed="1"
style="width: 250px; height: 250px;" loop autoplay></lottie-player>
</div>
`;
  const links = $('a.opcionprueba');
  if (!links.data('eventAssigned')) {
    links.data('eventAssigned', true);
    links.on('click', async (e) => {
      e.preventDefault();
      const url = e.currentTarget.getAttribute('href');
      contentContainer.html(loadingHtml);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await $.ajax({
          url: url,
          method: 'GET',
        });
        contentContainer.animate({ opacity: 0 }, 1000, () => {
          contentContainer.html(response);
          contentContainer.animate({ opacity: 1 }, 500);
        });
      } catch (error) {
        console.error(error);
        // Mostrar un mensaje de error al usuario si lo deseas
        contentContainer.html(`<div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-6">
                                    <div class="text-center mt-4">
                                        <img class="mb-4 img-error" src="/img/404logo.jpg" />
                                        <p class="lead">
                                            Esta URL solicitada no se encontró en este servidor.</p>
                                        <a href="/">
                                            <i class="fas fa-arrow-left me-1"></i>
                                            Regresar
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>`);
      }

    });
  }
}

async function rendersub(ruta) {
  const contentContainer = $('#contenedoropciones');
  const loadingHtml = `
  <div class="jm-loadingpage">
      <lottie-player src="/img/jsonimg/loadingint.json" class="" background="transparent" speed="1"
      style="width: 250px; height: 250px;" loop autoplay></lottie-player>
  </div>
  `;
  /*if (window.innerWidth <= 768) {
    const sidebarToggle = document.getElementById('sidebarToggle');
    sidebarToggle.click();
  }*/
  contentContainer.html(loadingHtml);

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const response = await $.ajax({
      url: ruta,
      method: 'GET',
    });
    contentContainer.animate({ opacity: 0 }, 1000, () => {
      contentContainer.html(response);
      contentContainer.animate({ opacity: 1 }, 500);
    });
  } catch (error) {
    console.error(error);
    // Mostrar un mensaje de error al usuario si lo deseas
    contentContainer.html(`<div class="container">
                                      <div class="row justify-content-center">
                                          <div class="col-lg-6">
                                              <div class="text-center mt-4">
                                                  <img class="mb-4 img-error" src="/img/404logo.jpg" />
                                                  <p class="lead">
                                                      Esta URL solicitada no se encontró en este servidor.</p>
                                                  <a href="/">
                                                      <i class="fas fa-arrow-left me-1"></i>
                                                      Regresar
                                                  </a>
                                              </div>
                                          </div>
                                      </div>
                                  </div>`);
  }
}

function navegaredit(iddatatableble, rutaparcial) {
  var table = document.getElementById(iddatatableble);
  var rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  var seleccionados = []; // Array para almacenar los elementos checkbox seleccionados

  for (var i = 0; i < rows.length; i++) {
    var checkbox = rows[i].querySelector('input[type="checkbox"]');

    if (checkbox && checkbox.checked) {
      var id = checkbox.value.split('_')[1];
      seleccionados.push(id); // Agregar el id al array de seleccionados
    }
  }

  if (seleccionados.length === 0) {
    mensajecentral('error', 'Debes seleccionar algún registro.');
  } else if (seleccionados.length > 1) {
    mensajecentral('error', 'Debes seleccionar solo un registro.');
  } else {
    var nuevaRuta = `/${rutaparcial}/${seleccionados[0]}`;
    rendersub(nuevaRuta);
  }
}





window.addEventListener('DOMContentLoaded', event => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', event => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
    });
  }
});

function filtrosMostrarOcultar(btnId, divId) {
  try {
    let isVisible = false;

    document.getElementById(btnId).addEventListener("click", function () {
      // Si está oculto, lo mostramos; si está visible, lo ocultamos
      if (isVisible) {
        ocultarDiv(divId);
      } else {
        mostrarDiv(divId);
      }
      // Cambiamos el estado de visibilidad
      isVisible = !isVisible;
    });
  } catch (error) {

  }

}



function mensaje(icono, titulo, duracion) {
  const Toast = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: duracion,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  Toast.fire({
    icon: icono,
    title: titulo
  })
}

function mensajecentral(icono, titulo) {
  Swal.fire({
    icon: icono,
    title: titulo,
    showConfirmButton: true,
    timer: null,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    confirmButtonText: 'OK'
  });
}

function mensajecentral2(icono, titulo, mensaje) {
  Swal.fire({
    icon: icono,
    title: titulo,
    text: mensaje,
    showConfirmButton: true,
    timer: null,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
    confirmButtonText: 'OK'
  });
}

function MensajeSIyNO(icono, titulo, mensaje, callback) {
  Swal.fire({
    icon: icono,
    title: titulo,
    text: mensaje,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then((result) => {
    if (result.isConfirmed) {
      // Acción cuando el usuario hace clic en "Sí"
      callback(true);
    } else {
      // Acción cuando el usuario hace clic en "No"
      callback(false);
    }
  });
}

function fechahoy(idfecha) {
  var date = new Date();

  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  var fechaActual = `${year}-${month}-${day}`;
  document.getElementById(idfecha).setAttribute('max', fechaActual);
  document.getElementById(idfecha).value = fechaActual;
}
function fechahoy2(idfecha) { //permite poner fechas siguientes y futuras, y tambien pasados
  var date = new Date();

  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var day = String(date.getDate()).padStart(2, '0');

  var fechaActual = `${year}-${month}-${day}`;
  document.getElementById(idfecha).value = fechaActual;
}

function Maxdatemeses(id) {
  var input = document.getElementById(id);

  // Establece el atributo "max" para limitar la fecha máxima a la actual
  var today = new Date();
  var month = today.getMonth() + 1; // +1 ya que los meses comienzan en 0
  var year = today.getFullYear();
  var maxDate = year + '-' + month.toString().padStart(2, '0');
  input.setAttribute('max', maxDate);

  // Establece el valor predeterminado como el mes actual
  var defaultValue = today.toISOString().slice(0, 7); // Obtiene el año y mes en formato ISO (AAAA-MM)
  input.setAttribute('value', defaultValue);
}

function converirselectaño(id) {
  var yearSelect = document.getElementById(id);

  var selectOptions = '';
  var currentYear = new Date().getFullYear();
  for (var year = 2019; year <= currentYear; year++) {
    selectOptions += '<option value="' + year + '">' + year + '</option>';
  }

  yearSelect.innerHTML = selectOptions;
  yearSelect.value = currentYear;
}
function paginaciontabla_bk(idtabla, columna, orden) {
  var table = $(idtabla).DataTable({
    "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
    "responsive": false,
    "ordering": false, // Desactiva la ordenación de las columnas al hacer clic en los encabezados
    "language": {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Registros del _START_ al _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },
      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    "order": [[columna, orden]],
    "lengthMenu": [10, 25, 50, 100, 200, 500, 1000, 10000],
    "initComplete": function () {
      this.api().columns().every(function () {
        var that = this;
      })
    }
  });

  // Quita los iconos de ordenación de las columnas
  $(idtabla + ' th').removeClass('sorting sorting_asc sorting_desc');
}

function paginaciontabla(idtabla, columna, orden) {
  $.fn.dataTable.moment = function (format, locale) {
    var types = $.fn.dataTable.ext.type;
    types.detect.unshift(function (d) {
      return moment(d, format, locale, true).isValid() ? 'moment-' + format : null;
    });
    types.order['moment-' + format + '-pre'] = function (d) {
      return moment(d, format, locale, true).unix();
    };
  };
  $.fn.dataTable.moment('DD/MM/YYYY', 'es');
  var table = $(idtabla).DataTable({
    "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
    "responsive": false,
    "language": {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar MENU registros",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Registros del START al END de TOTAL registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de MAX registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },
      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    "order": [[columna, orden]],
    "lengthMenu": [10, 25, 50, 100, 200, 500, 1000, 10000],
    "initComplete": function () {
      this.api().columns().every(function () {
        var that = this;
        // Aquí puedes agregar lógica adicional si es necesario
      });
    }
  });
}
function paginaciontablaregistro(idtabla, columna, orden, cantreg) {
  var table = $(idtabla).DataTable({
    "dom": 'B<"float-left"i><"float-right"f>t<"float-left"l><"float-right"p><"clearfix">',
    "responsive": false,
    "language": {
      "sProcessing": "Procesando...",
      "sLengthMenu": "Mostrar _MENU_ registros por página",
      "sZeroRecords": "No se encontraron resultados",
      "sEmptyTable": "Ningún dato disponible en esta tabla",
      "sInfo": "Registros del _START_ al _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
      "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
      "sInfoPostFix": "",
      "sSearch": "Buscar:",
      "sUrl": "",
      "sInfoThousands": ",",
      "sLoadingRecords": "Cargando...",
      "oPaginate": {
        "sFirst": "Primero",
        "sLast": "Último",
        "sNext": "Siguiente",
        "sPrevious": "Anterior"
      },
      "oAria": {
        "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
      }
    },
    "order": [[columna, orden]],
    "lengthMenu": [5, 10, 25, 50, 100, 200, 500, 1000, 10000],
    "pageLength": cantreg,
    "initComplete": function () {
      this.api().columns().every(function () {
        var that = this;


      })
    }
  });
}

function limitarCaracteresNumericos(input, maxLength) {
  input.value = input.value.replace(/\D/g, '').slice(0, maxLength);
}

function LimpiarTabla(IdTabla) {
  var tabla = document.getElementById(IdTabla);
  var rowCount = tabla.rows.length;
  // Iterar sobre las filas de la tabla y eliminarlas
  for (var i = rowCount - 1; i > 0; i--) {
    tabla.deleteRow(i);
  }
}
function limpiartbodyTabla(idtbody) {
  var tbody = document.getElementById(idtbody);
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

function limpiarinputs() {
  var inputs = document.querySelectorAll('.needs-validation input');
  inputs.forEach(function (input) {
    input.value = '';
  });
}

function mostrarTabla(idtabla) {
  var tabla = document.getElementById(idtabla);
  tabla.style.display = "table";
}

function ocultarTabla(idtabla) {
  var tabla = document.getElementById(idtabla);
  tabla.style.display = "none";
}

function mostrarDiv(idDiv) {
  var div = document.getElementById(idDiv);
  div.style.display = "";
}

function ocultarDiv(idDiv) {
  var div = document.getElementById(idDiv);
  div.style.display = "none";
}

function mostraretiqueta(idetiqueta) {
  var etiqueta = document.getElementById(idetiqueta);
  etiqueta.classList.toggle("ocultaretiqueta");
}

function exportarTablaExcel(tablaId, nombreReporte) {
  var datos = obtenerDatosCompletos(tablaId);
  var workbook = XLSX.utils.book_new();
  var hoja = XLSX.utils.json_to_sheet(datos);
  XLSX.utils.book_append_sheet(workbook, hoja, "Tabla");
  var fecha = new Date().toISOString().slice(0, 10);
  var nombreArchivo = nombreReporte + "_" + fecha + ".xlsx";
  XLSX.writeFile(workbook, nombreArchivo);
}

function validarEspacios(inputId) {
  var input = document.getElementById(inputId);
  var value = input.value;

  if (value.indexOf(" ") !== -1) {
    mensaje('error', 'No se permitenespacios', 2000);
    return false;
  }
}

function quitarvalidacionformularios() {
  var forms = document.getElementsByClassName('needs-validation');
  Array.prototype.filter.call(forms, function (form) {
    form.classList.remove('was-validated');
  });
}

function removeData(myPieChart) {
  myPieChart.data.labels.pop();
  myPieChart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  myPieChart.update();
}

function agregarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = true;
}

function quitarRequired(idinput) {
  var input = document.getElementById(idinput);
  input.required = false;
}

function limpiarImput() {
  $('input:not(:radio):not(:checkbox)').val('');
  $('textarea').val('');
}

function validarFormulario(excluirIds) {
  let camposValidos = true;
  let campoFaltante = '';
  $('input, select, textarea').each(function () {
    const id = $(this).attr('id');
    if (excluirIds && excluirIds.includes(id)) {
      return true;
    }

    if (!$(this).val()) {
      camposValidos = false;
      campoFaltante = id;
      $(this).addClass('is-invalid');
    } else {
      $(this).removeClass('is-invalid');
      $(this).addClass('is-valid');
    }
  });

  if (!camposValidos) {
    mensaje('error', 'Por favor, complete todos los campos.', 1800);
    console.log('Campo faltante: ' + campoFaltante);
  }
  return camposValidos;
}




function validarFormulario2(incluirIds) {
  let camposValidos = true;
  const idsToValidate = incluirIds.split(',').map(id => id.trim());

  $('input, select, textarea').each(function () {
    const id = $(this).attr('id');

    if (idsToValidate.includes(id)) {
      if (!$(this).val()) {
        camposValidos = false;
        $(this).addClass('is-invalid');
      } else {
        $(this).removeClass('is-invalid');
        $(this).addClass('is-valid');
      }
    } else {
      $(this).removeClass('is-invalid');
    }
  });

  if (!camposValidos) {
    mensaje('error', 'Por favor, complete todos los campos.', 1800);
  }
  return camposValidos;
}


function horatime(input) {
  var horaActual = new Date().toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById(input).value = horaActual;
}

function validarNumeroDecimal(input) {
  const inputValue = input.value;
  if (!/^-?\d*\.?\d*$/.test(inputValue)) {
    input.value = inputValue.slice(0, -1);
  }
}

function validarInputs(ids) {
  var idsArray = ids.split(',');
  var camposInvalidos = false;
  idsArray.forEach(function (id) {
    var input = document.getElementById(id.trim());
    if (input) {
      input.classList.remove('is-valid', 'is-invalid');
      if (input.value.trim() !== '') {
        input.classList.add('is-valid'); // Input válido
      } else {
        input.classList.add('is-invalid'); // Input inválido
        camposInvalidos = true;
      }
    }
  });
  if (camposInvalidos) {
    mensaje('error', 'Por favor, complete todos los campos.', 1800);
    return false;
  }
  return true;
}


function limitarInput(event, maxlength) {
  var $input = $(event.target);
  var id = $input.attr('id');
  var valorData = $input.data('nombre');
  var $inputGroup = $input.closest('.input-group');
  var $container = $inputGroup.parent(); // Seleccionar el contenedor del input-group

  $input.attr('maxlength', maxlength);

  if ($input.val().length >= maxlength) {
    $input.val($input.val().slice(0, maxlength));

    var errorMessageId = id + '-error';
    var $errorMessageElement = $('#' + errorMessageId);

    if ($errorMessageElement.length === 0) {
      $errorMessageElement = $('<span>').attr('id', errorMessageId).addClass('error-message').css('font-size', '10px').css('color', '#dc3545').text(`(!) Ha llegado al límite de caracteres permitidos para ${valorData}`);
      $container.append($errorMessageElement);
    }
  } else {
    var errorMessageId = id + '-error';
    $('#' + errorMessageId).remove();
  }
}

function mascaraDocumentoIdentidad(docID, numDocID) {
  if ($(docID).val() === '07' || $(docID).val() === '00') {
    $(numDocID).val('');
    $(numDocID).inputmask("remove");
  } else {
    $(numDocID).inputmask("numeric", {
      rightAlign: false,
      digits: 0,
      digitsOptional: false,
      placeholder: '',
      allowPlus: false,
      allowMinus: false,
    });
  }
}

function ajustartextArea(textareaId) {
  var textarea = document.getElementById(textareaId);
  if (textarea) {
    textarea.style.height = "auto";
    var padding = textarea.scrollHeight - textarea.clientHeight;
    var computedStyle = window.getComputedStyle(textarea);
    var paddingTop = parseFloat(computedStyle.paddingTop);
    var paddingBottom = parseFloat(computedStyle.paddingBottom);
    padding += paddingTop + paddingBottom;
    textarea.style.height = (textarea.scrollHeight - padding) + "px";
  }
}
function ajustarAnchoDeLabels(divID) {
  var formulario = $("#" + divID);
  var labels = formulario.find(".input-group label");

  var maxWidth = 0;
  labels.each(function () {
    var labelWidth = $(this).outerWidth();
    maxWidth = Math.max(maxWidth, labelWidth);
  });
  labels.outerWidth(maxWidth);
  labels.css("justify-content", "normal");
  formulario.find('.input-group.input-group-sm').css('width', '100%');
}

function resultcrearMiniatura(jsonArchivos) {
  const miniaturasDiv = document.getElementById("miniaturas");
  const btnSubir = document.getElementById('btnSubir');
  const btnSubirCita = document.getElementById('btnSubirCita');
  const fileInput = document.getElementById('archivos');
  const btnEliminar = document.getElementById('btnEliminar');
  const btnEliminarCita = document.getElementById('btnEliminaradjcitas');
    btnSubir.setAttribute("data-json", jsonArchivos);
  btnSubirCita.setAttribute("data-json", jsonArchivos);

  miniaturasDiv.innerHTML = '';

  miniaturasDiv.style.display = "block";
  //btnSubir.disabled = true;
  //fileInput.disabled = false;
  //btnEliminar.disabled = false;
  if (jsonArchivos !== '') {
    let archivos = JSON.parse(jsonArchivos);;

    archivos.forEach(archivo => {
      const nombreArchivo = archivo.nombre;
      const ruta = archivo.ruta;

      const miniaturaDiv = document.createElement("div");
      miniaturaDiv.className = "archivo-item";
      miniaturaDiv.dataset.nombre = nombreArchivo;

      const btnEliminarMiniatura = document.createElement("button");
      btnEliminarMiniatura.type = "button";
      btnEliminarMiniatura.className = "btn-close";
      btnEliminarMiniatura.style.position = "absolute";
      btnEliminarMiniatura.style.top = "5px";
      btnEliminarMiniatura.style.right = "5px";
      btnEliminarMiniatura.style.width = "20px";
      btnEliminarMiniatura.style.height = "20px";
      btnEliminarMiniatura.style.border = "none";
      btnEliminarMiniatura.style.borderRadius = "50%";
      btnEliminarMiniatura.style.background = "red";
      btnEliminarMiniatura.style.color = "white";
      btnEliminarMiniatura.style.display = "flex";
      btnEliminarMiniatura.style.alignItems = "center";
      btnEliminarMiniatura.style.justifyContent = "center";
      btnEliminarMiniatura.innerHTML = "×";
      btnEliminarMiniatura.onclick = function () {
        miniaturasDiv.removeChild(miniaturaDiv);
        const archivosArray = archivos.filter(arch => arch.nombre !== nombreArchivo);
        const jsonArchivosActualizado = JSON.stringify(archivosArray);
        resultcrearMiniatura(jsonArchivosActualizado);
        let numero = $('#miniaturas .archivo-item').length;
        if ($('#miniaturas .archivo-item').length === 0 || numero === '0') {
          document.getElementById('btnSubir').disabled = false;
          document.getElementById('btnSubirCita').disabled = true;
          btnEliminar.disabled = true;
          btnEliminarCita.disabled = true;
        } else {
          document.getElementById('btnSubir').disabled = false;
          document.getElementById('btnSubirCita').disabled = false;
        }
      };

      miniaturaDiv.appendChild(btnEliminarMiniatura);

      let imgIcon;
      if (nombreArchivo.toLowerCase().endsWith('.pdf')) {
        imgIcon = "pdficono";
      } else if (nombreArchivo.toLowerCase().endsWith('.jpg') || nombreArchivo.toLowerCase().endsWith('.jpeg') || nombreArchivo.toLowerCase().endsWith('.png')) {
        imgIcon = "imgicono";
      } else {
        imgIcon = "imgicono";
      }

      const archivoIcono = document.createElement("a");
      archivoIcono.href = `${window.location.origin}${ruta}`;
      archivoIcono.target = "_blank";
      archivoIcono.innerHTML = `<img src="/img/${imgIcon}.webp" width="90" height="90">`;
      miniaturaDiv.appendChild(archivoIcono);

      const nombreArchivoParrafo = document.createElement("p");
      nombreArchivoParrafo.textContent = nombreArchivo;
      nombreArchivoParrafo.title = nombreArchivo;
      nombreArchivoParrafo.style.width = "90px";
      nombreArchivoParrafo.style.whiteSpace = "nowrap";
      nombreArchivoParrafo.style.overflow = "hidden";
      nombreArchivoParrafo.style.textOverflow = "ellipsis";
      miniaturaDiv.appendChild(nombreArchivoParrafo);

      miniaturasDiv.appendChild(miniaturaDiv);
    });
    document.getElementById('btnEliminaradjcitas').disabled = false;
    document.getElementById('btnEliminar').disabled = false;
  }
  fileInput.value = "";
  fileInput.disabled = false;
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
      // Aquí puedes agregar el código para cargar el contenido correspondiente a la página seleccionada
      //let ruta = rutaArchivoFormat[page - 1].ruta;
      //contenedor.innerHTML = ruta;
    }
  });
}
function mostrarContenido(contenidos, contenedorPaginacion, contenedor) {
  contenedor.innerHTML = '';
  let ContenidoArrays = mostrarDocumentos(contenidos, contenedor);
  $(contenedorPaginacion).on('click', function (event) {
    var textoActivo = $('.page-item.active .page-link').text();
    contenedor.innerHTML = ContenidoArrays[textoActivo - 1];
  });
}
String.prototype.convertirmayus = function() {
  return this.replace(/[a-z]/g, function(c) { return c.toUpperCase(); });
};