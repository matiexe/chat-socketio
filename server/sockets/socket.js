const { io } = require('../server');
const Usuarios = require('../classes/usuario');
const {crearMensaje} = require('../utilidades/utilidades')

const usuarios = new Usuarios();
io.on('connection', (client) => {

    client.on('entrarChat',(data,callback)=>{

        console.log(data.nombre)
        if(!data.nombre || data.sala){
            return callback({
                error:true,
                mensaje :'El nombre /sala es necesario'
            })
        }
        client.join(data.sala);
        let personas = usuarios.agregarPersona(client.id , data.nombre,data.sala);
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.obtenerPersonaPorSalas(usuarios.sala));
        callback(usuarios.obtenerPersonaPorSalas(usuarios.sala))
    })
    client.on('crearMensaje',(data)=>{

        let persona = usuarios.obtenerPersona(client.id)
        let mensaje = crearMensaje(persona.nombre,data.mensaje)
        client.broadcast.to(persona.sala).emit('crearMensaje',mensaje)

    });
    client.on('disconnect',()=>{

        let personaBorrada = usuarios.borrarPersona( client.id );
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje',crearMensaje('Administrador',`${personaBorrada.nombre} salio del chat`))
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.obtenerPersonaPorSalas(personaBorrada.sala));
    })
    // mensajes privados
    client.on('mensajePrivado', data =>{

        let persona = usuarios.obtenerPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre,data.mensaje))

    })

});