//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function registro(){

	this.nombre
    this.apellido
    this.email
    this.password
    this.password_match
    this.equipo
    this.dporte
    this.condiciones
    this.mensaje = [
                	"Ingrese el nombre",
                	"Ingrese el apellido",
                	"Ingrese un correo valido",
                	"Ingrese un password con mas de 5 caracteres",
                    "La password no coincide"
              		]

    this.Emensaje = [
                    "Ingrese el nombre del equipo",
                    "Seleccione un deporte para su equipo",
                    "Debe aceptar las condiciones y terminos de uso"
                    ]


    this.registrar = function(){
    	if(this.validar()){
	      	var xhr = new XMLHttpRequest();
	        var registro = new FormData(document.getElementById('form-registro-usuario'));
	        xhr.open('POST', path + 'auth/validaUsuario');
	        xhr.setRequestHeader('Cache-Control', 'no-cache');
	        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	        xhr.send(registro);
	        xhr.onload = function(e){
	            if(this.status == 200){
                    if(this.response){
                        document.getElementById('reg-email-duplicate-error').style.display = "block";
                    } else {
                        //alert('formulario correcto, puede proceder.');
                        //window.location.href = window.location.href + '#registrar';
                        $.mobile.navigate("#registro-equipo", {transition: "slide"});
                    }
	            }
	        }
	    }
    }

    this.registrarEquipo = function(){
        if(this.validarEquipo()){
            var xhr = new XMLHttpRequest();
            var registro = new FormData();
            registro.append('nombre_usuario',document.getElementById('reg-nombre').value);
            registro.append('apellido_usuario',document.getElementById('reg-apellido').value);
            registro.append('email_usuario',document.getElementById('reg-email').value);
            registro.append('password_usuario',document.getElementById('reg-password').value);
            registro.append('nombre_equipo',document.getElementById('reg-nequipo').value);
            registro.append('dporte_equipo',document.querySelector('input[name="reg-dporte"]:checked').value);

            xhr.open('POST', path + 'auth/registrar');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(registro);
            xhr.onload = function(e){
                //alert(this.response);
                //alert(this.status);
                if(this.status == 200){
                    if(this.response && JSON.parse(this.response)){
                        //alert(this.response);
                        var json =  JSON.parse(this.response);
                        localStorage.setItem("id", json.usuario);
                        localStorage.setItem("equipo" , json.equipo);
                        localStorage.setItem("login", json.login);
                        localStorage.setItem("nombre_equipo",document.getElementById('reg-nequipo').value);
                        $.mobile.navigate("#home", {transition: "fade"});
                    } else {
                        document.getElementById('reg-disponible').style.display = "none";
                        document.getElementById('reg-no-disponible').style.display = "block";
                    }
                }
            }
        }
    }

    this.validar = function(){
    	var bNombre 	= false;
    	var bApellido 	= false;
    	var bEmail 		= false;
    	var bPassword 	= false;

    	if(this.nombre.trim().length <= 0){
            document.getElementById('reg-nombre-error').style.display = "block";
    	} else {
            document.getElementById('reg-nombre-error').style.display = "none";
    		bNombre = true;
    	}

    	if(this.apellido.trim().length <= 0){
    		document.getElementById('reg-apellido-error').style.display = "block";
    	} else {
            document.getElementById('reg-apellido-error').style.display = "none";
    		bApellido = true;
    	}

    	if(validaEmail(this.email)){
    		document.getElementById('reg-email-format-error').style.display = "block";
    	} else {
            document.getElementById('reg-email-format-error').style.display = "none";
    		bEmail = true;
    	}

    	if(this.password.length < 5 || this.password.trim().length <= 0){
    		document.getElementById('reg-password-min-error').style.display = "block";
    	} else  if(this.password == this.password_match){
            document.getElementById('reg-password-min-error').style.display = "none";
            document.getElementById('reg-password-match-error').style.display = "none";
    		bPassword = true;
    	} else {
            document.getElementById('reg-password-match-error').style.display = "block";
        }

    	if(bNombre && bApellido && bEmail && bPassword){
    		return true;
    	} else {
    		return false;
    	}
    }

    this.validarEquipo = function(){
        var bEquipo         = false;
        var bDporte         = false;
        var bCondiciones    = false;

        if(this.equipo.trim().length <= 0){
            document.getElementById('reg-no-disponible').style.display = "block";
            document.getElementById('reg-disponible').style.display = "none";
        } else {
            document.getElementById('reg-no-disponible').style.display = "none";
            document.getElementById('reg-disponible').style.display = "block";
            bEquipo = true;
        }

        if(this.dporte == "undefined"){
            alert(this.Emensaje[1]);
        } else {
            bDporte = true;
        }

        if(!this.condiciones){
            document.getElementById('reg-condiciones-error').style.display = "block";
        } else {
            document.getElementById('reg-condiciones-error').style.display = "none";
            bCondiciones = true;
        }

        if(bEquipo && bDporte && bCondiciones){
            return true;
        } else {
            return false;
        }
    }

}


document.getElementById('registrar-usuario').addEventListener('click',function(){
    
    event.preventDefault();
	var reg = new registro();
	reg.nombre 		      = document.getElementById('reg-nombre').value;
    reg.apellido 	      = document.getElementById('reg-apellido').value;
    reg.email    	      = document.getElementById('reg-email').value;
    reg.password 	      = document.getElementById('reg-password').value;
    reg.password_match    = document.getElementById('reg-password_matches').value;
    reg.registrar();
    delete reg;
});

document.getElementById('registrar-usuario-next').addEventListener('click',function(){

    var reg = new registro();
    reg.nombre            = document.getElementById('reg-nombre').value;
    reg.apellido          = document.getElementById('reg-apellido').value;
    reg.email             = document.getElementById('reg-email').value;
    reg.password          = document.getElementById('reg-password').value;
    reg.password_match    = document.getElementById('reg-password_matches').value;
    reg.registrar();
    delete reg;

});

document.getElementById('registrar-equipo').addEventListener('click',function(){

    event.preventDefault();
    var reg = new registro();
    reg.equipo      = document.getElementById('reg-nequipo').value;
    reg.dporte      = document.querySelector('input[name="reg-dporte"]:checked').value;
    reg.condiciones = document.getElementById('reg-condiciones').checked;
    reg.registrarEquipo();

});


document.getElementById('reg-nequipo').addEventListener('change', checkEquipo, false);

function checkEquipo(){
    var eq = new equipos();
    eq.nombre = document.getElementById('reg-nequipo').value;
    eq.checkEquipo();
}







