'use strict'

// VARIABLES GLOBALES
var currentPage = 1;
var pagTotal;

// Obtener la fecha de hoy en formato AAAA-MM-DD
const hoy = new Date().toISOString().slice(0, 10);

// Nos aseguramos de que que todos los elementos del DOM (elementos HTML) del proyecto están cargados.
document.addEventListener("DOMContentLoaded", function() {

    //VARIABLES DE ELEMENTOS HTML
    var divEvento = document.querySelector('#data-container');
    var divPageStatus = document.getElementById("pageStatus");
    var goToPageInput = document.getElementById("goToPageInput");

    // Función para desabilitar los botones del navegador de siguiente en la última página (== pagTotal) y 
    // el de anterior en la primera
    function controlPagButtons() {
        document.getElementById("nextPage").disabled = false;
        document.getElementById("previousPage").disabled = false;
        if(currentPage == pagTotal) {
            document.getElementById("nextPage").disabled = true;
        } 
        if(currentPage == 1) {
            document.getElementById("previousPage").disabled = true;
        } 
    }

    // Función de escucha al botón de pasar página adelante. Al principio hemos declarado la página actual (currentPage) 
    // con el valor 1 y le decimos que al pulsar el botón le suma 1 cada vez
    // Llamamos a la función 'realizarPeticionEvento(currentPage)' pasándole como parámetro la página actual, 
    // para que realice el fetch y obtener así los datos de esa página
    // A continuación llama a la función de pintarEvento(evento.items), para que pueda mostrar la info por pantalla
    // También muestro los datos de los eventos por consola a modo de control
    // Por último, modificamos el contador de páginas y controlamos que el botón se deshabilita cuando llega a 
    // la última página, usando la función 'controlPagButtons()'
    document.getElementById("nextPage").addEventListener("click", function() {
        currentPage++;

        // Mostramos mensaje de cargando hasta que se muestre el listado, para que el usuario sepa el proceso se está ejecutando
        divEvento.innerHTML = "<h3 class='loading'>" + "LOADING...." + "</h3>";
        realizarPeticionEvento(currentPage)
                    .then(data => data.json())
                    .then(evento => {
                        pintarEvento(evento.items);
                        console.log(evento.items);
                    });
        divPageStatus.innerHTML = currentPage + "/" + pagTotal;

        //Controlar cuando lleguemos a última página
        controlPagButtons();            
    });

    // Lo mismo que la anterior función pero para el botón de previous o hacia atrás
    document.getElementById("previousPage").addEventListener("click", function() {
        currentPage--;

        // Mostramos mensaje de cargando hasta que se muestre el listado, para que el usuario sepa el proceso se está ejecutando
        divEvento.innerHTML = "<h3 class='loading'>" + "LOADING...." + "</h3>";
        realizarPeticionEvento(currentPage)
                    .then(data => data.json())
                    .then(evento => {
                        pintarEvento(evento.items);
                        console.log(evento.items);
                    });
        divPageStatus.innerHTML = currentPage + "/" + pagTotal;

        //Controlar cuando lleguemos a primera página
        controlPagButtons();  
    });

    // Le decimos que por defecto el botón de ir hacia atrás esté deshabilitado
    document.getElementById("previousPage").disabled = true;

    // Función de escucha para el botón del input donde introducimos el número de página deseado
    document.getElementById("goToPageButton").addEventListener("click", function() {

        // Obtenemos el valor introducido por el usuario en el input
        var targetPage = document.getElementById("goToPageInput").value;
        
        // Declaramos expresión regular que controlará que los datos introducidos son números del 1 al 9
        const regex1_9 = /^[1-9]+$/;

        // Controlamos que el usuario no introduce valores que no sean números o un valor númerico mayor 
        // al de las páginas disponibles
        // Si el valor es válido cargamos los datos de dicha página y los pintamos por pantalla
        // Actualizamos contador y comprobamos si hay que deshabilitar botones del navegador
        // Si los datos introducidos no son numéricos, mostrará un alert pidiendo introduzca un valor válido
        // En caso de poner un número mayor al de páginas disponible, mostrará otro alert advirtiendo al usuario
        // que tiene que introducir un número menor de las páginas totales, el cual también se mostrará en el mensaje
        if (regex1_9.test(targetPage) && targetPage <= pagTotal) {

            // Mostramos mensaje de cargando hasta que se muestre el listado, para que el usuario sepa el proceso se está ejecutando
            divEvento.innerHTML = "<h3 class='loading'>" + "LOADING...." + "</h3>";
            currentPage = targetPage;
            realizarPeticionEvento(targetPage)
                        .then(data => data.json())
                        .then(evento => {
                            pintarEvento(evento.items);
                            console.log(evento.items);
                        });
            divPageStatus.innerHTML = currentPage + "/" + pagTotal;
            controlPagButtons(); 
        } else if (!regex1_9.test(targetPage)) {
            alert('El valor introducido no es válido. Introduce un número del 1 al 9, por favor.');

            // Le devolvemos el foco al input para que pueda introducir otra letra
            goToPageInput.focus();
        } else {
            alert('Introduce un número menor que ' + (pagTotal+1) + ', por favor.');

            // Le devolvemos el foco al input para que pueda introducir otra letra
            goToPageInput.focus();
        }
    });

    // Función de escucha del botón para ir a ver los eventos del día de hoy
    // Nos redirige a un segundo html, donde mostraremos el listado de eventos
    document.getElementById("goToToday").addEventListener("click", function(event) {
        window.location.href = "../eventos_hoy.html";
    });

    // Fetch o petición a la api, para obtener el dato de las páginas totales de eventos (pagTotal) cuando hacemos
    // la consulta de los datos de los eventos que son conciertos (type = 1) y que son del año 2024
    // Mostramos por consola el número total de páginas y borramos el contenido del div cada vez 
    // Pintamos de inicio el contador de páginas con 1 / (aquí mostramos el total de páginas)
    // Hacemos una segunda petición llamando a la función 'realizarPeticionEvento(pagina)', donde le pasamos
    // la página actual como parámetro, para obtener los datos sólo de la página que nos interesa
    // Por último llamamos a la función 'pintarEvento(evento.items)' y le pasamos como parámetro el array de 
    // datos que nos devuelve la api para esa página

    fetch('https://api.euskadi.eus/culture/events/v1.0/events/byType/1/byYear/2024?_elements=20')
        .then(data => data.json())
        .then(datosIniciales => {
            divEvento.innerHTML = "";
            console.log(datosIniciales.totalPages);
            pagTotal = datosIniciales.totalPages;
            divPageStatus.innerHTML = "1/" + pagTotal;
            realizarPeticionEvento(currentPage)
                .then(data => data.json())
                .then(evento => {
                    pintarEvento(evento.items);
                    console.log(evento.items);
            })
        })

    // Función que devuelve la info de la página específica solicitada
    function realizarPeticionEvento(pagina) {
        return fetch('https://api.euskadi.eus/culture/events/v1.0/events/byType/1/byYear/2024?_elements=20&_page=' + pagina);
    }

    // Función para pintar por pantalla el listado de eventos de la página del api (20 eventos)
    // Borramos el contenido del div para que no se sobrescriba y nos borre también el mensaje de 'loading'
    // Recorremos el array de eventos con 'map' pintando los datos que nos interesan 
    // (idColorProvincia/nombre/lupa/fecha/hora/municipio) de cada evento
    function pintarEvento(eventos) {
        
        divEvento.innerHTML = "";
        eventos.map(function(event,i) {

            // Obtener la fecha del evento en formato AAAA-MM-DD
            // Uso método slice() para eliminar las últimas 10 letras (T00:00:00Z), porque no me interesa que se muestren
            var fecha = event.startDate.slice(0, -10);

            // Obtenemos el código de la provincia
            var codProvincia = event.provinceNoraCode;
            
            // switch para pintar el id de color de cada provincia
            switch (codProvincia) {
                case "48":
                    divEvento.innerHTML += "<div id='idColorRed'>"+ 'B' + "</div>"
                    break;
                case "20":
                    divEvento.innerHTML += "<div id='idColorGreen'>"+ 'G' + "</div>"
                    break;
                case "1":
                    divEvento.innerHTML += "<div id='idColorBlue'>"+ 'A' + "</div>"
                    break;
                case "31":
                    divEvento.innerHTML += "<div id='idColorPurple'>"+ 'N' + "</div>"
                    break;
                case "-3":
                    divEvento.innerHTML += "<div id='idColorOrange'>"+ 'I' + "</div>"
                    break;
                default:
                    // Si no coincide con ningún codigo de provincia
                    divEvento.innerHTML += "<div id='idColorNone'>"+ ' ' + "</div>"
            }

            // Filtrar los datos para diferenciar los estilos de los eventos ya pasados, de los futuros 
            // eventos, dándole al texto del nombre diferentes estilos (color)
            if (fecha < hoy) {
                divEvento.innerHTML += "<h3 class='elmtListaNombreAntiguo'>" + event.nameEs + "</h3>";
            } else {
                divEvento.innerHTML += "<h3 class='elmtListaNombre'>" + event.nameEs + "</h3>";
            }

            // Añadimos la imagen de la lupa, que al pulsar llamará a la función 'verDetalles(event.id)' que servirá
            // para visualizar la información más detallada de cada evento en un nuevo div
            // Le pasamos como parámetro el id de cada evento, para que en la siguiente función podamos trabajar con los datos 
            // del mismo evento del cual hemos pulsado la lupa
            divEvento.innerHTML += "<img src='img/lupa.png' alt = 'lupa' class='elementoinfo' onclick = verDetalles('" + event.id + "')>";
            
            divEvento.innerHTML += "<h3 class='elmtLista'>" + fecha + "</h3>";
            divEvento.innerHTML += "<h3 class='elmtLista'>" + event.openingHoursEs + "</h3>";
            divEvento.innerHTML += "<h3 class='elmtLista'>" + event.municipalityEs + "</h3>";
            
            // Creamos un div vacio dónde mostraremos info más detallada y le ponemos como id 
            // el nombre 'event' + el id del evento correspondiente
            divEvento.innerHTML += "<div id='event" + event.id + "' class='divInfo'></div>";
        }); 
    }          
});

// Función para pintar la información que se muestra en el div vacio que hemos creado al pulsar la lupa
// Haremos un nuevo fetch, pasándole el id del evento correspondiente para obtener los datos que queremos mostrar
function verDetalles(id) {   
    fetch('https://api.euskadi.eus/culture/events/v1.0/events/' + id)
        .then(data => data.json())
        .then(datosEvento => {
            
        // Creamos un elemento html de imagen y le asignamos url y alt con la info del evento
        let img = document.createElement('img');
        img.src = datosEvento.images[0].imageUrl;
        img.alt = datosEvento.images[0].imageFileName;

        // Creamos los contenedores de los elementos Cúando/Dónde/Compra
        let contCuando = document.createElement('div');
        let contDonde = document.createElement('div');
        let contCompra = document.createElement('div');

        // Capturamos el div correspondiente usando el nombre + id y le asignamos la clase 'divInfo'
        var divInfo = document.getElementById("event" + id);
        divInfo.classList.add('divInfo');

        // If para controlar que el contenido de la info, no se cargue más de una vez
        // Si está vacio, pintará los datos del evento: 
        // (nombre/imagen/cúando(fecha y hora)/dónde(sala de concierto y municipio)/precio/enlace de compra/botón de cierre))
        if (divInfo.innerHTML === "") {

            divInfo.innerHTML += "<h2 id='titleArticulo'>" + datosEvento.nameEs + "</h2>";

            divInfo.appendChild(img);
            img.classList.add('imgEvento');

            divInfo.appendChild(contCuando);
            contCuando.classList.add('contPregunta');
            contCuando.innerHTML += "<h3 id='preguntaC' class='pregunta'>" + '¿CÚANDO? ' + "</h3>";
            contCuando.innerHTML += "<h3>" + datosEvento.startDate.slice(0, -10) + "</h3>";
            contCuando.innerHTML += "<h3>" + ' ,' + datosEvento.openingHoursEs + ' h' + "</h3>";

            divInfo.appendChild(contDonde);
            contDonde.classList.add('contPregunta');
            contDonde.innerHTML += "<h3  id='preguntaD' class='pregunta'>" + '¿DÓNDE? ' + "</h3>";
            if(datosEvento.urlEventEs != undefined) {
                // Usamos el atributo "target='_blank'" para que abra el enlace en otra pestaña del nav
                contDonde.innerHTML += "<a id='linkSala' target='_blank' href= '" + datosEvento.urlEventEs + "'>" + datosEvento.establishmentEs + "</a>" + " | ";
            } else {
                contDonde.innerHTML += "<p>" + "Dato de la sala de conciertos no disponible | " + "</p>";
            }
            contDonde.innerHTML += "<h3>" +  datosEvento.municipalityEs + "</h3>";

            if(datosEvento.descriptionEs != undefined) {
                divInfo.innerHTML += "<p id='textoArticulo'>" + datosEvento.descriptionEs + "</p>";
            }

            divInfo.innerHTML += "<h3 class='precio'>" + datosEvento.priceEs + "</h3>";

            if(datosEvento.purchaseUrlEs != undefined) {
                divInfo.appendChild(contCompra);
                contCompra.classList.add('contCompra');
                contCompra.innerHTML += "<img src='img/boleto.png' id='imgticket' alt='Entradas'>";
                contCompra.innerHTML += "<a id='linkCompra' target='_blank' href= '" + datosEvento.purchaseUrlEs + "'>" + ' COMPRAR ENTRADA' + "</a>";
            }

            // Imagen de x, que al pulsar llama a la función 'eliminarDiv(id)' y borrará el div
            // Le pasamos también el id como parámetro, para poder seleccionar el div que corresponde
            divInfo.innerHTML += "<img src='img/cerrar1.png' id='imgCerrar' alt='x para cerrar' onclick = eliminarDiv('"+ id +"')>"; 

            //Le damos estilo al div
            divInfo.style.padding = "2% 5%";
            divInfo.style.display = "flex";
            divInfo.style.flexDirection = "column";
            divInfo.style.alignItems = "center";
            divInfo.style.backgroundColor = "greenyellow"; 
        }
    });
}

// Función para borrar el contenido del div de info
function eliminarDiv(id) {
    var divInfoBorrar = document.getElementById("event" + id)
    divInfoBorrar.innerHTML = "";
    divInfoBorrar.style.padding = "0";
}