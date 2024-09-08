(function validardocuements() {
    //const btnSubir = document.getElementById('btnSubir');
    const fileInput = document.getElementById('archivos');
    const btnEliminar = document.getElementById('btnEliminar');
    fileInput.disabled = false;
    fileInput.addEventListener('change', (event) => {
        const selectedFiles = event.target.files;
        var btnSubir = document.getElementById("btnSubir");
        btnSubir.disabled = false;

        var btnSubirCita = document.getElementById("btnSubirCita");
        btnSubirCita.disabled = false;
        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes('.' + fileExtension)) {
                mensaje('error', 'El archivo ' + file.name + ' no es un tipo de archivo permitido.', 2000);
                fileInput.value = '';
                const miniaturasDiv = document.getElementById("miniaturas");
                miniaturasDiv.innerHTML = "";
                return;
            } else {
                mostrarMiniaturas();

                //btnSubir.disabled = false;
                //btnEliminar.disabled = true;
                fileInput.value = '';
            }

        }
    });
})();


function mostrarMiniaturas() {
    const miniaturasDict = {};
    const input = document.getElementById("archivos");
    const miniaturasDiv = document.getElementById("miniaturas");
    const btnEliminar = document.getElementById('btnEliminar');
    const btnEliminarCita = document.getElementById('btnEliminaradjcitas');
    // Crear un DataTransfer para mantener los archivos existentes
    const dt = new DataTransfer();

    // Obtener los archivos existentes en el input
    Array.from(input.files).forEach(file => dt.items.add(file));

    // Añadir los nuevos archivos
    for (let i = 0; i < input.files.length; i++) {
        const archivo = input.files[i];
        const tipoArchivo = archivo.type;
        const nombreArchivo = archivo.name;

        // Reemplazar el archivo si el nombre ya existe
        const miniaturaExistente = miniaturasDiv.querySelector(`.archivo-item[data-nombre="${nombreArchivo}"]`);
        if (miniaturaExistente) {
            miniaturasDiv.removeChild(miniaturaExistente);
        }

        dt.items.add(archivo);

        const miniaturaDiv = document.createElement("div");
        miniaturaDiv.className = "archivo-item";
        miniaturaDiv.dataset.nombre = nombreArchivo;

        // Crear botón de eliminar
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
            const btnSubir = document.getElementById('btnSubir');
            input.value = '';
            //btnSubir.disabled = false;
            miniaturasDiv.removeChild(miniaturaDiv);
            const archivosArray = Array.from(dt.files).filter(file => file.name !== nombreArchivo);
            const nuevoInputFile = new DataTransfer();
            archivosArray.forEach(file => nuevoInputFile.items.add(file));
            input.files = nuevoInputFile.files;
            /*if (input.files.length === 0) {
                document.getElementById('archivos').disabled = true;
            }*/
            if ($('#miniaturas .archivo-item').length === 0) {
                document.getElementById('btnSubir').disabled = false;
                document.getElementById('btnSubirCita').disabled = true;
                btnEliminar.disabled = true;
                btnEliminarCita.disabled = true;
            } else {
                document.getElementById('btnSubir').disabled = false;
                document.getElementById('btnSubirCita').disabled = false;
            }
            //var cantidadArchivos = $('#miniaturas .archivo-item').length;
            input.value = '';
        };

        miniaturaDiv.appendChild(btnEliminarMiniatura);

        if (tipoArchivo === "application/pdf") {
            const pdfIcon = document.createElement("a");
            pdfIcon.href = URL.createObjectURL(archivo);
            pdfIcon.target = "_blank";
            pdfIcon.innerHTML = `<img src="/img/pdficono.webp" width="90" height="90">`;
            miniaturaDiv.appendChild(pdfIcon);
            miniaturasDict[nombreArchivo] = pdfIcon;
        } else {
            const imgIcon = document.createElement("a");
            imgIcon.href = URL.createObjectURL(archivo);
            imgIcon.target = "_blank";
            imgIcon.innerHTML = `<img src="/img/imgicono.webp" width="90" height="90">`;
            miniaturaDiv.appendChild(imgIcon);
            miniaturasDict[nombreArchivo] = imgIcon;
        }

        const nombreArchivoParrafo = document.createElement("p");
        nombreArchivoParrafo.textContent = nombreArchivo;
        nombreArchivoParrafo.title = nombreArchivo;
        nombreArchivoParrafo.style.width = "90px";
        nombreArchivoParrafo.style.whiteSpace = "nowrap";
        nombreArchivoParrafo.style.overflow = "hidden";
        nombreArchivoParrafo.style.textOverflow = "ellipsis";
        miniaturaDiv.appendChild(nombreArchivoParrafo);

        miniaturasDiv.appendChild(miniaturaDiv);
    }

    // Actualizar los archivos del input
    input.files = dt.files;

    miniaturasDiv.style.display = "";
    input.value = "";
}

function SubirDocumento() {
    const btnSubir = document.getElementById('btnSubir');
    const btnEliminaradjcitas = document.getElementById('btnEliminaradjcitas');
    const btnEliminar = document.getElementById('btnEliminar');
    const fileInput = document.getElementById('archivos');

    btnSubir.disabled = true;
    btnSubir.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;
    btnEliminaradjcitas.disabled = true;
    btnEliminar.disabled = true;
    fileInput.disabled = true;
    $('#miniaturas button').prop('disabled', true);


    const miniaturasDiv = document.getElementById("miniaturas");
    const archivoItems = miniaturasDiv.getElementsByClassName("archivo-item");

    async function urlToBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    async function obtenerTamaño(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const bytes = blob.size;
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2);
    }


    const archivosBase64 = [];
    const cita_id = document.getElementById('id').value;
    const soexa = document.getElementById('soexa').value;
    const codpru_id = document.getElementById('codpru_id').value;
    let tamañoArchivo = 0;
    (async () => {
        for (const archivoItem of archivoItems) {
            const enlace = archivoItem.querySelector("a");
            const url = enlace.getAttribute("href");
            const nombreArchivo = archivoItem.querySelector("p").textContent;

            try {
                const base64Data = await urlToBase64(url);
                let size = await obtenerTamaño(url);
                tamañoArchivo += parseFloat(size);
                archivosBase64.push({ nombreArchivo: nombreArchivo, base64: base64Data });
            } catch (error) {
                console.error(`Error al convertir ${nombreArchivo} a Base64:`, error);
            }
        }
        if (tamañoArchivo >= 5) {
            mensajecentral("error", "Los archivos superan el tamaño máximo permitdo de 5mb en total");
            btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
            btnSubir.disabled = false;
            fileInput.disabled = false;
            $('#miniaturas button').prop('disabled', false);
            if (document.getElementById('btnSubirdocumentoad')) {
                document.getElementById('btnSubirdocumentoad').disabled = true;
            }
            return;
        }
        const doc_adic_id = document.getElementById('doc_adic_id');
        const datosAEnviar = {
            cita_id: cita_id,
            soexa: soexa,
            codpru_id: codpru_id,
            archivos: archivosBase64,
            doc_adic_id: doc_adic_id.value
        };
        $.ajax({
            url: '/subirdocumento',
            method: "POST",
            data: JSON.stringify(datosAEnviar),
            contentType: 'application/json',
            success: function (lista) {
                if (lista[0].icono === 'success') {
                    doc_adic_id.value = lista[0].doc_adic_id;
                    miniaturasDiv.style.display = "";
                    fileInput.value = "";
                    fileInput.disabled = false;
                    //btnEliminar.disabled = false;
                    if ($('#btnSubirdocumentoad')) {
                        $('#btnSubirdocumentoad').prop('disabled', false);
                    }
                }
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
                $('#miniaturas button').prop('disabled', false);
            },
            error: function (lista) {
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
                btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
                //alert('Error al subir los archivos');
                //fileInput.disabled = false;
                //$('#miniaturas button').prop('disabled', false);
            },
            complete: function () {
                btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
                //$('#miniaturas button').prop('disabled', false);
            }
        });
    })();
}
function SubirDocumentoCita() {
    const btnSubir = document.getElementById('btnSubirCita');
    const btnEliminaradjcitas = document.getElementById('btnEliminaradjcitas');
    const btnEliminar = document.getElementById('btnEliminar');
    const fileInput = document.getElementById('archivos');

    btnSubir.disabled = true;
    btnSubir.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;
    btnEliminaradjcitas.disabled = true;
    btnEliminar.disabled = true;
    fileInput.disabled = true;
    $('#miniaturas button').prop('disabled', true);


    const miniaturasDiv = document.getElementById("miniaturas");
    const archivoItems = miniaturasDiv.getElementsByClassName("archivo-item");

    async function urlToBase64(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    async function obtenerTamaño(url) {
        const response = await fetch(url);
        const blob = await response.blob();
        const bytes = blob.size;
        const megabytes = bytes / (1024 * 1024);
        return megabytes.toFixed(2);
    }


    const archivosBase64 = [];
    const cita_id = document.getElementById('id').value;
    const soexa = document.getElementById('soexa').value;
    const codpru_id = document.getElementById('codpru_id').value;
    let tamañoArchivo = 0;
    (async () => {
        for (const archivoItem of archivoItems) {
            const enlace = archivoItem.querySelector("a");
            const url = enlace.getAttribute("href");
            const nombreArchivo = archivoItem.querySelector("p").textContent;

            try {
                const base64Data = await urlToBase64(url);
                let size = await obtenerTamaño(url);
                tamañoArchivo += parseFloat(size);
                archivosBase64.push({ nombreArchivo: nombreArchivo, base64: base64Data });
            } catch (error) {
                console.error(`Error al convertir ${nombreArchivo} a Base64:`, error);
            }
        }
        if (tamañoArchivo >= 5) {
            mensajecentral("error", "Los archivos superan el tamaño máximo permitdo de 5mb en total");
            btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
            btnSubir.disabled = false;
            fileInput.disabled = false;
            $('#miniaturas button').prop('disabled', false);
            if (document.getElementById('btnSubirdocumentoad')) {
                document.getElementById('btnSubirdocumentoad').disabled = true;
            }
            return;
        }
        const doc_adic_id = document.getElementById('doc_adic_id');
        const datosAEnviar = {
            cita_id: cita_id,
            soexa: soexa,
            codpru_id: codpru_id,
            archivos: archivosBase64,
            doc_adic_id: doc_adic_id.value
        };
        $.ajax({
            url: '/subirdocumentocita',
            method: "POST",
            data: JSON.stringify(datosAEnviar),
            contentType: 'application/json',
            success: function (lista) {
                if (lista[0].icono === 'success') {
                    doc_adic_id.value = lista[0].doc_adic_id;
                    miniaturasDiv.style.display = "";
                    fileInput.value = "";
                    fileInput.disabled = false;
                    //btnEliminar.disabled = false;
                    if ($('#btnSubirdocumentoad')) {
                        $('#btnSubirdocumentoad').prop('disabled', false);
                    }
                }
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
                $('#miniaturas button').prop('disabled', false);
            },
            error: function (lista) {
                mensaje(lista[0].icono, lista[0].mensaje, 1500);
                btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
                //alert('Error al subir los archivos');
                //fileInput.disabled = false;
                //$('#miniaturas button').prop('disabled', false);
            },
            complete: function () {
                btnSubir.innerHTML = '<i class="fa-solid fa-upload" style="margin: 8px 12px;">';
                //$('#miniaturas button').prop('disabled', false);
            }
        });
    })();
}
function EliminarDocumento() {
    let doc_adic_id = document.getElementById('doc_adic_id');
    const btnSubir = document.getElementById('btnSubir');
    const miniaturasDiv = document.getElementById("miniaturas");
    const fileInput = document.getElementById('archivos');
    const btnEliminar = document.getElementById('btnEliminar');
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    btnEliminar.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;
    MensajeSIyNO('question', '', '¿Desea eliminar todos los documentos?', function (respuesta) {
        if (respuesta) {
            $.ajax({
                url: '/eliminardocumento', // Asegúrate de que la URL sea la correcta
                method: "DELETE",
                data: {
                    cita_id: cita_id,
                    soexa: soexa,
                    codpru_id: codpru_id,
                    doc_adic_id: doc_adic_id.value,
                },
                success: function (lista) {
                    if (lista[0].icono === 'success') {
                        miniaturasDiv.style.display = "none";
                        //fileInput.disabled = false;
                        //btnEliminar.disabled = true;
                        doc_adic_id.value = 0;
                        miniaturasDiv.innerHTML = "";
                    }
                    mensaje(lista[0].icono, lista[0].mensaje, 1500);
                },
                error: function () {
                    mensaje('error', 'error al eliminar archivo', 1500);
                },
                complete: function () {
                    btnEliminar.innerHTML = '<i class="fa-solid fa-eraser" style="margin: 8px 12px;"></i>';
                }
            });
        } else {
            btnEliminar.innerHTML = '<i class="fa-solid fa-eraser" style="margin: 8px 12px;"></i>';
        }
    });
}
function EliminarDocumentoCitas() {
    let doc_adic_id = document.getElementById('doc_adic_id');
    const btnSubir = document.getElementById('btnSubirCita');
    const miniaturasDiv = document.getElementById("miniaturas");
    const fileInput = document.getElementById('archivos');
    const btnEliminar = document.getElementById('btnEliminaradjcitas');
    let cita_id = document.getElementById('id').value;
    let soexa = document.getElementById('soexa').value;
    let codpru_id = document.getElementById('codpru_id').value;
    btnEliminar.innerHTML = `
        <lottie-player src="/img/jsonimg/btnloading.json" background="transparent"
            speed="1" style="height: 35px;" loop autoplay>
        </lottie-player>`;
    MensajeSIyNO('question', '', '¿Desea eliminar todos los documentos?', function (respuesta) {
        if (respuesta) {
            $.ajax({
                url: '/eliminardocumentocitas', // Asegúrate de que la URL sea la correcta
                method: "DELETE",
                data: {
                    cita_id: cita_id,
                    soexa: soexa,
                    codpru_id: codpru_id,
                    doc_adic_id: doc_adic_id.value,
                },
                success: function (lista) {
                    if (lista[0].icono === 'success') {
                        miniaturasDiv.style.display = "none";
                        //fileInput.disabled = false;
                        btnEliminar.disabled = true;
                        btnSubir.disabled = true;
                        doc_adic_id.value = 0;
                        miniaturasDiv.innerHTML = "";
                    }
                    mensaje(lista[0].icono, lista[0].mensaje, 1500);

                },
                error: function () {
                    mensaje('error', 'error al eliminar archivo', 1500);
                },
                complete: function () {
                    btnEliminar.innerHTML = '<i class="fa-solid fa-eraser" style="margin: 8px 12px;"></i>';

                }
            });
        } else {
            btnEliminar.innerHTML = '<i class="fa-solid fa-eraser" style="margin: 8px 12px;"></i>';
        }
    });
}