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

function checkPeriodo(id,arr){                          
    for(var j = 0; j < arr.length; j++){
	    if(arr[j] == id){
	        return "ui-state-disabled";
	    }
    }
    return '';
}

function checkAmarilla(){
	var arr = [];
    if(sessionStorage.getItem('amarillas')){
    	//alert(sessionStorage.getItem('amarillas'));
    	arr = JSON.parse(sessionStorage.getItem('amarillas'));
	    for(var i = 0 ; i < arr.length ; i++){
	        if(sessionStorage.getItem('accIDTitular') == arr[i]){
	        	$("#jugTarjetaAmarilla"+sessionStorage.getItem('accIDTitular')).css('display','none');
	        	$("#jugDoble"+sessionStorage.getItem('accIDTitular')).css('display','block');
				arr.push(sessionStorage.getItem('accIDTitular'));
	    		sessionStorage.setItem('amarillas',JSON.stringify(arr));
	            return true;
	        }
	    }
	    arr.push(sessionStorage.getItem('accIDTitular'));
	    sessionStorage.setItem('amarillas',JSON.stringify(arr));
	    $("#jugTarjetaAmarilla"+sessionStorage.getItem('accIDTitular')).css('display','block');
	    return false;
    } else {
		arr.push(sessionStorage.getItem('accIDTitular'));
	    sessionStorage.setItem('amarillas',JSON.stringify(arr));
	    $("#jugTarjetaAmarilla"+sessionStorage.getItem('accIDTitular')).css('display','block');
    	return false;
    }
}

function checkAmarillaRoja(id){
	var arr = JSON.parse(sessionStorage.getItem('amarillas'));
	for(var i = 0 ; i <= arr.length ; i++){
		if(id == arr[i]){
			return true
		}
	}
	return false;
}

function dropAmarilla(id){
	var arr = JSON.parse(sessionStorage.getItem('amarillas'));
	for(var i = 0 ; i <= arr.length ; i++){
	    if(id == arr[i]){
	        $("#jugDoble"+id).css('display','none');
	        arr.splice(i,1);
	        if(countAmarillas(id,arr)){
	        	$("#jugTarjetaAmarilla"+id).css('display','block');
	        } else {
	        	$("#jugTarjetaRoja"+id).css('display','none');
	        	$("#jugTarjetaAmarilla"+id).css('display','none');
	        	$("#jugTarjetaAmarillaRoja"+id).css('display','none');
	        }
	    	sessionStorage.setItem('amarillas',JSON.stringify(arr));
	        return true;
	    }
	}
	alert('false');
	$("#jugTarjetaAmarilla"+id).css('display','none');
	return false;

}

function countAmarillas(id,arr){
	for(var i = 0 ; i <= arr.length ; i++){
		if(arr[i] == id){
			return true;
		}
	}
	return false;
}


function setMore(){
    var partidos = new eventos();
    partidos.equipo = localStorage.getItem('equipo');
    partidos.bool = false;
    partidos.getHistorialPartidos();
    delete partidos;	
}

function jugDelete(){
    var startLoc = null; 
    $('#jugadores').on( "touchstart", function(e){ 
	    if( e.originalEvent.touches.length == 1 ) { // one finger touch 
	        var touch = e.originalEvent.touches[ 0 ]; 
	        startLoc = { x : touch.pageX, y : touch.pageY }; 
	    } 
   	}); 

    $('#jugadores').on( "touchmove", function(e){  
        if( startLoc ) { 
	        var touch = e.originalEvent.touches[ 0 ];  
	        if( Math.abs( startLoc.x - touch.pageX ) >  Math.abs( startLoc.y - touch.pageY ) ) { 
	            e.preventDefault(); 
	        } 
	        startLoc = null; 
        } 
    });
$(document).on("click", "ul li span.delete", function () {
    var listview = $(this).closest("ul");
    $(".ui-content").css({
        overflow: "hidden"
    });
    $(this).parent().css({
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
}).on("click", "ul li span.flag", function () {
    var text = $("p", this),
        button = $(this).siblings("a"),
        flagged = button.find(".flagged").hasClass("ui-screen-hidden") ? false : true;
    if (!flagged) {
        button.find(".flagged").removeClass("ui-screen-hidden");
        text.text("Unflag");
    } else {
        button.find(".flagged").addClass("ui-screen-hidden");
        text.text("Flag");
    }
}).on("click", "ul li span.more", function () {
    alert("nothing");
}).on("swipeleft", "ul li a", function (e) {
    $(this).prevAll("span").addClass("show");
    $(this).off("click").blur();
    $(this).css({
        transform: "translateX(-210px)"
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

function jugDelete2(){
			// Swipe to remove list item
			$( document ).on( "swipeleft swiperight", "#jug-list li", function( event ) {
				var listitem = $( this ),
					// These are the classnames used for the CSS transition
					dir = event.type === "swipeleft" ? "left" : "right",
					// Check if the browser supports the transform (3D) CSS transition
					transition = $.support.cssTransform3d ? dir : false;

					confirmAndDelete( listitem, transition );
			});

			// If it's not a touch device...
			if ( ! $.mobile.support.touch ) {

				// Remove the class that is used to hide the delete button on touch devices
				$( "#jug-list" ).removeClass( "touch" );

				// Click delete split-button to remove list item
				$( ".ui-icon-borrar" ).on( "click", function() {
					var listitem = $( this ).parent( "li" );

					confirmAndDelete( listitem );
				});
			}

			function confirmAndDelete( listitem, transition ) {
				// Highlight the list item that will be removed
				listitem.children( ".ui-btn" ).addClass( "ui-btn-active" );
				// Inject topic in confirmation popup after removing any previous injected topics
				$( "#confirm .topic" ).remove();
				listitem.find( ".topic" ).clone().insertAfter( "#question" );
				// Show the confirmation popup
				$( "#confirm" ).popup( "open" );
				// Proceed when the user confirms
				$( "#confirm #yes" ).on( "click", function() {
					// Remove with a transition
					if ( transition ) {

						listitem
							// Add the class for the transition direction
							.addClass( transition )
							// When the transition is done...
							.on( "webkitTransitionEnd transitionend otransitionend", function() {
								// ...the list item will be removed
								listitem.remove();
								// ...the list will be refreshed and the temporary class for border styling removed
								$( "#jug-list" ).listview( "refresh" ).find( ".border-bottom" ).removeClass( "border-bottom" );
							})
							// During the transition the previous button gets bottom border
							.prev( "li" ).children( "a" ).addClass( "border-bottom" )
							// Remove the highlight
							.end().end().children( ".ui-btn" ).removeClass( "ui-btn-active" );
					}
					// If it's not a touch device or the CSS transition isn't supported just remove the list item and refresh the list
					else {
						listitem.remove();
						$( "#jug-list" ).listview( "refresh" );
					}
				});
				// Remove active state and unbind when the cancel button is clicked
				$( "#confirm #cancel" ).on( "click", function() {
					listitem.children( ".ui-btn" ).removeClass( "ui-btn-active" );
					$( "#confirm #yes" ).off();
				});
			}	
}
