//Para funciones utilizadas no encontradas en este archivo, revisar librerias.js
// Variable path es rescatado de las librerias.

function estadisticas(){

    this.id_estadistica
    this.usuario
    this.evento
    this.equipo

	this.getEstadisticas = function(){
        var xhr = new XMLHttpRequest();
        xhr.open('POST', path + 'app/getEstadisticasFutbol');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send();
        xhr.onload = function(){
        	if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
        			var inc = '';
        			document.getElementById('acc-tipo-stat').innerHTML = inc;
        			for(var i = 0; i < json.length; i++ ){
        				inc += "<div class='jugadas'><span class='texto_jugada'>"+json[i].nombre+"</span>";
                        if(json[i].id_estadistica_futbol != 5){
            				inc += "<a href='#' onclick='setAccion("+json[i].id_estadistica_futbol+",1)' data-rel='close'><div class='jugada_buena'></div></a>";
                            if(json[i].tipo == 1)
            				    inc += "<a href='#' onclick='setAccion("+json[i].id_estadistica_futbol+",0)' data-rel='close'><div class='jugada_mala'></div></a>";
            				inc += "</div>";
                        } else {
                            inc += "<a href='#' onclick='setAccion("+json[i].id_estadistica_futbol+",1)' data-rel='close'><div class='tarjeta_amarilla'></div></a>";
                            if(json[i].tipo == 1)
                                inc += "<a href='#' onclick='setAccion("+json[i].id_estadistica_futbol+",0)' data-rel='close'><div class='tarjeta_roja'></div></a>";
                            inc += "</div>";
                        }
        			}
                    $('#acc-tipo-stat').append(inc).trigger('create');
        		}
        	}
        }
	}

    this.setGolContra = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',this.evento);
        send.append('id_equipo',this.equipo);
        send.append('id_periodo',sessionStorage.getItem('periodo'));
        send.append('id_usuario',localStorage.getItem('id'));
        xhr.open('POST', path + 'app/setGolContra');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
    }

    this.getEstadisticasByJugador = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        send.append('id_evento',this.evento);
        send.append('id_equipo',this.equipo);
        send.append('id_usuario',this.usuario);
        xhr.open('POST', path + 'app/getEstadisticasEventoUsuario');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    //alert(this.response);
                    var json = JSON.parse(this.response);
                    var inc = '';
                    var goles = json.goles;
                    var penales = json.penales;
                    var tiros_arco = json.tiros_arco;
                    var tiros_libre = json.tiros_libre;
                    var tiros_esquina = json.tiros_esquina;
                    var tarjetas_amarillas = json.tarjetas_amarillas;
                    var tarjetas_rojas = json.tarjetas_rojas;
                    var quites = json.quites;
                    var faltas = json.faltas;
                    document.getElementById('dt-goles').innerHTML = goles;
                    document.getElementById('dt-tiros-arco').innerHTML = tiros_arco;
                    document.getElementById('dt-tiros-libres').innerHTML = tiros_libre;
                    document.getElementById('dt-tiros-esquina').innerHTML = tiros_esquina;
                    document.getElementById('dt-quites').innerHTML = quites;
                    document.getElementById('dt-faltas').innerHTML = faltas;
                    document.getElementById('dt-tarjetas-amarillas').innerHTML = tarjetas_amarillas;
                    document.getElementById('dt-tarjetas-rojas').innerHTML = tarjetas_rojas;
                }
            }
        }
    }

    this.getEstadisticasPage = function(){
        var xhr = new XMLHttpRequest();
        var send = new FormData();
        //alert(this.evento);
        send.append('id_evento',this.evento);
        send.append('id_equipo',this.equipo);
        xhr.open('POST', path + 'app/getEstadisticasEvento');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.send(send);
        xhr.onload = function(e){
            if(this.status == 200){
                if(this.response && JSON.parse(this.response)){
                    var json = JSON.parse(this.response);
                    var inc = '';
                    $("#stat-goles").html(inc).trigger('create');
                    var goles = json.goles;
                    var penales = json.penales;
                    var tiros_arco = json.tiros_arco;
                    var tiros_libre = json.tiros_libre;
                    var tiros_esquina = json.tiros_esquina;
                    var tarjetas_amarillas = json.tarjetas_amarillas;
                    var tarjetas_rojas = json.tarjetas_rojas;
                    var quites = json.quites;
                    var faltas = json.faltas;
                    var gol_contra = json.gol_contra;

                    if(goles.length>0){
                        document.getElementById('stat-goles-content').style.display = "block";
                        for(var i = 0; i < goles.length; i++ ){
                            inc = "<div class='contenedor-gol'>";
                            inc += "<div class='icono-gol'></div>";
                            inc += "<div class='jugador'>"+goles[i].nombre+"</div>";
                            inc += "</div>";
                            $("#stat-goles").append(inc).trigger('create');
                        }
                    } else {
                        document.getElementById('stat-goles-content').style.display = "none";
                    }

                    if(penales){
                        document.getElementById('stat-resumen-text').style.display = "block";
                        document.getElementById('stat-penales').style.display = "block";
                        for(var i = 0; i < penales.length; i++ ){
                            inc = "<div class='contenedor-gol'>";
                            inc += "<div class='icono-fallado'></div>";
                            inc += "<div class='jugador'>"+json[i].nombre+"</div>";
                            inc += "</div>";
                        }
                    } else {
                        document.getElementById('stat-resumen-text').style.display = "none";
                        document.getElementById('stat-penales').style.display = "none";
                    }

                    document.getElementById('stat-tiro-arco').innerHTML = tiros_arco;
                    document.getElementById('stat-tiro-libre').innerHTML = tiros_libre;
                    document.getElementById('stat-tiro-esquina').innerHTML = tiros_esquina;
                    document.getElementById('stat-quite').innerHTML = quites;
                    document.getElementById('stat-falta').innerHTML = faltas;
                    document.getElementById('stat-marc-favor').innerHTML = goles.length;
                    document.getElementById('stat-marc-contra').innerHTML = gol_contra;
                    document.getElementById('stat-tarjeta-roja').innerHTML = tarjetas_rojas;
                    document.getElementById('stat-tarjeta-amarilla').innerHTML = tarjetas_amarillas;
                }
            }
        } 
    }
}

function setParametrosEstadisticos(evento,equipo){
    sessionStorage.evento = evento;
    sessionStorage.equipo = equipo;
    $.mobile.navigate("#estadisticas", {transition: "fade"});
}

function setAccion(tipo,accion){
    var xhr = new XMLHttpRequest();
    var add = new FormData();
    add.append('id_evento',sessionStorage.getItem('evento'));
    add.append('id_usuario',sessionStorage.getItem('accIDTitular'));
    add.append('id_equipo',localStorage.getItem('equipo'));
    add.append('id_periodo',sessionStorage.getItem('periodo'));
    add.append('id_tipo',tipo);
    add.append('accion',accion);
    //alert(sessionStorage.getItem(''));
    xhr.open('POST', path + 'app/setEstadisticaFutbol');
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(add);

    if(tipo == 1){
        var marcador = document.getElementById('acc-marc-favor').innerHTML;
        var marcador_stat = document.getElementById('stat-marc-favor').innerHTML;
        document.getElementById('acc-marc-favor').innerHTML = parseInt(marcador) + 1;
        document.getElementById('stat-marc-favor').innerHTML = parseInt(marcador_stat) + 1;  
    }
    //alert("tipo de accion: " + tipo + " usuario: " + localStorage.getItem('accIDTitular') + " accion: " + accion);
    $( "#jugada_partido" ).panel( "close" );
}

function periodoConf(button){
    if(button == 1){
        $('#periodo'+sessionStorage.getItem('periodo')).addClass('ui-state-disabled');
        sessionStorage.removeItem('periodo');
        sessionStorage.removeItem('nPeriodo');
        $.mobile.navigate("#estadisticas", {transition: "fade"});
    }
}

document.getElementById('acc-deshacer').addEventListener('click',function(){
    navigator.notification.confirm(
        '¿Realmente desea eliminar la última jugada?',
        function(button){
            if(button == 1){
                var xhr = new XMLHttpRequest();
                var del = new FormData();
                del.append('id_evento',sessionStorage.getItem('evento'));
                del.append('id_equipo',localStorage.getItem('equipo'));
                del.append('id_periodo',sessionStorage.getItem('periodo'));
                xhr.open('POST', path + 'app/dropEstadisticaFutbol');
                xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                xhr.send(del);
                xhr.onload = function(e){
                    if(this.status == 200){
                        if(this.response == 9){
                            var marcador = document.getElementById('acc-marc-contra').innerHTML;
                            var marcador_stat = document.getElementById('stat-marc-contra').innerHTML;
                            document.getElementById('acc-marc-contra').innerHTML = parseInt(marcador) - 1;
                            document.getElementById('stat-marc-contra').innerHTML = parseInt(marcador_stat) - 1;                             
                        }

                        if(this.response == 1){
                            var marcador = document.getElementById('acc-marc-favor').innerHTML;
                            var marcador_stat = document.getElementById('stat-marc-favor').innerHTML;
                            document.getElementById('acc-marc-favor').innerHTML = parseInt(marcador) - 1;
                            document.getElementById('stat-marc-favor').innerHTML = parseInt(marcador_stat) - 1;  
                        }
                    }
                }
                //alert('ultima jugada eliminada');
            }
        },
        'Advertencia',
        'Si,No'
    );
});

document.getElementById('acc-gol-contra').addEventListener('click',function(){
    navigator.notification.confirm(
        '¿Realmente desea marcar un gol en contra?',
        function(button){
            if(button == 1){
                var stat = new estadisticas();
                stat.evento = sessionStorage.getItem("evento");
                stat.equipo = localStorage.getItem("equipo");
                stat.setGolContra();
                var marcador = document.getElementById('acc-marc-contra').innerHTML;
                var marcador_stat = document.getElementById('stat-marc-contra').innerHTML;
                document.getElementById('acc-marc-contra').innerHTML = parseInt(marcador) + 1;
                document.getElementById('stat-marc-contra').innerHTML = parseInt(marcador_stat) + 1;

            }
        },
        'Advertencia',
        'Si,No'
    );
});

document.getElementById('acc-terminar-periodo').addEventListener('click',function(){
    navigator.notification.confirm(
        '¿Realmente desea terminar este periodo?',
        periodoConf,
        sessionStorage.getItem('nPeriodo'),
        'Si,No'
    );
});

$(document).on("pagebeforeshow","#acciones",function(){
	var ev = new eventos();
	ev.getEquipoAndRival();
    var jg = new jugadores();
    jg.getTitulares();
    var st = new estadisticas();
    st.getEstadisticas();
    delete jg;
    delete st;
    delete ev;
});


$(document).on("pagebeforeshow","#estadisticas",function(){
    var stat = new estadisticas();
    stat.evento = sessionStorage.getItem('evento');
    stat.equipo = localStorage.getItem('equipo');
    stat.getEstadisticasPage();
    delete stat;
});

