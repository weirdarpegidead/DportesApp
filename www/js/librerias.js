//var path = 'http://localhost/dportes/';
var path = 'http://desarrollo.ilia.cl/dportes/';

function swipe(id,nav,position){
    var startLoc = null; 
    $(id).on( "touchstart", function(e){ 
	    if( e.originalEvent.touches.length == 1 ) { // one finger touch 
	        var touch = e.originalEvent.touches[ 0 ]; 
	        startLoc = { x : touch.pageX, y : touch.pageY }; 
	    } 
   	}); 

    $(id).on( "touchmove", function(e){  
        if( startLoc ) { 
	        var touch = e.originalEvent.touches[ 0 ];  
	        if( Math.abs( startLoc.x - touch.pageX ) >  Math.abs( startLoc.y - touch.pageY ) ) { 
	            e.preventDefault(); 
	        } 
	        startLoc = null; 
        } 
    });

    if(position === 'left'){
    	var lf = "close";
    	var rg = "open";
    } else if(position === 'right'){
    	var lf = "open";
    	var rg = "close";    	
    } else {
    	var lf = '';
    	var rg = '';
    }
    if(lf != '' && rg != ''){
	    $( document ).on( "swipeleft swiperight", id, function( e ) {
	        if ( $( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
	            if ( e.type === "swipeleft" ) {
	                $( nav ).panel( lf );
	            } else if ( e.type === "swiperight" ) {
	                $( nav ).panel( rg );
	            }
	        }
	    });
	} else {
		navigator.notification.alert('Ocurre un error con el menu',function(){},'Atención','OK');
	}
}

function validaEmail(email){
	expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if ( !expr.test(email) ){
	   	return true;
	} else {
	   	return false;
	}
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getFecha(fecha) {
	var fech = fecha.split(" ");
	var arr = fech[0].split("-");
	var mes = '';
	if(arr[1] == 1){
		mes = 'enero';
	} else if(arr[1] == 2){
		mes = 'febrero';
	} else if(arr[1] == 3){
		mes = 'marzo';
	} else if(arr[1] == 4){
		mes = 'abril';
	} else if(arr[1] == 5){
		mes = 'mayo';
	} else if(arr[1] == 6){
		mes = 'junio';
	} else if(arr[1] == 7){
		mes = 'julio';
	} else if(arr[1] == 8){
		mes = 'agosto';
	} else if(arr[1] == 9){
		mes = 'septiembre';
	} else if(arr[1] == 10){
		mes = 'octubre';
	} else if(arr[1] == 11){
		mes = 'noviembre';
	} else if(arr[1] == 12){
		mes = 'diciembre';
	} 
	var newFech = arr[2] + ' ' + mes + ' ' + arr[0];
	return newFech;
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

function clearGame(){
	document.getElementById('pg-rival').value = '';
	document.getElementById('pg-ubicacion').value = '';
	document.getElementById('pg-hora').value = '';
	document.getElementById('pg-hora').type = 'text';
	document.getElementById('pg-hora').placeholder = 'Hora del partido';
	document.getElementById('pg-fecha').value = '';
	document.getElementById('pg-fecha').type = 'text';
	document.getElementById('pg-fecha').placeholder = 'Fecha del partido';
	$("select#pg-periodo")[0].selectedIndex = 0;

	document.getElementById('acc-marc-contra').innerHTML = 0;
    document.getElementById('stat-marc-contra').innerHTML = 0;
	document.getElementById('acc-marc-favor').innerHTML = 0;
    document.getElementById('stat-marc-favor').innerHTML = 0;

}

function backHome(){
	if(sessionStorage.getItem('evento')){
		navigator.notification.confirm(
        	'Aplicar esta acción significa terminar el partido.\n ¿Realmente desea hacerlo?',
        	function(button){
        		if(button == 1){
        			closeEvent();
        		}
        	},
        	'Advertencia',
        	'Si,No');
	} else {
		$.mobile.navigate("#home", {transition: "fade"});
	}
}
