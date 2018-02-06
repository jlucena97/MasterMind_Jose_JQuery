let masterMind = (function(){
		//Varaibles del programa
			let colores = ["red","white","black","yellow","orange","brown","blue","green"];
			let random = [];
			let elegidos = [];
			let acertadas = [];
			let restantes = [];
			let win = 0;
			//Copias
			let copiaRandom = [];
			let copiaElegidos = [];
			//Contadores Negras y Blancas
			let negras = 0;
			let blancas = 0;

		//Funcion init que inicializa y crea una serie aleatoria de 4 colores
		let init = function(){
			//Reinicializa el array random cada vez que se crea una nueva partida
			random = [];
			$("#reiniciar").on("click", reiniciar);
			//Oculta el boton salir
			$("#salir").css("display","none");
			//Elimina la funcionalidad anterior del boton comprobar 
			$("#comprobar").off();
			//Le damos una nueva funcionalidad al boton comprobar
			$("#comprobar").on("click",generarElegidas);
			//Deshabilitamos el boton comprobar
			$("#comprobar").prop("disabled",true);
			//Le quitamos el estilo
			$("#comprobar").css("opacity","0.5");

			//Llamamos a los métodos que le dan funcionalidad a los botones
			$(".option").on("click",quitarColor);
			//Eliminamos el método de los colores
			$(".color").off();
			//Vol
			$(".color").on("click",dibujar);

			$(".color").each(function(){
				$(this).css("background-color",this.value);
			});

			$( "#dialogo" ).dialog({
				autoOpen: false,
				show: {
					effect: "blind",
					duration: 1000
				},
				hide: {
					effect: "explode",
					duration: 1000
				}
			});
			//Invalidamos los botones
			$(".result").prop("disabled",true);
			//Creamos los 4 colores aleatorios de los 8 establecidos
			for (var b = 0; b < 4; b++) {
				let numAleatorio = Math.floor(Math.random() * colores.length);
				random.push(colores[numAleatorio]);
			}
		}

		//Función que quita el color y devuelve al boton a su estado inicial
		let quitarColor = function(){
			this.value = "w";
			this.style.background = "grey";
			//Deshabilitamos el boton comprobar
			$("#comprobar").prop("disabled", true);
			$("#comprobar").css("opacity","0.5");
		}

		//Método dibujar que como dice el nombre dibuja los colores objetivos dependiendo del color asignado
		let dibujar = function(){
			let restantes = [];
			$(".option").each(function(){
				if(this.value === "w"){
					restantes.push(this);
				}
			});
	
			if(restantes.length !== 0){
				//Modificamos el valor del primer elemento no pintado y su color
				restantes[0].value = this.value;
				restantes[0].style.background=this.value;
			}

			if(restantes.length <= 1){
				//Si se ha completado la fila activamos el boton
				$("#comprobar").prop("disabled", false);
				$("#comprobar").css("opacity", "1");
			}	
		}

		//Añade una nueva fila de botones objetivos, los recoge y les da funcionalidad
		let nuevoIntento = function(){
			$("#resultado").append('<div>'+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<span class="space"></span> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'</div><br/>');

			$(".option").on("click",quitarColor);
			$("#resultado").scrollTop(0);
		}

		//Método que pasa a un array los 4 elementos elegidos
		let generarElegidas = function(){
			//Se reiniciliza las variables cada vez que se le da al boton comprobar
			acertadas = [];
			elegidos = [];
			copiaElegidos = [];
			copiaRandom = [];
			win = 0;
			negras = 0;
			blancas = 0;
			//Deshabilitamos el boton comprobar
			$("#comprobar").prop("disabled",true);
			$("#comprobar").css("opacity","0.5");
			//Recogemos los valores pintados
			$(".option:enabled").each(function(){
				console.log(this.value);
				elegidos.push(this.value);
				$(this).prop("disabled",true);
				$(this).css("cursor","not-allowed");
			});
			//Llamamos a los métodos que desarrollan el programa
			generarCopias();
			comprobarCoincidencia();
			//Si no ha ganadado muestra un nuevo intento
			if(mostrarResultado()){
				nuevoIntento();
			}

		}
		//Método mostrar (Solo sirve para ver los distintos colores aleatorio y el elegido por el usuario)
		let mostrar = function(){
			for (var i = 0; i < random.length; i++) {
				console.log(random[i]);
			}
		}

		//Generamos copias del elegido por el usuario y por el random para poder modificarlo y comprobar su similitud
		let generarCopias = function(){
			for (var i = 0; i < random.length; i++) {
				copiaRandom.push(random[i]);
			}
			for (var a = 0; a < elegidos.length; a++) {
				copiaElegidos.push(elegidos[a]);
			}
		}

		//El método más importante, que comprueba si hemos acertado un color o si hemos acertado color y posición.
		function comprobarCoincidencia(){
			for (var i = 0; i < random.length; i++) {
				if(random[i] === elegidos[i]){
					//Añadimos a un array acertados los elementos acertados.
					negras++;
					copiaRandom[i] = 2;
					copiaElegidos[i] = 0;
				}
			}
			for (var a = 0; a < copiaElegidos.length; a++) {
					if(copiaRandom.indexOf(copiaElegidos[a]) != -1){
						copiaRandom[copiaRandom.indexOf(copiaElegidos[a])] = 1;
						blancas++;
					}
				}
			}
		//Mostramos el resultado en su linea respectiva
		let mostrarResultado = function(){
			let restantesEspacios = [];
		
			$(".result").each(function(){
				if(this.value === "v")
					restantesEspacios.push(this);
			});

			for (var c = 0; c < restantesEspacios.length; c++) {
				restantesEspacios[c].value="f";
				if(negras > c){
					restantesEspacios[c].style.background = "black";
				}
				if(c >= negras){
					//console.log((negras+blancas));
					if((negras + blancas) > c){
						restantesEspacios[c].style.background = "white";
					}
				}
			}
			//Comprobamos si ha ganado	
			if(negras === 4){
				$("#dialogo").dialog("open");
				//Mostramos el boton salir
				$("#salir").css("display","block");
				//Deshabilitamos los botones de los colores
				$(".color").prop("disabled",true);
				//Deshabilitamos los botones objetivos
				$(".option").prop("disabled",true);
				
				return false;
			}
			return true;
		}

		//Método limpiar que crea un nueva fila de botones objetivo
		let limpiar = function(){
			$("#resultado").html('<div>'+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<button class="option" value="w"></button> '+
				'<span class="space"></span> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'<button class="result" value="v"></button> '+
				'</div><br/>');
		}

		//Método reiniciar que devuelve los valores iniciales
		let reiniciar = function(){
			$("#ganador").html("Mastermind Juego (JQUERY)");

			$(".color").prop("disabled",false);
			
			$("#dialogo").dialog("close");

			limpiar();

			init();
		}
		
		return{
			init:init,
			mostrar:mostrar,
			comprobar:comprobarCoincidencia,
			resultado:mostrarResultado
		}
	})();

$().ready(function(){
	masterMind.init();	
});
