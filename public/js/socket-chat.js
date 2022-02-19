var socket = io();

var params = new URLSearchParams(window.location.search)

if(!params.has('nombre' )&&!params.has('sala')){

    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre : params.get('nombre')
}


socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat' ,usuario, function (resp){console.log(resp)})
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
socket.emit('enviarMensaje', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log('Servidor:', mensaje);

});

//escuchar cambios de usuarios

socket.on('listaPersona',(personas)=>{
    console.log(personas)
})

//mensajes privados
socket.on('mensajePrivado',(mensaje)=>{

    console.log('Mensaje Privado : ', mensaje)
})