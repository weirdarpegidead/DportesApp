//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function eventos(){

    this.nombre
    this.descripcion
    this.ubicacion
    this.equipo
    this.fecha
    this.hora
    this.tipo
    this.periodo

    this.addEvento = function(){
    	if(this.validaEvento()){
            var xhr = new XMLHttpRequest();
            var add = new FormData();
            add.append('nombre_evento',this.nombre);
            add.append('ubicacion_evento',this.ubicacion);
            add.append('hora_evento',this.hora);
            add.append('fecha_evento',this.fecha);
            add.append('tipo_evento',this.tipo);
            add.append('id_equipo',localStorage.getItem('equipo'));
            if(sessionStorage.getItem('evento')){
                add.append('id',sessionStorage.getItem('evento'));
            }
            xhr.open('POST', path + 'app/addEvento');
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(add);
            $.mobile.loading('show');
            xhr.timeout = 10000;
            xhr.ontimeout = function () {
                $.mobile.loading('hide');
                navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
            };
            /*xhr.onprogress = function(){
                alert('progress');
            };*/
            xhr.onerror = function(e){
                alert("Ocurrio un error inesperado");
            };
            xhr.onload = function(e){
                $.mobile.loading('hide');
                //alert('asdasd' + this.status);
                if(this.status == 200){
                    //alert(this.response);
                    if(isNumeric(this.response)){
                        //alert(this.response);
                        sessionStorage.evento = this.response;
                        //alert(sessionStorage.evento);
                        $.mobile.navigate("#seleccionar-titulares", {transition: "fade"});
                        //document.getElementById('reg-email-duplicate-error').style.display = "block";
                    } else {
                        navigator.notification.alert('Ocurrio un error, intentelo nuevamente',function(){},'Atención','OK');
                        //$.mobile.navigate("#registro-equipo", {transition: "slide"});
                    }
                } else {
                    navigator.notification.alert('Se un error inesperado, intentelo nuevamente',function(){},'Atención','OK');
                }
            };
        } 
    }

    this.getPeriodos = function(){
        var xhr = new XMLHttpRequest();
        //var add = new FormData();
        //add.append('periodo',document.getElementById('pg-periodo').value);
        xhr.open('POST', path + 'app/getPeriodos');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var hasta = document.getElementById('pg-periodo').value
                    var inc = '';
                    $("#set-periodos").html(inc).trigger('create');
                    for(var i = 0; i < json.length; i++ ){ 
                        if(json[i].id_periodo_futbol <= hasta){
                            inc = '<a id="periodo'+json[i].id_periodo_futbol+'" href="#acciones" class="ui-btn color-boton" onclick="setPeriodoLocal('+json[i].id_periodo_futbol+',\''+json[i].nombre+'\')">'+json[i].nombre+'</a>';
                            $("#set-periodos").append(inc).trigger('create');
                        }
                    }
                    inc = '<a onclick="closeEvent()" href="#" class="ui-btn color-boton">Finalizar Partido</a>';
                    $("#set-periodos").append(inc).trigger('create');
                }
            }
        }
    }

    this.getHistorialPartidos = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',this.equipo);
        xhr.open('POST', path + 'app/getHistorial');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 5000;
        xhr.send(send);
        $.mobile.loading('show');
        xhr.ontimeout = function(e) {
            $('#custom-format-listview').html('').listview('refresh');
            $.mobile.loading('hide');
            navigator.notification.alert('No se recibe respuesta del servidor',function(){},'Atención','OK');
        }
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.onload = function(e){
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    for(var i = 0; i < json.length; i++ ){
                        inc += '<li data-icon="false">';
                        inc += '<a onclick="setParametrosEstadisticos('+json[i].id_evento+','+json[i].equipos_id_equipo+')" data-transition="fade" class="fechas" id="contenedor-fechas">';
                        inc += '<div class="contenedor-fechas">';
                        inc += '<div class="centrado-fechas">';
                        inc += '<div class="block"><img src="jquerymobile/img-dportes/logo-encuentro.png"><p class="nombre-equipo">'+localStorage.getItem('nombre_equipo')+'</p></div>';
                        inc += '<div class="vs">VS</div>';
                        inc += '<div class="block"><img src="jquerymobile/img-dportes/logo-encuentro.png"><p class="nombre-equipo">'+json[i].nombre+'</p></div>';
                        inc += '<div class="fecha-partido">Jugado el: '+getFecha(json[i].fecha_evento)+'</div>';
                        inc += '</div>';
                        inc += '</div>';
                        inc += '</a>';
                        inc += '</li>';
                    }
                    $('#custom-format-listview').html(inc).listview('refresh');
                }
            } else {
                navigator.notification.alert('No hay respuesta desde el servidor, intentelo nuevamente',function(){},'Atención','OK');
            }
        }
    }

    this.getEquipoAndRival = function(){
        var xhr = new XMLHttpRequest();
        var add = new FormData();
        add.append('id_evento',sessionStorage.getItem('evento'));
        add.append('id_equipo',localStorage.getItem('equipo'));
        xhr.open('POST', path + 'app/getEquipoAndRival');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(add);
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    document.getElementById('acc-equipo').innerHTML = json.equipo;
                    document.getElementById('acc-rival').innerHTML = json.rival;
                    document.getElementById('stat-equipo').innerHTML = json.equipo;
                    document.getElementById('stat-rival').innerHTML = json.rival;
                }
            }
        }
    }

    this.validaEvento = function(){
    	var bNombre 	= false;
    	var bUbicacion	= false;
    	var bFecha 		= false;
    	var bHora 		= false;
    	var bPeriodo 	= false;

    	if(this.nombre.trim().length <= 0){
            document.getElementById('pg-nombre-error').style.display = "block";
    	} else {
            document.getElementById('pg-nombre-error').style.display = "none";
    		bNombre = true;
    	}

    	if(this.ubicacion.trim().length <= 0){
            document.getElementById('pg-ubicacion-error').style.display = "block";
    	} else {
            document.getElementById('pg-ubicacion-error').style.display = "none";
    		bUbicacion = true;
    	}

    	if(this.fecha.trim().length <= 0){
            document.getElementById('pg-fecha-error').style.display = "block";
    	} else {
            document.getElementById('pg-fecha-error').style.display = "none";
    		bFecha = true;
    	}

    	if(this.hora.trim().length <= 0){
            document.getElementById('pg-hora-error').style.display = "block";
    	} else {
            document.getElementById('pg-hora-error').style.display = "none";
    		bHora = true;
    	}

    	if(this.periodo.trim().length <= 0){
            document.getElementById('pg-periodo-error').style.display = "block";
    	} else {
            document.getElementById('pg-periodo-error').style.display = "none";
    		bPeriodo = true;
    	}

    	if(bNombre && bUbicacion && bFecha && bHora && bPeriodo){
    		return true;
    	} else {
    		return false;
    	}
    }

}


function setPeriodoLocal(id,nombre){
    sessionStorage.periodo = id;
    sessionStorage.nPeriodo = nombre;
}

function closeEvent(){
    sessionStorage.removeItem('periodo');
    sessionStorage.removeItem('nPeriodo');
    sessionStorage.removeItem('evento');
    sessionStorage.removeItem('accIDTitular');
    $("#set-titulares").html('').trigger('create');
    $.mobile.navigate("#home", {transition: "fade"});
}


$(document).on("pagebeforeshow","#panel-juego",function(){
    var pg = new eventos();
    pg.getPeriodos();
    delete pg;
});

document.getElementById('pg-registro-next').addEventListener('click',function(){

    event.preventDefault();
    var pg = new eventos();
    pg.nombre 		= document.getElementById('pg-rival').value;
    pg.ubicacion 	= document.getElementById('pg-ubicacion').value;
    pg.fecha 		= document.getElementById('pg-fecha').value;
    pg.hora 		= document.getElementById('pg-hora').value;
    pg.periodo 		= document.getElementById('pg-periodo').value;
    pg.tipo 		= 1;
    pg.addEvento();
    delete pg;
});

document.getElementById('pg-registro').addEventListener('click',function(){

    event.preventDefault();
    var pg = new eventos();
    pg.nombre 		= document.getElementById('pg-rival').value;
    pg.ubicacion 	= document.getElementById('pg-ubicacion').value;
    pg.fecha 		= document.getElementById('pg-fecha').value;
    pg.hora 		= document.getElementById('pg-hora').value;
    pg.periodo 		= document.getElementById('pg-periodo').value;
    pg.tipo 		= 1;
    pg.addEvento();
    delete pg;
});
