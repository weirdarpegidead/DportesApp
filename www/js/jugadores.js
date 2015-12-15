//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function jugadores(){

    this.id_jugador
    this.id_equipo
    this.nombre
    this.email

    this.addJugador = function(){
    	if(this.validarJugador()){
    		var xhr = new XMLHttpRequest();
	        var add = new FormData();
	        add.append('nombre_usuario',this.nombre);
	        add.append('email_usuario',this.email);
	        add.append('equipo',localStorage.getItem('equipo'));
            add.append('nombre_equipo',localStorage.getItem('nombre_equipo'))
            if(document.querySelector('input[name="jg-radio-posicion"]:checked') !== null){
                add.append('posicion',document.querySelector('input[name="jg-radio-posicion"]:checked').value);
            } else {
                add.append('posicion',1);
            } 
	        xhr.open('POST', path + 'app/addJugador');
	        xhr.setRequestHeader('Cache-Control', 'no-cache');
	        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	        xhr.timeout = 10000;
            xhr.send(add);
            xhr.onprogress = function(e){
                $.mobile.loading('show');
            }
            xhr.ontimeout = function(e){
                navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
            }
	        xhr.onload = function(e){
                //$('#add-jg').removeClass('ui-disabled');
                $.mobile.loading('hide');
	            if(this.status == 200){
                    if(this.response == 1){
                    	document.getElementById('jg-nombre').value = '';
    					document.getElementById('jg-email').value = '';
                        navigator.notification.alert('Se agrego y notifico correctamente el jugador',function(){},'Atención','OK');
                    } else if(this.response == 2){
                        document.getElementById('jg-nombre').value = '';
                        document.getElementById('jg-email').value = '';
                        navigator.notification.alert('Se agrego e invito correctamente el jugador',function(){},'Atención','OK');
                    } else if(this.response == 3){
                        navigator.notification.alert('Lo sentimos pero este usuario fue eliminado en dportes.\n No se pudo agregar',function(){},'Atención','OK');
                    } else if(this.response == 4){
                        navigator.notification.alert('Este jugador ya es parte del equipo',function(){},'Atención','OK');
                    } else if(this.response == 5){
                        navigator.notification.confirm(
                            'Hemos detectado que este jugador ya formaba parte del equipo.\n ¿Desea reintegrarlo?',
                            function(button){
                                if(button == 1){
                                    var xhr = new XMLHttpRequest();
                                    var send = new FormData();
                                    send.append('email_usuario',document.getElementById('jg-email').value);
                                    send.append('equipo',localStorage.getItem('equipo'));
                                    send.append('nombre_usuario',document.getElementById('jg-nombre').value);
                                    if(document.querySelector('input[name="jg-radio-posicion"]:checked') !== null){
                                        send.append('posicion',document.querySelector('input[name="jg-radio-posicion"]:checked').value);
                                    } else {
                                        send.append('posicion',1);
                                    }
                                    xhr.open('POST', path + 'app/refundJugador');
                                    xhr.setRequestHeader('Cache-Control', 'no-cache');
                                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                                    xhr.timeout = 10000;
                                    xhr.send(add);
                                    xhr.onprogress = function(e){
                                        $.mobile.loading('show');
                                    }
                                    xhr.ontimeout = function(e){
                                        navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
                                    }
                                    xhr.onload = function(e){
                                        $.mobile.loading('hide');
                                        if(this.status == 200){
                                            navigator.notification.alert('El jugador se reintegro correctamente',function(){},'Atención','OK');
                                        }
                                    }
                                }
                            },
                            'Advertencia',
                            'Si,No');
                    }
	            }
	        }
    	}
    }

    this.getJugadores = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'))
        xhr.open('POST', path + 'app/getJugadores');
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
            //alert(this.response);
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    if(localStorage.getItem('rol') == 1){
                        var inc = '<a href="#add-jugadores"><div class="agregar_jugador"></div></a>';
                    } else {
                        var inc = '';
                    }
                    var checked = '';
                    $("#set-titulares").html(inc).trigger('create');
                    for(var i = 0; i < json.length; i++ ){
                        //if(json[i].titular != ''){
                            checked = (json[i].titular) ? 'checked':'';
                        //}       
                        inc = "<li data-icon='false' class='li-padding'>";
                        inc += "<input name='jg-titular[]' id='st"+json[i].id_usuario+"' type='checkbox' "+checked+" onclick='setTitular("+json[i].id_usuario+")'>";
                        inc += "<label for='st"+json[i].id_usuario+"'>";
                        inc += "<div class='imagen_jugador'><img src='jquerymobile/img-dportes/foto.png'></div>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p></label></li>";
                        $("#set-titulares").append(inc).trigger('create');
                    };
                    //document.getElementById('set-titulares').innerHTML = inc;
                } else {
                    navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
                }
            }
        }
    }

    this.getDeleteFunction = function(){
        var startLoc = null; 
        $(document).on( "touchstart", function(e){ 
            if( e.originalEvent.touches.length == 1 ) { // one finger touch 
                var touch = e.originalEvent.touches[ 0 ]; 
                startLoc = { x : touch.pageX, y : touch.pageY }; 
            } 
        }); 

        $(document).on( "touchmove", function(e){  
            if( startLoc ) { 
                var touch = e.originalEvent.touches[ 0 ];  
                if( Math.abs( startLoc.x - touch.pageX ) >  Math.abs( startLoc.y - touch.pageY ) ) { 
                    e.preventDefault(); 
                } 
                startLoc = null; 
            } 
        });

        $(document).on("click", "ul li span.delete", function () {
            var xhr = new XMLHttpRequest();
            var send = new FormData();
            var span = $(this);
            send.append('equipo',localStorage.getItem('equipo'));
            send.append('usuario',$(this).parent().val());
            xhr.open('POST', path + 'app/dropJugadorEquipo');
            xhr.timeout = 10000;
            xhr.setRequestHeader('Cache-Control', 'no-cache');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(send);

            xhr.onprogress = function(e){
                $.mobile.loading('show');
            }
            xhr.ontimeout = function(e){
                navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
            }
            xhr.onload = function(e){
                if(this.response){
                    var listview = span.closest("ul");
                    $(".ui-content").css({
                        overflow: "hidden"
                    });
                    span.parent().css({
                        display: "block"
                    }).animate({
                        opacity: 0
                    }, {
                        duration: 250,
                        queue: false
                    }).animate({
                        height: 0
                    }, 300, function () {
                        $(this).remove();
                        listview.listview("refresh");
                        $(".ui-content").removeAttr("style");
                    });
                    $.mobile.loading('hide');
                }
            }
        //}).on("click", "ul li span.more", function () {
         //   alert("nothing");
        }).on("swipeleft", "ul#jug-list li a", function (e) {
            $(this).prevAll("span").addClass("show");
            $(this).off("click").blur();
            $(this).css({
                transform: "translateX(-75px)" //139
            }).one("transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd", function () {
                $(this).one("swiperight", function () {
                    $(this).prevAll("span").removeClass("show");
                    $(this).css({
                        transform: "translateX(0)"
                    }).blur();
                });
            });
        }).on("click","#jug-borrar", function(){
            alert("pendiente la seleccion a traves de checkbox");
        });
    }

    this.getJugadoresEquipo = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',this.id_equipo);
        xhr.open('POST', path + 'app/getJugadoresByEquipo');
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
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    var disabled = '';
                    for(var i = 0; i < json.length; i++ ){
                        if(localStorage.getItem('rol_equipo') == 1){
                          disabled = (json[i].rol == 1) ? 'ui-state-disabled' : '';  
                        } else {
                            disabled = 'ui-state-disabled';
                        }
                        
                    inc += "<li value='"+json[i].id_usuario+"' class='li-padding'>";
                    inc += "<span class='delete "+disabled+"'>";
                    inc += "<div class='centra_texto'>Borrar</div>";
                    inc += "</span>";
                    /*inc += "<span class='more'>";
                    inc += "<p class='btn'>";
                    inc += "More"
                    inc += "</p>";
                    inc += "</span>";*/
                    inc += "<a href='#' draggable='false'><img src='jquerymobile/img-dportes/foto.png'>";
                    inc += "<h2>"+json[i].nombre+"</h2>";
                    inc += "<p>"+json[i].posicion+"</p>";
                    inc += "<span class='flagged ui-screen-hidden'>";
                    inc += "</span>";
                    inc += "</a>";
                    inc += "</li>";
                    /*    inc += "<li>";
                        inc += "<a href='#'><img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p>";
                        inc += "</a>";
                        inc += "<a href='#' class='ui-icon-borrar'>Delete</a>";
                        inc += "</li>";*/
                    };
                    $("#jug-list").html(inc).listview('refresh');
                    $.mobile.loading('hide');
                } else {
                    navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
                }
            }
        }
    }

    this.getJugadoresEstadisticas = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'))
        xhr.open('POST', path + 'app/getJugadoresEstadisticas');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onprogress = function(e){
            $.mobile.loading('show');
        }
        xhr.onload = function(e){
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    if(json.length != 0){
                        for(var i = 0; i < json.length; i++ ){
                            inc += "<li>";
                            inc += "<a onclick='setHistorialJG("+json[i].id_usuario+",\""+json[i].nombre+"\",\""+json[i].posicion+"\")' href='#' class='color-boton-equipo'><img src='jquerymobile/img-dportes/foto.png'>";
                            inc += "<h2>"+json[i].nombre+"</h2>";
                            inc += "<p>"+json[i].posicion+"</p>";
                            inc += "</a>";
                            inc += "</li>";
                        }
                    } else {
                        inc += "<li><h2>No se detectaron estadisticas para los jugadores</h2></li>";
                    }
                    $("#stat-jg-list").html(inc).listview('refresh');
                }
            }
        }       
    }

    this.setTitulares = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_usuario',this.id_jugador);
        send.append('id_evento',sessionStorage.getItem('evento'));
        send.append('id_equipo',localStorage.getItem('equipo'));
        xhr.open('POST', path + 'app/setTitular');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        /*xhr.onload = function(e){
            if(this.status == 200){
                alert(this.response);
            }
        }*/    
    }

    this.getTitulares = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',sessionStorage.getItem('evento'));
        send.append('id_equipo',localStorage.getItem('equipo'));
        xhr.open('POST', path + 'app/getTitulares');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            //alert(this.response);
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var id = 0;
                    var cont = 0;
                    var clase = '';
                    var inc = '';
                    var disabled = '';
                    var roja = '';
                    var amarilla = '';
                    var doubleAmarilla = '';
                    var cambio = '';
                    var goles = '';

                    document.getElementById('acc-jugadores').innerHTML = inc;
                    for(var i = 0; i < json.length; i++ ){

                        roja = 'display:none';
                        amarilla = 'display:none';
                        amarillaRoja = 'display:none';
                        doubleAmarilla = 'display:none';
                        cambio = 'display:none';
                        goles = 'display:none';
                        if(i%4 == 0){
                            id = getDivAcc(json[i].id_usuario);
                            cont = 0;
                        }
                        cont++;
                        if(cont == 1){
                            clase = 'a';
                        } else if(cont == 2){
                            clase = 'b';
                        } else if(cont == 3){
                            clase = 'c';
                        } else if(cont == 4){
                            clase = 'd';
                        }

                        

                        if(json[i].roja != 0 || json[i].amarillas > 0){
                            
                            if(json[i].roja != 0 && json[i].amarillas > 1){
                                doubleAmarilla = 'display:block';
                                amarilla = 'display:none';
                                amarillaRoja = 'display:none';
                                roja = 'display:none';
                                disabled = 'ui-state-disabled';
                            } else if(json[i].roja != 0 && json[i].amarillas == 0){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:none';
                                amarillaRoja = 'display:none';
                                roja = 'display:block';
                                disabled = 'ui-state-disabled';
                            } else if(json[i].roja == 0 && json[i].amarillas == 1){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:block';
                                amarillaRoja = 'display:none';
                                roja = 'display:none'; 
                            } else if(json[i].roja != 0 && json[i].amarillas == 1){
                                doubleAmarilla = 'display:none';
                                amarilla = 'display:none';
                                roja = 'display:none';
                                amarillaRoja = 'display:block';
                                disabled = 'ui-state-disabled';
                            }
                        } else {
                            disabled = '';
                        }

                        if(json[i].cambio == 1){
                            cambio = 'display:block';
                        } else {
                            cambio = 'display:none';
                        }

                        if(json[i].goles > 0){
                            goles = 'display:block';
                        } else {
                            goles = 'display:none';
                        }

                        inc = "<div id='jgActivo"+json[i].id_usuario+"' class='ui-block-"+clase+" centrar_jugador "+disabled+"'>";
                        inc += "<div style='position:relative;'>";
                        inc += "<a onclick='setIDTitular("+json[i].id_usuario+")' href='#' class='ancho_grilla'>";
                        inc += "<img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<div class='contenedor_iconos_jugadas'>";
                        //inc += "<img id='jugImg"+json[i].id_usuario+"' src='jquerymobile/img-dportes/iconos/icono_gol.png' style='"+goles+"'>";
                        inc += "<div id='jugGoles"+json[i].id_usuario+"' class='marcador-personal-goles-2' style='"+goles+"'>"+json[i].goles+"</div>";
                        inc += "<div id='jugTarjetaRoja"+json[i].id_usuario+"' style='"+roja+"'><img src='jquerymobile/img-dportes/iconos/icono_roja.png'></div>";
                        inc += "<div id='jugTarjetaAmarilla"+json[i].id_usuario+"' style='"+amarilla+"'><img src='jquerymobile/img-dportes/iconos/icono_amarilla.png'></div>";
                        inc += "<div id='jugTarjetaAmarillaRoja"+json[i].id_usuario+"' style='"+amarillaRoja+"'><img src='jquerymobile/img-dportes/iconos/icono_amarilla_roja.png'></div>";
                        inc += "<div id='jugCambio"+json[i].id_usuario+"' style='width:26px; "+cambio+"'><img src='jquerymobile/img-dportes/iconos/icono_cambio.png'></div>";
                        inc += "<div id='jugDoble"+json[i].id_usuario+"' style='width:45px; "+doubleAmarilla+"'><img src='jquerymobile/img-dportes/iconos/icono_doble_amarilla.png'></div>";
                        inc += "</div>";
                        inc += "</a>";
                        inc += "</div>";
                        inc += "<span class='nombre-jugador-accion'>"+json[i].nombre+"</span>";
                        inc += "</div>";
                        $('#'+id).append(inc).trigger('create');


               /*<div class="ui-block-a centrar_jugador">
                <div style="position:relative;">
                    <a href="#jugada_partido" class="ancho_grilla">
                            <img src="jquerymobile/img-dportes/jugador1.jpg">
                            <div class="contenedor_iconos_jugadas">
                                <div class="marcador-personal-goles-2">11</div>
                                <img src="jquerymobile/img-dportes/iconos/icono_amarilla.png"><div class="marcador-amarilla">1</div>
                                <div><img src="jquerymobile/img-dportes/iconos/icono_amarilla_roja.png"></div>
                            </div>
                    </a>
                 </div>
                 <span class="nombre-jugador-accion">Francisco quezada</map></span>
               </div>*/

                    }
                    /*var inc = "<div class='ui-grid-c'>";
                    for(var i = 0; i < json.length; i++ ){
                        if((i+1)%4 == 0){
                            inc += "</div>";
                            inc += "<div class='ui-grid-c'>";
                        }
                        inc += "<div class='ui-block-a centrar_jugador'><a href='#jugada_partido' class='ancho_grilla'><img src='jquerymobile/img-dportes/jugador1.jpg'></a><span class='nombre-jugador-accion'>Francisco quezada</span></div>";
                    }
                    inc += "</div>";
                    $('#acc-jugadores').html(inc).trigger('create');*/
                    //document.getElementById('acc-jugadores').innerHTML = inc;
                }
            }
        }
    }

    this.getJugadoresReserva = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_equipo',localStorage.getItem('equipo'));
        send.append('id_evento',sessionStorage.getItem('evento'));
        xhr.open('POST', path + 'app/getJugadoresReserva');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.timeout = 10000;
        xhr.onprogress = function(e){
            $.mobile.loading('show');
            var inc = '';
            $("#jg-reservas").html(inc).trigger('create');
            $("#jg-reservas").listview('refresh');
        }
        xhr.ontimeout = function(e){
            navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');   
        }
        xhr.onload = function(e){
            //alert(this.response);
            $.mobile.loading('hide');
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    for(var i = 0; i < json.length; i++ ){  
                        inc += "<li data-icon='false' class='li-padding' >";
                        inc += "<a href='#' onclick='backAcciones("+json[i].id_usuario+")'>";
                        inc += "<img src='jquerymobile/img-dportes/foto.png'>";
                        inc += "<h2>"+json[i].nombre+"</h2>";
                        inc += "<p>"+json[i].posicion+"</p></a></li>";
                    };
                    $("#jg-reservas").html(inc).trigger('create');
                    $("#jg-reservas").listview('refresh');
                } else {
                    navigator.notification.alert('Se detecto un problema, intentelo nuevamente',function(){},'Atención','OK');
                }
            }
        }


    }

    this.getPosiciones = function(){
        var dporte = 1;
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_dporte',dporte);
        xhr.open('POST', path + 'app/getPosiciones');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = "";
                    for(var i = 0; i < json.length; i++ ){
                        inc += "<input name='jg-radio-posicion' value="+json[i].id_posicion+" id='jg-rad-"+json[i].id_posicion+"' type='radio'>";
                        inc += "<label for='jg-rad-"+json[i].id_posicion+"' >"+json[i].nombre+"</label>";
                    }
                    $('#jg-posiciones').html(inc).trigger('create');
                }
            }
        }
    }

    this.validarJugador = function(){
    	var bNombre 	= false;
    	var bEmail 		= false;

    	if(this.nombre.trim().length <= 0){
            document.getElementById('jg-nombre-error').style.display = "block";
    	} else {
            document.getElementById('jg-nombre-error').style.display = "none";
    		bNombre = true;
    	}

    	if(validaEmail(this.email)){
    		document.getElementById('jg-email-format-error').style.display = "block";
    	} else {
            document.getElementById('jg-email-format-error').style.display = "none";
    		bEmail = true;
    	}

    	if(bNombre && bEmail){
    		return true;
    	} else {
            $.mobile.loading('hide');
    		return false;
    	}
    }

    this.validaTitulares = function(){
        var count = $('[name="jg-titular[]"]:checked').length;
        if(count>0){
            return true;
        } else {
            return false;
        }
    }


}

function setHistorialJG(id,nombre,posicion){
    sessionStorage.jugador = id;
    sessionStorage.dt_nombre = nombre;
    sessionStorage.dt_posicion = posicion;
    $.mobile.navigate("#detalle-jugador", {transition: "fade"});
}

function setTitular(id){
    var jg = new jugadores();
    jg.id_jugador = id;
    jg.setTitulares();
    delete jg;
}

function getDivAcc(id){
    var inc = "<div id='rowAcc"+id+"' class='ui-grid-c'></div>";
    $('#acc-jugadores').append(inc).trigger('create');
    return "rowAcc"+id;
}

function setIDTitular(id){
    //#jugada_partido
    sessionStorage.accIDTitular = id;
    //alert(localStorage.getItem('accIDTitular'));
    $( "#jugada_partido" ).panel( "open" );
}


//$(document).on("pagecreate","#seleccionar-titulares",function(){
$(document).on("pagebeforeshow","#seleccionar-titulares",function(){
    var jg = new jugadores();
    jg.getJugadores();
    delete jg;
});

document.getElementById('add-jg').addEventListener('click',function(){

    event.preventDefault();
    $.mobile.loading('show');
    var jg = new jugadores();
    jg.nombre 	= document.getElementById('jg-nombre').value;
    jg.email 	= document.getElementById('jg-email').value;
    jg.addJugador();
    delete jg;
});

$(document).on("pagecreate","#add-jugadores",function(){
    var jg = new jugadores();
    jg.getPosiciones();
    delete jg;
});

document.getElementById('jg-valida-titulares').addEventListener('click',function(){
    event.preventDefault();
    var jg = new jugadores();
    if(jg.validaTitulares()){
        $.mobile.navigate("#panel-juego", {transition: "fade"});
    } else {
        navigator.notification.alert('Seleccione al menos una persona titular para el partido',titularesDismissed,'Atención','OK');
    }
    delete jg;
});

function backAcciones(id){
    var xhr = new XMLHttpRequest();
    var send = new FormData();
    send.append('sale',sessionStorage.getItem('accIDTitular'));
    send.append('entra',id);
    send.append('id_evento',sessionStorage.getItem('evento'));
    send.append('id_equipo',localStorage.getItem('equipo'));
    xhr.open('POST', path + 'app/cambioJugadores');
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
        //alert(this.response);
        if(this.status == 200){
            if(this.response){
                $.mobile.loading('hide');
                $.mobile.navigate("#acciones", {transition: "fade"});
            }
        }
    }

}

function titularesDismissed(){

}
