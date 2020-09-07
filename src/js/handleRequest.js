'use strict';

/*Esta clase maneja la respuesta del servidor y envia peticiones al mismo para cambiar
la puntuación del ranking global. Es una compilación de muchas páginas de internet para 
aprender como funciona y no habría sido posible gracias a muchísimas horas 
de trabajo y la ayuda de uno de los componentes de libreLab que nos dejó su servidor para "hostear" nuestro
archivo JSON y nos explicó cómo funcionan dichas peticiones.

Debido a no tener una base clara (ni ninguna), somos conscientes de cometer varios errores a la hora de formular dichas peticiones y
de tratar las respuestas.

Para entender el funcionamiento del mismo, en concreto el "mandaDatos", aconsejamos leer los métodos a los que se llamnan en su orden de llamada*/

var handleRequest = {};

var auxNombre;
	
  //A nuestro método de petición llegarán 2 booleanos de control.
  //Pinta -> Si queremos "imprimir" en el juego los datos que hemos recibido del servidor
  //MandaDatos -> Si queremos mandarle al servidor alguna información (nuevo jugador, eliminar jugador...)
  //Datos -> Si queremos mandar algo al servidor, estarán en un array llamado Datos, sino, llegará null

handleRequest.Peticion = function(juego, pinta, mandaDatos, Datos){
 
  var httpRequest; //creamos la variable para hacer la request
  var url = 'https://services.devpgsv.com/lent_xtreme/score.json'; //asignamos la url donde se encuentra el json a una variable
  var puntuacionAnterior = 0; //Asumimos que la puntuación que ha sacado el jugador anteriormente es la mínima

  //Haremos dos cosas distintas si mandamos los datos o solo recibimos información
  if(mandaDatos){
   auxNombre = Datos[0]; //Guardamos en una variable auxiliar el nombre de la persona que ha jugado para después comprobar si se encuentra en la lista del servidor
   makeRequest(auxNombre); //Hacemos la petición con el nombre de la persona ('GET') para que nos de la información y procesarla (Leer método antes de mandaInfo)
   setTimeout(function(){mandaInfo()}, 500); //Tras 0.5 segundos, mandaremos la información al servidor (con una nueva petición 'POST') después de haber procesado la respuesta anterior y haber comparado el nombre.
   //Somos conscientes de que este último método no es correcto, y que debería haber la comprobación el servidor. Pero ya que no está a nuestro alcance cambiar el mismo,
   //decidimos hacer este arreglo desde nuestro handleRequest. 
  }

  else //Si no mandamos datos, simplemente llamamos a "makeRequest" que recibe la información sin el parámetro de la persona
    makeRequest();
 
  function mandaInfo(){
    //El array de datos de la persona, que contiene en orden el nombre, la puntuación y el nivel al que ha llegado la persona
    var nombre = Datos[0];
    var punct = Datos[1];
    var nivel = Datos[2];
    
    //Si la puntuación actual es menor que la anterior, guardaremos la mayor puntuación de las dos y se lo diremos al jugador
    if(puntuacionAnterior > punct){
      alert("La puntuación que has conseguido (" +punct +") es menor que tu anterior puntuación " +nombre +"... (" +puntuacionAnterior +") \n\nSomos buenos y te guardamos la mejor ;)");
      punct = puntuacionAnterior;
    }

    var xhttp = new XMLHttpRequest(); //Crearemos las nueva petición
    xhttp.onreadystatechange = function() { //Tras hacer open y send, como en makeRequest, entraremos a procesar la información
      if (this.readyState == 4 && this.status == 200) { //Si se ha hecho la petición bien y el estado es correcto (XMLHttpRequest.DONE === 4 ---> código de estado)
        var data = JSON.parse(this.responseText); //Entonces parsearemos la información por si necesitasemos procesar algo más
        //Aquí podríamos avisar al usuario de que la respuesta ha sido registrada con éxito, que su respuesta ha sido guardada o si ha entrado o no al top 10 de jugadores
      }
    };
    xhttp.open("POST", "https://services.devpgsv.com/lent_xtreme/update.php", true); //Esta vez, la petición es del tipo 'POST' ya que vamos a escribir en el servidor
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); //Header para que funcione la petición
    xhttp.send("nombre="+nombre+"&punct="+punct+"&nivel="+nivel); //Mandamos al servidor los nuevos datos del usuario
  }

  function makeRequest(auxNombre) {

    httpRequest = new XMLHttpRequest(); //creamos la petición al servidor

    //Si la petición no se ha creado con éxito, crearemos un mensaje de error para avisar
    if (!httpRequest) {
      alert('Error: No se ha podido crear la instancia. \n Vuelva a intentarlo más tarde.');
      return false;
    }
    
    //Si la petición se ha creado correctamente, continuaremos

    //onreadystatechange se llamará DESPUÉS de haber hecho "open" y "send", por lo tanto será lo último que se haga (recomendamos leer open y send antes de continuar) 
    httpRequest.onreadystatechange = function(){
      //Después de haber hecho Open y Send, si se han realizado con éxito, pasaremos a procesar la petición

          if (httpRequest.readyState === XMLHttpRequest.DONE) { //Si la petición ha salido con éxito
            if (httpRequest.status === 200) { //Y el estado de la misma es correcto (200 === código de estados)

              //Entonces ha llegado la respuesta. Aquí podríamos avisar al usuario que se ha hecho con éxito, pero no es necesario
    var respuesta = JSON.parse(httpRequest.response); //Parseamos la respuesta que en este caso está en un archivo .JSON

    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    for(var i = 0; i < 10; i++){ //recorreremos los 10 primeros elementos de la lista
      var nombre;
      var punct;

      //Si no encontramos ningún dato en el JSON, diremos que está sin datos. Sino, asignaremos a nombre el del JSON
      if(respuesta.score[i] === undefined)
        nombre = "SIN DATOS";
      else 
        nombre = respuesta.score[i].nombre;

      //Mientras que si no existe la puntuación, la pondremos a 0, sino asignaremos a punct la del JSON correspondiente al nombre
      if(respuesta.score[i] === undefined)
        punct = "0";
      else 
        punct = respuesta.score[i].punct;
      
      //Si el booleano a la hora de llamar a handleRequest de pintar estaba a true, pintaremos en pantalla el resultado para todos 
      //los elementos que tengamos dentro del json en este caso hasta el número 10
      if (pinta){

        juego.add.text(300, 80 + i * 60, "NOMBRE: " + nombre, style);
        juego.add.text(710, 80 + i * 60, "PUNTUACION: " + punct, style);
      }

      //Vamos a ver si el nombre ya existe dentro del top 10 de puntuaciones. Si existe, guardamos su puntuación para despues
      //ver si pasamos los datos o no.
        if(mandaDatos && nombre === auxNombre){
          puntuacionAnterior = punct;
        }
      }
      }
        //Si la petición no se procesa con éxito, lanzaremos un error
       else {
        alert('Problema al procesar la petición.');
      }
    }
  }
    };

    httpRequest.open('GET', url, true); //Con la petición 'GET' pedimos al servidor, con la url dada y en modo asíncrono (true),
    //que nos devuelva lo que en ella haya (el archivo JSON) y lo abrimos
    httpRequest.send(); //Tras esto, enviamos al servidor la información que necesitemos enviar (si procede)
  }

module.exports = handleRequest;