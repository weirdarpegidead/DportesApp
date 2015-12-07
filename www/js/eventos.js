//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function eventos(){

    this.id_evento
    this.nombre
    this.descripcion
    this.ubicacion
    this.equipo
    this.fecha
    this.hora
    this.tipo
    this.periodo
    this.bool = true;

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
                navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
            };
            xhr.onload = function(e){
                $.mobile.loading('hide');
                //alert('asdasd' + this.status);
                if(this.status == 200){
                    //alert(this.response);
                    if(isNumeric(this.response)){
                        if(!sessionStorage.getItem('evento')){
                            sessionStorage.evento = this.response;
                            navigator.notification.confirm(
                                '¿Desea jugar el partido ahora',
                                function(button){
                                    if(button == 1){
                                        $.mobile.navigate("#seleccionar-titulares", {transition: "fade"});
                                    } else {
                                        sessionStorage.removeItem('evento');
                                        $.mobile.navigate("#home", {transition: "fade"});
                                    }
                                },
                                'Atención',
                                'Si,No'
                            );
                        } else {
                            $.mobile.navigate("#seleccionar-titulares", {transition: "fade"});
                        }
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

    this.getEvento = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',this.id_evento);
        xhr.open('POST', path + 'app/getEvento');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        $.mobile.loading('show');
        xhr.timeout = 10000;
        xhr.ontimeout = function () {
            $.mobile.loading('hide');
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
        };
        xhr.onerror = function(e){
             $.mobile.loading('hide');
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
        };
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var s = json.fecha_evento;
                    var bits = s.split(/\D/);
                    var date = new Date(bits[0], --bits[1], bits[2], bits[3], bits[4]);
                    document.getElementById('pg-rival').value = json.nombre;
                    document.getElementById('pg-ubicacion').value = json.ubicacion;
                    document.getElementById('pg-hora').value = date.getHours() +':'+('0'+date.getMinutes()).slice(-2);;
                    //document.getElementById('pg-fecha').value = date.getDate() + '-' + ('0'+(date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear(); 
                    document.getElementById('pg-fecha').value = ('0'+date.getDate()).slice(-2) + '-' + ('0'+(date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear(); 

                }
            }
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
                    var periodos = [];
                    var json = JSON.parse(this.response);
                    var hasta = document.getElementById('pg-periodo').value
                    var inc = '';
                    var disabled = '';
                    $("#set-periodos").html(inc).trigger('create');
                    for(var i = 0; i < json.length; i++ ){ 
                        if(json[i].id_periodo_futbol <= hasta){
                            if(sessionStorage.getItem('periodosJugados')){
                                periodos = JSON.parse(sessionStorage.getItem('periodosJugados'));
                                disabled = checkPeriodo(json[i].id_periodo_futbol,periodos);
                            }
                            inc = '<a id="periodo'+json[i].id_periodo_futbol+'" href="#acciones" class="ui-btn color-boton '+disabled+'" onclick="setPeriodoLocal('+json[i].id_periodo_futbol+',\''+json[i].nombre+'\')">'+json[i].nombre+'</a>';
                            $("#set-periodos").append(inc).trigger('create');
                        }
                    }
                    //inc = '<a onclick="closeEvent()" href="#" class="ui-btn color-boton">Finalizar Partido</a>';
                    //$("#set-periodos").append(inc).trigger('create');
                }
            }
        }
    }

    this.getHistorialPartidos = function(){
        var offset = 0;
        if ( $('#custom-format-listview li').length > 0 && this.bool == false) {
            offset = $('#custom-format-listview li').length;
        } else {
            $('#custom-format-listview').html('').listview('refresh');
        }
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',this.equipo);
        send.append('offset',offset);
        xhr.open('POST', path + 'app/getHistorial');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.send(send);
        $.mobile.loading('show');
        xhr.ontimeout = function(e) {
            //$('#custom-format-listview').html('').listview('refresh');
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
                    $('#custom-format-listview').append(inc).listview('refresh');
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

    this.getProgramados = function(){
        var offset = 0;
        if ( $('#pro-list li').length > 0 && this.bool == false) {
            offset = $('#pro-list li').length;
        } else {
            $('#pro-list').html('').listview('refresh');
        }
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',this.equipo);
        send.append('offset',offset);
        xhr.open('POST', path + 'app/getProgramados');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.send(send);   
        xhr.ontimeout = function(e) {
            $.mobile.loading('hide');
            navigator.notification.alert('No se recibe respuesta del servidor',function(){},'Atención','OK');
        }
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.onload = function(){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    for(var i = 0; i < json.length; i++ ){
                        inc += '<li data-icon="false">';
                        inc += '<a href="#" data-transition="fade" class="fechas" onclick="setParametrosProgramados('+json[i].id_evento+')" id="contenedor-fechas">';
                        inc += '<div class="contenedor-fechas">';
                        inc += '<div class="centrado-fechas">';
                        inc += '<div class="block"><img src="jquerymobile/img-dportes/logo-encuentro.png"><p class="nombre-equipo">'+localStorage.getItem('nombre_equipo')+'</p></div>';
                        inc += '<div class="vs">VS</div>';
                        inc += '<div class="block"><img src="jquerymobile/img-dportes/logo-encuentro.png"><p class="nombre-equipo">'+json[i].nombre+'</p></div>';
                        inc += '<div class="fecha-partido">Programado: '+getFecha(json[i].fecha_evento)+'</div>';
                        inc += '</div>';
                        inc += '</div>';
                        inc += '</a>';
                        inc += '</li>';                    
                    }
                    $('#pro-list').append(inc).listview('refresh');
                    $.mobile.loading('hide');
                }
            }
        }   
    }

    this.cambiaTipo = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',this.id_evento);
        send.append('id_tipo',this.tipo);
        xhr.open('POST', path + 'app/cambioTipoEvento');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.send(send);
    }

    this.checkProgramados = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',this.equipo);
        xhr.open('POST', path + 'app/checkProgramados');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.timeout = 10000;
        xhr.send(send);
        xhr.ontimeout = function(e) {
            $.mobile.loading('hide');
            navigator.notification.alert('No se recibe respuesta del servidor',function(){},'Atención','OK');
        }
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.onload = function(e){
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response){
                    $.mobile.navigate("#p-pro", {transition: "fade"});
                } else {
                    $.mobile.navigate("#add-partido", {transition: "fade"});                   
                }
            } else {
                navigator.notification.alert('Se detectaron problemas con el servidor\nIntentelo más tarde',function(){},'Atención','OK');
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

function setParametrosProgramados(evento){
    sessionStorage.evento = evento;
    $.mobile.navigate("#add-partido", {transition: "fade"});
}


function setPeriodoLocal(id,nombre){
    sessionStorage.periodo = id;
    sessionStorage.nPeriodo = nombre;
}

function closeSessionEvents(){
    if(sessionStorage.getItem('evento')){
        var ev = new eventos();
        ev.id_evento = sessionStorage.getItem('evento');
        ev.tipo = 3;
        ev.cambiaTipo();
        delete ev;
    }   
    sessionStorage.removeItem('periodo');
    sessionStorage.removeItem('nPeriodo');
    sessionStorage.removeItem('evento');
    sessionStorage.removeItem('accIDTitular');
    sessionStorage.removeItem('periodosJugados');
    sessionStorage.removeItem('amarillas')   
}

function closeEvent(){
    if(sessionStorage.getItem('evento')){
        var ev = new eventos();
        ev.id_evento = sessionStorage.getItem('evento');
        ev.tipo = 3;
        ev.cambiaTipo();
        delete ev;
    } 
    sessionStorage.removeItem('periodo');
    sessionStorage.removeItem('nPeriodo');
    sessionStorage.removeItem('evento');
    sessionStorage.removeItem('accIDTitular');
    sessionStorage.removeItem('periodosJugados');
    sessionStorage.removeItem('amarillas')
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

function checkProgramados(){
    $.mobile.loading('show');
    event.preventDefault();
    var ev = new eventos();
    ev.equipo = localStorage.getItem('equipo');
    ev.checkProgramados();
    delete ev;
}


