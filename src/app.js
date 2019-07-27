const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const dirNode_modules = path.join(__dirname, '../node_modules');
const mongoose = require('mongoose');
const Usuario = require('./../modelos/usuario');
const Curso = require('./../modelos/curso');
const Matricula = require('./../modelos/matricula');
const multer = require('multer');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var listaCursos;
var listaMatriculas;
var listaUsuarios;
const port = process.env.PORT || 3000;
process.env.PORT = process.env.PORT || 3000;
process.env.URLDB = 'mongodb+srv://admin:admin@nodejstdea-bmwcd.mongodb.net/nodedb?retryWrites=true&w=majority'
process.env.SENDGRID_API_KEY='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'
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err) => {
    if (err) {
        return console.log("Fallo la conexion con la BD" + (err));
    }
    actualizarCursos();
    actualizarMatriculas();
    actualizarUsuarios();
    return console.log("Conexion con la BD exitosamente");
});



function actualizarUsuarios() {
    Usuario.find({}).exec((err, res) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (res.length == 0) {
                usuario = new Usuario({
                    cedula: 123,
                    nombre: 'Admin',
                    correo: 'eladmin@potomail.com',
                    password: 'password',
                    telefono: 2222222,
                    tipo: 'coordinador'
                })
                usuario.save((err, res)=> {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log('se crea el admin' + res);
                        actualizarUsuarios();
                    }
                })
            }
            else{
                listaUsuarios = res;
                console.log('se obtuvieron los usuarios');
                console.log(listaUsuarios.length);
            }
            
            
        }
    })
}
function actualizarCursos() {
    Curso.find({}).exec((err, res) => {
        if (err) {
            return console.log(err);
        }
        else {
            listaCursos = res;
            console.log('se obtuvieron los cursos');
            console.log(listaCursos.length);
        }
    })
}
function actualizarMatriculas() {
    Matricula.find({}).exec((err, res) => {
        if (err) {
            return console.log(err);
        }
        else {
            listaMatriculas = res;
            console.log('se obtuvieron las matriculas');
            console.log(listaMatriculas.length);
        }
    })
}
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));

app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');

app.use(express.static(directoriopublico));
hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

io.on('connection',client =>{
    console.log('User connected')
    client.on('texto',(texto,callback)=>{
        console.log(texto);
        io.emit('chat',texto)
        callback()
    })

});


app.post('/inscrito', (req, res) => {

    Matricula.findOne({ cedula: parseInt(req.query.cedula), id: req.query.id }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (response) {
                res.render('inscrito', {
                    texto: 'Ya se encuentra matriculado en el curso.'
                })
            }
            else {
                let matriculaNueva = new Matricula({
                    cedula: parseInt(req.query.cedula),
                    id: req.query.id
                })
                matriculaNueva.save((err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log('guardado' + response);
                        res.render('inscrito', {
                            texto: 'Se ha matriculado con exito.'
                        })
                    }
                })
            }
        }
    })
});

app.post('/aspirante', (req, res) => {

    if (req.query.id) {
        Matricula.remove({ cedula: parseInt(req.query.cedula), id: req.query.id }).exec((err, response) => {
            if (err) {
                return console.log(err);
            }
            else {
                if (response) {
                    console.log('encontro y borro');

                    console.log(response);
                    Matricula.find({ cedula: parseInt(req.query.cedula) }).exec((err, response) => {
                        if (err) {
                            return console.log(err);
                        }
                        else {
                            console.log(response);
                            var idMatriculas = new Array();
                            response.forEach(cosiampiro => {
                                idMatriculas.push(cosiampiro.id);
                            });
                            Curso.find({ id: { $in: idMatriculas } }).exec((err, response) => {
                                if (err) {
                                    return console.log(err);
                                }
                                else {
                                    if (response) {
                                        console.log(response);
                                        response.forEach(j => {
                                            console.log(j.nombre_curso)
                                        })
                                        res.render('aspirante', {
                                            cedula: parseInt(req.query.cedula),
                                            cursosF: response
                                        })
                                    }
                                }
                            })
                        }
                    })


                }
                else {
                    console.log('no se encontro');

                }
            }
        })
    }
    else {
        console.log(req.query.cedula)
        Matricula.find({ cedula: parseInt(req.query.cedula) }).exec((err, response) => {
            if (err) {
                return console.log(err);
            }
            else {
                console.log(response);
                var idMatriculas = new Array();
                response.forEach(cosiampiro => {
                    idMatriculas.push(cosiampiro.id);
                });
                Curso.find({ id: { $in: idMatriculas } }).exec((err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        if (response) {
                            console.log(response);
                            response.forEach(j => {
                                console.log(j.nombre_curso)
                            })
                            res.render('aspirante', {
                                cedula: parseInt(req.query.cedula),
                                cursosF: response
                            })
                        }
                    }
                })
            }
        })
    }

    // res.render('aspirante', {
    //     cedula: req.query.cedula,
    //     id: req.query.id
    // });
});

app.post('/desmatricular', (req, res) => {

    Matricula.findOne({ cedula: parseInt(req.body.cedula), id: req.body.id }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (response) {
                Curso.findOne({ id: req.body.id }).exec((err, cursoEncontrado) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        Matricula.deleteOne({ cedula: parseInt(req.body.cedula), id: req.body.id }).exec((err, resp) => {
                            if (err) {
                                return console.log(err);
                            }
                            else {
                                Matricula.find({ id: req.body.id }).exec((err, matriculasEncontradas) => {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    else {
                                        console.log('mencontradas' + matriculasEncontradas)
                                        mE = new Array();
                                        matriculasEncontradas.forEach(f => {
                                            mE.push(f.cedula);
                                        })
                                        Usuario.find({}).exec((err, resC) => {
                                            if (err) {
                                                return console.log(err);
                                            }
                                            else {
                                                console.log('userstodos' + resC)
                                                res.render('desmatricular', {
                                                    curso: cursoEncontrado,
                                                    cedulaMatriculados: mE,
                                                    usuarios: resC
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.render('coordinador3', {
                    texto: 'El estudiante no se ecuentra matriculado.'
                })
            }
        }
    })

    // res.render('desmatricular', {
    //     cedula: req.body.cedula,
    //     id: req.body.id
    // });
});

app.get('/coordinador', (req, res) => {
    res.render('coordinador');
});

app.get('/coordinador2', (req, res) => {

    Curso.find({ estado: 'disponible' }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            console.log(response);
            let cursosD = response;
            Matricula.find({}).exec((err, response) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    let matriculasD = response;
                    res.render('coordinador2', {
                        cursosD: cursosD,
                        matriculasD: matriculasD
                    })
                }
            })
        }
    })

    //res.render('coordinador2');
})

app.get('/coordinador3', (req, res) => {
    res.render('coordinador3');
})

app.get('/coordinador4', (req, res) => {
    res.render('coordinador4');
})

app.post('/actualizardatos', (req, res) => {

    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (response) {
                Usuario.updateOne({ cedula: parseInt(req.body.cedula) }, {
                    $set: {
                        nombre: req.body.nombre,
                        correo: req.body.correo,
                        telefono: parseInt(req.body.telefono),
                        tipo: req.body.tipo
                    }
                }).exec((err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        res.render('actualizardatos', {
                            texto: 'Se han actualizado los datos.'
                        })
                    }
                })
            }
            else {
                res.render('coordinador4', {
                    texto: 'No se encontro el usuario.'
                })
            }
        }
    })


    /* res.render('actualizardatos', {
        cedula: parseInt(req.body.cedula),
        nombre: req.body.nombre,
        correo: req.body.correo,
        telefono: parseInt(req.body.telefono),
        tipo: req.body.tipo
    }); */
})

app.post('/cerrado', (req, res) => {

    Curso.updateOne({ id: req.query.id }, { $set: { estado: 'cerrado' } }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            console.log('cambiado');
            console.log(response);
            res.render('cerrado', {
                texto: 'Para cerrar el curso asigne un docente.',
                id: req.query.id
            })
        }
    })
})

app.post('/docenteasignado', (req, res) => {

    Usuario.findOne({ cedula: parseInt(req.body.cedula), tipo: 'docente' }).exec((err, response) => {
        if (err) {
            return console.log(err);
        }
        else {
            if (response) {

                Curso.updateOne({ id: req.query.id }, { $set: { docente: parseInt(req.body.cedula) } }).exec((err, response1) => {
                    if (err) {
                        return console.log(err)
                    }
                    else {
                        res.render('docenteasignado', {
                            texto: ('El docente ' + response.nombre + ' ha sido asignado.')
                        })
                    }
                })

            }
            else {
                Curso.updateOne({ id: req.query.id }, { $set: { estado: 'disponible' } }).exec((err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log(response);
                        res.render('cerrado', {
                            texto: 'El docente no existe. Vuelva a asignar.',
                            id: req.query.id
                        })
                    }
                })
            }
        }
    })

})

app.post('/cursoregistrado', (req, res) => {

    Curso.findOne({ id: req.body.id }).exec((err, response) => {
        if (err) {
            return console.log(err)
        }
        else {
            if (response) {
                res.render('coordinador', {
                    texto: 'El curso con ese id ya existe.'
                })
            }
            else {
                if (req.body.modalidad == null) {
                    req.body.modalidad = 'No especificada'
                }


                let cursoNuevo = new Curso({
                    nombre_curso: req.body.nombre_curso,
                    id: (req.body.id),
                    descripcion: req.body.descripcion,
                    valor: parseInt(req.body.valor),
                    modalidad: req.body.modalidad,
                    intensidad: (req.body.intensidad),
                    estado: "disponible",
                })

                cursoNuevo.save((err, response) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log(response);
                        actualizarCursos();
                        res.render('cursoregistrado', {
                            texto: "El curso ha sido registrado."
                        })
                    }
                })

            }
        }
    })


});

app.post('/index', (req, res) => {

    Matricula.find({}).exec((err, resM) => {
        if (err) {
            return console.log(err);
        }
        else {
            Usuario.find({}).exec((err, resU) => {
                if (err) {
                    return console.log(err);
                }
                else {
                    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, response) => {
                        if (err) {
                            return console.log(err);
                        }
                        else {
                            if (!response) {
                                console.log('noresponse');
                                res.render('login', {
                                    texto: 'Credenciales Incorrectas'
                                })
                            }
                            else {
                                if (response.password == req.body.password) {
                                    console.log(response)
                                    console.log(resM)
                                    console.log(listaCursos)
                                    console.log(resU)
                                    avatar = response.avatar.toString('base64')
                                    res.render('index', {
                                        nombre: response.nombre,
                                        usuario: response,
                                        listaCursos: listaCursos,
                                        listaMatriculas: resM,
                                        listaUsuarios: resU,
                                        avatar: avatar
                                    })
                                }
                                else {
                                    console.log('wrongpass')
                                    res.render('login', {
                                        texto: 'Credenciales Incorrectas'
                                    })
                                }
                            }
                        }
                    })
                }
            })
        }
    })







});

app.get('/login', (req, res) => {
    res.render('login')
})
var upload = multer({});
app.post('/registrado', upload.single('avatar'),(req, resRender) => {
    console.log(req.file.buffer)
    let usuario;
    Usuario.findOne({ cedula: parseInt(req.body.cedula) }).exec((err, res) => {
        if (err) {
            return console.log(err)
        }
        else {
            if (res) {
                resRender.render('registrado', {
                    texto: 'El usuario ya se encuentra registrado.'
                });
            }
            else {
                usuario = new Usuario({
                    cedula: parseInt(req.body.cedula),
                    nombre: req.body.nombre,
                    password: req.body.password,
                    correo: req.body.correo,
                    telefono: parseInt(req.body.telefono),
                    tipo: 'aspirante',
                    avatar: req.file.buffer
                })
                const msg = {
                    to: req.body.correo,
                    from: 'sincertononombre@bienvenido.com',
                    subject: 'Bienvenido',
                    text: 'Se ha registrado exitosamente.'
                };
                usuario.save((err, res) => {
                    if (err) {
                        return console.log(err);
                    }
                    else {
                        console.log(res);
                        sgMail.send(msg);
                        resRender.render('login');
                    }
                })
            }
        }
    })
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.get('/dropped',(req,res)=>{
    
    res.render('dropped')
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/chat',(req,res)=>{
    res.render('chat')
})

app.get('*', (req, res) => {
    res.render('error');
});

console.log(__dirname)


server.listen(port, () => {
    console.log('Servidor en el puerto ' + port);
})

