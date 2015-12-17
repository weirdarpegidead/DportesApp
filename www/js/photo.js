//document.getElementById('takePhoto').addEventListener('click',function(){
    //navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, 
    //allowEdit: true, destinationType: navigator.camera.DestinationType.DATA_URL });
//});
document.getElementById('takePhoto').addEventListener('click',function(){
    event.preventDefault();
    navigator.notification.confirm(
        'Seleccione el origen de la imagen',
            function(button){
                if(button == 1){
                    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, 
                    allowEdit: true, targetWidth: 500, targetHeight: 500, destinationType: navigator.camera.DestinationType.DATA_URL });
                } else {
                    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, 
                    targetWidth: 500, targetHeight: 500, sourceType: 0, destinationType: navigator.camera.DestinationType.DATA_URL });
                }
            },
        'Advertencia',
        'Camara,Galeria'
    );
});
//document.getElementById('sendPhoto').addEventListener('click',function(){
    //var sendPhoto = document.getElementById('sendPhoto');
    //sendPhoto.addEventListener('click', sendPhoto, false);
//});
//function sendPhoto() {
    //alert('Imagen enviada al servidor');
//}
//function takePhoto(){
    //alert('hola')
    //navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, 
    // allowEdit: true, destinationType: navigator.camera.DestinationType.DATA_URL });
//}
function onPhotoDataSuccess(imageData) {
    var photo = document.getElementById('photo');
    photo.style.display = 'block';
    photo.src = "data:image/jpeg;base64," + imageData;
    //var sendPhoto = document.getElementById('sendPhoto');
    //sendPhoto.style.display = 'block';  
}
function onFail(message) {
    alert('Failed because: ' + message);
}

// deviceready Event Handler
//
// The scope of 'this' is the event. In order to call the 'receivedEvent'
// function, we must explicitly call 'app.receivedEvent(...);'
// Update DOM on a Received Event
//receivedEvent: function(id) {
    //var parentElement = document.getElementById(id);
    //var listeningElement = parentElement.querySelector('.listening');
    //var receivedElement = parentElement.querySelector('.received');
    //listeningElement.setAttribute('style', 'display:none;');
    //receivedElement.setAttribute('style', 'display:block;');
    //console.log('Received Event: ' + id);
//}

