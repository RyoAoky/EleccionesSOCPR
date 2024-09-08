
$(document).ready(function () {
    getPacienteCombos();
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const originalImage = new Image();
    let originalImageSrc = '../img/fondo.png'; // Almacena la URL de la imagen original

    originalImage.onload = function () {
        drawImageOnCanvas(originalImage);
    };
    originalImage.src = originalImageSrc; // Utiliza la URL almacenada

    // Función para cargar la imagen en el canvas y mostrarla como rectamgulo
    function drawImageOnCanvas(image) {
        const width = 400; // Ancho fijo para el canvas
        const height = 150; // Altura fija para el canvas
        context.clearRect(0, 0, width, height);
        context.save();
        context.rect(0, 0, width, height);
        context.clip();
        context.drawImage(image, 0, 0, width, height);
        context.restore();
    }

    function resetCanvasWithImage(imageSrc) {
        event.preventDefault();
        const image = new Image();
        image.onload = function () {
            drawImageOnCanvas(image);
            $('#reset-btn').css('display', 'inline-block');
        };
        image.src = imageSrc;
    }

    $('#upload-btn').on('click', function (event) {
        event.preventDefault();
        $('#file-input').click();
    });

    $('#reset-btn').on('click', function (event) {
        resetCanvasWithImage(originalImageSrc);
    });

    $('#file-input').on('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                resetCanvasWithImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    const docideSelect = $('#docide');
    const numDocInput = $('#NumDoc');
    mascaraDocumentoIdentidad(docideSelect, numDocInput);

    $('#docide').on('change', function () {
        mascaraDocumentoIdentidad(docideSelect, numDocInput);
    });


    $("#celular").inputmask("999 999 999", {
        placeholder: "999 999 999",
        rightAlign: false,
    });
    /*$("#telefono").inputmask("999 9999", {
        placeholder: "999 9999",
        rightAlign: false
    });*/
});

function getPacienteCombos() {
    $.ajax({
        url: '/listarCombosPac',
        success: function (lista) {
            let docident = $('#docide'); // Selecionar el select de tipo documento
            let forpa = $('#forpag_id');// Seleccionar el select de forma de pago
            docident.html('');
            forpa.html('');
            lista.forEach(item => {
                let option = `<option value="${item.id}">${item.descripcion}</option>`;
                if (item.tabla === 'documento_identidad') {
                    docident.append(option);
                } else if (item.tabla === 'formapago') {
                    forpa.append(option);
                }
            });
            $("#docide").val("06");
            $('#forpag_id').val("1");

            let inputid = $('#inputid').val();
            if (inputid !== '0') {
                getcliente(inputid);
            }
        },
        error: function (error) {
            console.log('error: ', error);
        }
    });
}
function getcliente(id) {
    let parametro = id;
    let parametro1 = 0;
    $.ajax({
        url: '/listarcliente',
        method: 'GET',
        data: {
            parametro: parametro,
            parametro1: parametro1
        },
        success: function (clientes) {
            if (clientes.length !== 0) {
                $('#docide').val(clientes[0].docide);
                $('#NumDoc').val(clientes[0].NumDoc);
                $('#razsoc').val(clientes[0].razsoc);
                $('#Direccion').val(clientes[0].Direccion);
                $('#actividad_economica').val(clientes[0].actividad_economica);
                $('#cod_ubigeo').val(clientes[0].cod_ubigeo);
                $('#forpag_id').val(clientes[0].forpag_id);
                $('#contacto').val(clientes[0].contacto);
                $('#emailcon').val(clientes[0].emailcon);
                $('#celular').val(clientes[0].celular);
                $('#telefono').val(clientes[0].telefono);
                $('#emailmedocu').val(clientes[0].emailmedocu);
                $('#des_ubigeo1').val(clientes[0].desubigeo);
                $('input[name="respuesta2"][value="' + clientes[0].incfirmmedexa + '"]').prop('checked', true);
                $('input[name="respuesta3"][value="' + clientes[0].Incfirpacexa + '"]').prop('checked', true);
                $('input[name="respuesta4"][value="' + clientes[0].Inchuepacexa + '"]').prop('checked', true);
                $('input[name="respuesta5"][value="' + clientes[0].Incfordatper + '"]').prop('checked', true);
                $('input[name="respuesta6"][value="' + clientes[0].incdecjurM + '"]').prop('checked', true);
                $('input[name="respuesta7"][value="' + clientes[0].Incfirhueforadi + '"]').prop('checked', true);
                $('input[name="respuesta8"][value="' + clientes[0].creusucatocu + '"]').prop('checked', true);
                $('input[name="respuesta9"][value="' + clientes[0].Encorvctocert + '"]').prop('checked', true);
                $('input[name="respuesta10"][value="' + clientes[0].envcorusuexi + '"]').prop('checked', true);
                $('input[name="respuesta11"][value="' + clientes[0].notinfmed_medocu + '"]').prop('checked', true);
                $('input[name="respuesta12"][value="' + clientes[0].notinfmedpac + '"]').prop('checked', true);
                const canvas = $('#canvas')[0];
                const image = new Image();
                const context = canvas.getContext('2d');
                image.onload = function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                };
                image.src = `./img/cliente/${clientes[0].NumDoc}.webp`;

                $('#modalFormactcliente [data-dismiss="modal"]').trigger('click');
                mensaje(clientes[0].icono, clientes[0].mensaje, 1500);
            }
        },
        error: function (error) {
            console.log('Error en la solicitud AJAX, error: ', error);
        },
    });
}
// Guarda los valores predeterminados al cargar la página 
var radios = document.querySelectorAll('.needs-validation input[type="radio"]');
radios.forEach(function (radio) {
    radio.setAttribute('data-valor-predeterminado', radio.checked);
});

function guardarcliente() {
    let btncli = document.getElementById("btncli");
    btncli.disabled = true;
    const canvas = document.getElementById('canvas');
    let camposValidoscli = validarFormulario('distritomodal,notinfmedpacS,notinfmedpacN,telefono ,emailcon,contacto, celular, emailmedocu,forpag_id, feccre, incfirmmedexa, Incfirpacexa, Inchuepacexa,Incfordatper, incdecjur, Incfirhueforadi, creusucatocu,encorvusuexi,Encorvctocert, notinfmed_medocu, notinfmedpac, actividad_economica,logo,file-input, cod_ubigeo');
    if (!camposValidoscli) {
        return;
    }
    let razsoc = $('#razsoc');
    let docide = $('#docide');
    let NumDoc = $('#NumDoc');
    let Direccion = $('#Direccion');
    let telefono = $('#telefono').inputmask('unmaskedvalue');
    let emailcon = $('#emailcon');
    let contacto = $('#contacto');
    let celular = $('#celular').inputmask('unmaskedvalue');
    let emailmedocu = $('#emailmedocu');
    let forpag_id = $('#forpag_id');
    let actividad_economica = $('#actividad_economica');
    var piccli = canvas.toDataURL();
    let cod_ubigeo = $('#cod_ubigeo');

    
    let incfirmmedexa = $('input[type="radio"][name="respuesta2"]:checked').val();
    let Incfirpacexa = $('input[type="radio"][name="respuesta3"]:checked').val();
    let Inchuepacexa = $('input[type="radio"][name="respuesta4"]:checked').val();
    let Incfordatper = $('input[type="radio"][name="respuesta5"]:checked').val();
    let incdecjur = $('input[type="radio"][name="respuesta6"]:checked').val();
    let Incfirhueforadi = $('input[type="radio"][name="respuesta7"]:checked').val();
    let creusucatocu = $('input[type="radio"][name="respuesta8"]:checked').val();
    let Encorvctocert = $('input[type="radio"][name="respuesta9"]:checked').val();
    let envcorusuexi = $('input[type="radio"][name="respuesta10"]:checked').val();
    let notinfmed_medocu = $('input[type="radio"][name="respuesta11"]:checked').val();
    let notinfmedpac = $('input[type="radio"][name="respuesta12"]:checked').val();

    let inputid = $('#inputid').val();

    $.ajax({
        url: '/cliente',
        method: "POST",
        data: {
            razsoc: razsoc.val(),
            docide: docide.val(),
            NumDoc: NumDoc.val(),
            Direccion: Direccion.val(),
            telefono: telefono,
            emailcon: emailcon.val(),
            contacto: contacto.val(),
            celular: celular,
            emailmedocu: emailmedocu.val(),
            forpag_id: forpag_id.val(),
            incfirmmedexa: incfirmmedexa,
            Incfirpacexa: Incfirpacexa,
            Inchuepacexa: Inchuepacexa,
            Incfordatper: Incfordatper,
            incdecjur: incdecjur,
            Incfirhueforadi: Incfirhueforadi,
            creusucatocu: creusucatocu,
            Encorvctocert: Encorvctocert,
            envcorusuexi: envcorusuexi,
            notinfmed_medocu: notinfmed_medocu,
            notinfmedpac: notinfmedpac,
            actividad_economica: actividad_economica.val(),
            cod_ubigeo: cod_ubigeo.val(),
            piccli: piccli,
            inputid : inputid
        },
        success: function (response) {
                btncli.disabled = false;
                mensaje(response[0].tipo, response[0].response, 1500);            
        },
        error: function () {
            btncli.disabled = false;
            mensaje('error', 'Error al guardar, intente nuevamente', 1500);
        }
    });
}
function searchDistrito() {
    let parametro = $('#distritomodal').val();
    mostrarDiv('cargadistrito');
    ocultarDiv('tabledistritomodal');
    $.ajax({
        url: '/listardistrito',
        method: 'GET',
        data: {
            parametro: parametro,
        },
        success: function (response) {
            ocultarDiv('cargadistrito');
            mostrarDiv('tabledistritomodal');
            const tbodydistrito = $('#bodyDistrio');
            tbodydistrito.empty();
            if (response.length === 0) {
                tbodydistrito.append(`
                    <tr>
                        <td colspan="2" class="text-center">No hay resultados disponibles </td>
                    </tr>
                `);
            } else {
                response.forEach(lista => {
                    tbodydistrito.append(`
                        <tr> 
                            <td>
                                <button onclick="event.preventDefault();getDistritoinput('${lista.cod_ubigeo}','${lista.desubigeo}')" class="btn btn-circle btn-sm btn-info mr-1"><i class="fa-solid fa-plus"></i></button>
                            </td>            
                            <td>${lista.desubigeo}</td>                  
                        </tr>
                    `);
                });
                mensaje(response[0].tipo, response[0].response, 1500);
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}

document.getElementById("distritomodal").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchDistrito();
    }
});
function getDistritoinput(codigo, descripcion) {
    let cod_ubigeo = document.getElementById('cod_ubigeo');
    let des_ubigeo1 = document.getElementById('des_ubigeo1');
    cod_ubigeo.value = codigo;
    des_ubigeo1.value = descripcion;
    $('#modalFormDistrito [data-dismiss="modal"]').trigger('click');
}