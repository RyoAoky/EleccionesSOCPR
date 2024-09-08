
$(document).ready(function () {
    render();
    getcliente();
});
document.getElementById("clienteinput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        getcliente();
    }
});
function getcliente() {
    let parametro = 0;
    var parametro1 = $("#clienteinput").val();
    mostrarDiv('carga');
    ocultarDiv('mydatatable');
    $.ajax({
        url: '/listarcliente',
        method: 'GET',
        data: {
            parametro: parametro,
            parametro1: parametro1
        },
        success: function (clientes) {
            ocultarDiv('carga');
            mostrarDiv('mydatatable');
            const tbodycli = $('#bodyclientes');
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
                        <tr data-id = ${cliente.cli_id}>
                            <td class="align-middle"><input id="check_${cliente.cli_id}" value="id_${cliente.cli_id}" type="checkbox" class="mt-1" ></td>    
                            <td class="text-left">${cliente.razsoc}</td>
                            <td style="vertical-align: middle;" class="text-center">${cliente.NumDoc}</td>
                            <td class="text-left">${cliente.Direccion}</td>
                            <td class="text-center">${cliente.Ubigeo}</td>
                            <td class="text-left">${cliente.contacto}</td>
                            <td class="text-left">${cliente.emailcon}</td>
                            <td class="text-center">${cliente.celular}</td>
                        </tr>
                    `);
                });
                mensaje(clientes[0].icono, clientes[0].mensaje, 1500);
            }
        },
        error: function () {
            alert('Error en la solicitud AJAX');
        },
    });
}
function eliminar() {
    var table = document.getElementById('mydatatable');
    if (!table) {
        console.error('La tabla no se encontró.');
        return;
    }
    var rows = table.querySelectorAll('tbody tr');
    var seleccionados = [];
    for (var i = 0; i < rows.length; i++) {
        var checkbox = rows[i].querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            var cli_id = checkbox.value.split('_')[1];

            seleccionados.push({ cli_id: cli_id });
        }
    }
    if (seleccionados.length === 0) {
        mensajecentral('error', 'Debes seleccionar algún registro.');
    } else {
        MensajeSIyNO('warning', '', '¿Está seguro de eliminar los clientes seleccionadas?', function (respuesta) {
            if (respuesta) {
                fetch('/deleteCli', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(seleccionados)
                })
                    .then(response => {
                        if (!response.ok) {
                            console.error('Error en la solicitud');
                            throw new Error('Error en la solicitud');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data[0].icono === "success") {
                            for (var i = 0; i < seleccionados.length; i++) {
                                var cli_id = seleccionados[i].cli_id;
                                var fila = table.querySelector('tr[data-id="' + cli_id + '"]');
                                if (fila) {
                                    fila.remove();
                                }
                            }
                        }
                        mensaje(data[0].icono, data[0].mensaje, 1500);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        });
    }
}