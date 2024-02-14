'use strict'

// VARIABLES
// Obtener la fecha de hoy en formato AAAA-MM-DD
const hoy = new Date().toISOString().slice(0, 10);

// Convertir a formato "aaaa/mm/dd"
var fechaConBarras = hoy.replace(/-/g, "/");

// Convertir fecha con barrras a tipo string
var fechaConBarrasStr = fechaConBarras.toString();
var divMain = document.getElementById("main-container");
var titlePag = document.getElementById("titlePag");

// Mostramos el título de la página con la fecha de hoy
titlePag.innerHTML += " (" + fechaConBarras + ")";

// Hacemos petición a la api de los eventos tipo 1(conciertos) y los que son hoy
// Mostramos por consola el número de eventos que son y usamos un bucle for para ir pasándole a la función 
// 'pintarEventoHoy()' los eventos e ir pintandolos por pantalla
fetch ('https://api.euskadi.eus/culture/events/v1.0/events/byType/1/byDate/' + fechaConBarrasStr + "?_elements=50&_page=1") 
    .then(data => data.json())
    .then(datosHoy => {
        console.log(datosHoy.totalItems);
        for(let i = 0; i < datosHoy.totalItems;i++) { 
            pintarEventoHoy(datosHoy.items[i]);
        }
    })

// Función de escucha para el botón de volver, para que al pulsar nos rediriga a la página principal
document.getElementById("volverYCerrar").addEventListener("click", function() {
    window.location.href = "../index.html";
    window.close();
});

// Función para ir pintando los datos de cada evento
// Pintamos por consola los datos de cada evento a modo de control

function pintarEventoHoy(eventoHoy) {
    console.log(eventoHoy);

    // Creamos un contenedor para cada evento que nombramos con un nombre único sumandole al nombre el id, 
    // para luego, poder seleccionar el div que nos interesa
    divMain.innerHTML += "<div id='contRow" + eventoHoy.id + "' class='contRow'></div>";
    var contRow = document.getElementById("contRow" + eventoHoy.id);

    // Creamos diferentes div donde colocaremos los elementos html que vamos creando
    let contCuandoT = document.createElement('div');
    let contDondeT = document.createElement('div');
    let contDondeElemntsT = document.createElement('div');
    let contPrecioT = document.createElement('div');
    let contCompra = document.createElement('div');
    let imgToday = document.createElement('img');

    // Contenedores de la parte derecha y de la parte izquierda
    let contLeft = document.createElement('div');
    let contRight = document.createElement('div');

    contRow.appendChild(contLeft);
    contLeft.classList.add('contLeft');

    // Código de la provincia
    var codProvincia = eventoHoy.provinceNoraCode;
        
    // switch para pintar el id de color de cada provincia y lo ponemos en el contenedor de la izquierda
    switch (codProvincia) {
        case "48":
            contLeft.innerHTML += "<div id='idColorRed'>" + "<strong>" + 'BIZKAIA' + "</strong>" + "</div>"
            break;
        case "20":
            contLeft.innerHTML += "<div id='idColorGreen'>" + "<strong>" + 'GIPUZKOA' + "</strong>" + "</div>"
            break;
        case "1":
            contLeft.innerHTML += "<div id='idColorBlue'>" + "<strong>" +  'ARABA' + "</strong>" + "</div>"
            break;
        case "31":
            contLeft.innerHTML += "<div id='idColorPurple'>" + "<strong>" + 'NAFARROA' + "</strong>" + "</div>"
            break;
        case "-3":
            contLeft.innerHTML += "<div id='idColorOrange'>" + "<strong>" + "IPARRALDE " + "</strong>" + "</div>"
            break;
        default:
            contLeft.innerHTML += "<div id='idColorNone'>" + ' ' + "</div>"
    }

    // Controlamos que la api nos devuelve el dato de la imagen, sino mostramos una imagen de sustitución
    // Metemos la imagen en el contenedor de la izquierda
    if (eventoHoy.images.length != 0) {
        imgToday.src = eventoHoy.images[0].imageUrl;
        imgToday.alt = eventoHoy.images[0].imageFileName;
        imgToday.classList.add('imgEventoHoy');
        contLeft.appendChild(imgToday);
        imgToday.classList.add('imgToday');
    } else {
        imgToday.src = "img/camara.jpg";
        imgToday.classList.add('imgEventoHoy');
        contLeft.appendChild(imgToday);
        imgToday.classList.add('imgToday');
    }

    // Metemos el contenedor con los datos de cúando en el contenedor de la izquierda
    contLeft.appendChild(contCuandoT);
    contCuandoT.classList.add('contPreguntaT');
    contCuandoT.innerHTML += "<h3 class='preguntaT'>" + '¿CÚANDO? ' + "</h3>";
    contCuandoT.innerHTML += "<h3>" + eventoHoy.openingHoursEs + ' h' + "</h3>";

    // Metemos el contenedor con los datos de dónde en el contenedor de la izquierda
    // Como el dato de la url de sala de conciertos a veces la api no la facilita, mostraremos texto de  
    // que esa info no está disponible en caso que el dato sea undefined
    contLeft.appendChild(contDondeT);
    contDondeT.classList.add('contPreguntaT');
    contDondeT.innerHTML += "<h3 class='preguntaT'>" + '¿DÓNDE? ' + "</h3>";
    contDondeT.appendChild(contDondeElemntsT);
    if (eventoHoy.urlEventEs != undefined) {
        contDondeElemntsT.classList.add('contDondeElmntsT');

        // Usamos el atributo "target='_blank'" para que abra el enlace en otra pestaña del nav
        contDondeElemntsT.innerHTML += "<a id='linkSala' target='_blank' href= '" + eventoHoy.urlEventEs + "'>" + eventoHoy.establishmentEs + "</a>" + " | ";
        contDondeElemntsT.innerHTML += "<h3>" +  eventoHoy.municipalityEs + "</h3>";
    } else {
        contDondeElemntsT.innerHTML += "<p>" + "Dato no disponible |" + "</p>";
        contDondeElemntsT.innerHTML += "<h3>" +  eventoHoy.municipalityEs + "</h3>";
    }

    // Metemos el contenedor con los datos de dónde en el contenedor de la izquierda
    // En caso de no obtener ese dato también mostraremos texto advirtiendo de que no disponemos esa info
    contLeft.appendChild(contPrecioT);
    contPrecioT.classList.add('contPreguntaT');
    contPrecioT.innerHTML += "<h3 class='preguntaT'>" + 'PRECIO:' + "</h3>";
    if (eventoHoy.priceEs != undefined) {
        contPrecioT.innerHTML += "<h3 class='precio'>" + eventoHoy.priceEs + "</h3>";
    } else {
        contPrecioT.innerHTML += "<p id='textoArticulo'>" + "Precio de entrada no disponible" + "</p>";
    }

    // El resto de datos los introducimos en el contenedor de la derecha (nombre/descripción/link de compra)
    // Si el dato de la descripción es undefined, mostramos texto de advertencia
    // Si el dato del link de compra es undefined, simplemente no mostramos el contenedor de compra con img y link
    contRow.appendChild(contRight);
    contRight.classList.add('contRight');

    contRight.innerHTML += "<h2 id='titleToday'>" + eventoHoy.nameEs + "</h2>";

    if (eventoHoy.descriptionEs != undefined) {
        contRight.innerHTML += "<p class='textoArticuloT'>" + eventoHoy.descriptionEs + "</p>";
    } else {
        contRight.innerHTML += "<p class='textoArticuloT'>" + "Descripción del evento no disponible" + "</p>";
    }

    if(eventoHoy.purchaseUrlEs != undefined) {
        contRight.appendChild(contCompra);
        contCompra.classList.add('contCompra');
        contCompra.innerHTML += "<img src='img/boleto.png' id='imgticket2' alt='Entradas'>";
        contCompra.innerHTML += "<a id='linkCompraT' target='_blank' href= '" + eventoHoy.purchaseUrlEs + "'>" + ' COMPRAR ENTRADA' + "</a>";
    }
}