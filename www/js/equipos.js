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

	this.getMisEquipos = function(){
		var xhr = new XMLHttpRequest();
		var send = new FormData();
		send.append('id',localStorage.getItem('id'));
	    xhr.open('POST', path + 'app/getMisEquipos');
	    xhr.setRequestHeader('Cache-Control', 'no-cache');
	    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	    xhr.send(send);
        xhr.timeout = 10000;
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.ontimeout = function(e){
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
        }
        xhr.onload = function(e){
	    	if(this.status == 200){
	    		if(this.response){
	    			var json = JSON.parse(this.response);
	    			var inc = '';
	    			for(var i = 0; i < json.length; i++ ){
	                    inc += "<li>";
	                    inc += "<span class='delete'>";
	                    inc += "<div class='centra_texto'>Salir</div>";
	                    inc += "</span>";
	                    inc += "<span class='more'>";
	                    inc += "<div class='centra_texto'>Actual</div>";
	                    inc += "</span>";
	                    inc += "<a href='#' draggable='false'><img src='jquerymobile/img-dportes/logo-encuentro.png'>";
	                    inc += "<h2>"+json[i].nombre+"</h2>";
	                    inc += "<span class='flagged'>";
	                    inc += "</span>";
	                    inc += "</a>";
	                    inc += "</li>";
	    			}
	    			$("#eq-list").html(inc).listview('refresh');
                    $.mobile.loading('hide');
	    		}
	    	}
        }
	}

	this.setSwipe = function(){
		$( document ).on("swipeleft", "ul#eq-list li a", function (e) {
	    $(this).prevAll("span").addClass("show");
	    $(this).off("click").blur();
	    $(this).css({
	         	transform: "translateX(-139px)" //139
	    	}).one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
		    	$(this).one("swiperight", function () {
		        	$(this).prevAll("span").removeClass("show");
		        	$(this).css({
		            	transform: "translateX(0)"
		        	}).blur();
		    	});
	    	});
		});
	}

}
