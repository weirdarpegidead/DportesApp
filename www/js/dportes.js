//CLASS DPORTES

function dportes(){

	this.nombre
	this.descripcion
	this.estado

	this.getDportes = function(){
		var xhr = new XMLHttpRequest();
	    xhr.open('POST', path + 'app/getDportes');
	    xhr.setRequestHeader('Cache-Control', 'no-cache');
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    xhr.send();
	    xhr.onload = function(e){
	        if(this.status == 200){
 				if(!JSON.parse(this.response).length == 0){
 					var json =  JSON.parse(this.response);
 					var inc = "<legend>Elija el Deporte al cual desea pertenecer:</legend>";
 					for(var i = 0; i < JSON.parse(this.response).length; i++ ){
 						if(i == 0){
  							inc += "<input name='reg-dporte' id='reg-dp-"+json[i].id_deporte+"' value='"+json[i].id_deporte+"' type='radio' checked>";
 						} else {
 							inc += "<input name='reg-dporte' id='reg-dp-"+json[i].id_deporte+"' value='"+json[i].id_deporte+"' type='radio'>";
                        }
                        inc += "<label for='reg-dp-"+json[i].id_deporte+"'>"+json[i].nombre+"</label>";
 					}
 					document.getElementById('reg-dportes').innerHTML = inc;
 				}
	        }
	    }
	}

}