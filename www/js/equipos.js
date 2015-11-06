//CLASS EQUIPOS

function equipos(){

	this.nombre
	this.descripcion
	this.logo
	this.dporte
	this.comuna = 0
	this.estado

	this.checkEquipo = function(){
		var xhr = new XMLHttpRequest();
		var form = new FormData();
		form.append('equipo',this.nombre);
	    xhr.open('POST', path + 'app/checkEquipo');
	    xhr.setRequestHeader('Cache-Control', 'no-cache');
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    xhr.send(form);
	    xhr.onload = function(e){
	    	if(this.status == 200){
	    		if(this.response){
	    			document.getElementById('reg-disponible').style.display = "none";
	    			document.getElementById('reg-no-disponible').style.display = "block";
	    		} else {
	    			document.getElementById('reg-disponible').style.display = "block";
	    			document.getElementById('reg-no-disponible').style.display = "none";
	    		}
	    	}
	    }
	}

}