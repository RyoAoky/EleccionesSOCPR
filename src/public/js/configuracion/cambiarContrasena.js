
//let estadopass = "";
function Grabar() {
    let btnGuardar = $('#btnGuardar');
    let contrasenaanterior = $('#contrasenaanterior').val();
    let nuevacontrasena = $('#contrasenanueva').val();
    let repetircontrasenanueva = $('#repetircontrasenanueva').val();

    var camposValidos = validarInputs('contrasenaanterior, contrasenanueva, repetircontrasenanueva');
    if (!camposValidos) {
        mensaje('error', 'Todos los campos son obligatorios', 2000);
        return;
    }
    if (nuevacontrasena == repetircontrasenanueva) {
        $.ajax({
            url: '/nuevacontrasena',
            method: 'POST',
            data: {
                contrasenaanterior: contrasenaanterior,
                nuevacontrasena: nuevacontrasena
            },
            success: function (result) {
                if (result == 'N') {
                    mensaje('error', 'La contraseña anterior es incorrecta', 3000);
                    $('#contrasenaanterior').addClass('is-invalid');
                    return;
                }
                mensaje(result[0].icono, result[0].mensaje, 2500);
                /*
                                $('#formnuevacontrasena').removeClass('was-validated');
                                $('input[type="Password"]').val("");
                
                                let comprobar = $('#comprobar');
                                comprobar.html('');
                                comprobar.append(`<label id="boleano" class="control-label mt-4"></label>`)
                                let errornoigual = $('#errornoigual');
                                errornoigual.html('');
                                errornoigual.append(`<h6 style="color: red;"></h6>`)
                */
            }
        })
    } else {
        mensaje('error', 'Las contraseñas no son iguales', 3000);
        $('#contrasenanueva, #repetircontrasenanueva').addClass('is-invalid');
        return;
    }
}


$('#formnuevacontrasena ').on('submit', function (e) {
    e.preventDefault();

    let comprobar = $('#comprobar');
    comprobar.html('');
    comprobar.append(`
        <label style="color: red;" class="control-label mt-4"></label>
        `)

    let contrasenaanterior = $('#contrasenaanterior');
    let nuevacontrasena = $('#contrasenanueva');
    let repetircontrasenanueva = $('#repetircontrasenanueva');

    if (nuevacontrasena.val() == repetircontrasenanueva.val()) {
        $.ajax({
            url: '/csp/nuevacontrasena',
            method: 'POST',
            data: {
                contrasenaanterior: contrasenaanterior.val(),
                nuevacontrasena: nuevacontrasena.val()
            },
            success: function (lista) {
                if (lista == 'correcto') {
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })

                    Toast.fire({
                        icon: 'success',
                        title: 'Guardado correctamente'
                    })
                    $('#formnuevacontrasena').removeClass('was-validated');
                    $('input[type="Password"]').val("");

                    let comprobar = $('#comprobar');
                    comprobar.html('');
                    comprobar.append(`<label id="boleano" class="control-label mt-4"></label>`)
                    let errornoigual = $('#errornoigual');
                    errornoigual.html('');
                    errornoigual.append(`<h6 style="color: red;"></h6>`)

                } else {
                    let comprobar = $('#comprobar');
                    comprobar.html('');
                    comprobar.append(`<label style="color: red;" class="control-label mt-4">La contraseña anterior es incorrecta</label>`)
                }

            }

        })
    } else {
        let errornoigual = $('#errornoigual');
        errornoigual.html('');
        errornoigual.append(`
        <h6 style="color: red;">* Las contraseñas no son iguales.</h6>
        `)
    }
});
function mostrarPassword() {
    var cambio = document.getElementById("contrasenaanterior");
    if (cambio.type == "password") {
        cambio.type = "text";
        $('#icon1').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
        cambio.type = "password";
        $('#icon1').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}
function mostrarPassword1() {
    var cambio = document.getElementById("contrasenanueva");
    if (cambio.type == "password") {
        cambio.type = "text";
        $('#icon2').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
        cambio.type = "password";
        $('#icon2').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}
function mostrarPassword2() {
    var cambio = document.getElementById("repetircontrasenanueva");
    if (cambio.type == "password") {
        cambio.type = "text";
        $('#icon3').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    } else {
        cambio.type = "password";
        $('#icon3').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }
}
/*
(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                } else {
                    //comprobar(event);
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();*/
