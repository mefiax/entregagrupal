const hbs = require('hbs');
const fs = require('fs');


hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
    return (nota1 + nota2 + nota3) / 3
});
//nel perro -20
hbs.registerHelper('actualizar', (cedula, nombre, correo, telefono, tipo) => {
    listaUsuarios = require('./usuarios.json');
    console.log(cedula);
    let busqueda = listaUsuarios.find(ver => ver.cedula == cedula);
    console.log(busqueda);
    if (busqueda) {
        let usuario = {
            nombre: nombre,
            cedula: busqueda.cedula,
            correo: correo,
            telefono: telefono,
            tipo: tipo
        }

        listaUsuarios.splice(listaUsuarios.indexOf(busqueda));
        listaUsuarios.push(usuario);
        console.log(listaUsuarios);

        let datos = JSON.stringify(listaUsuarios);
        fs.writeFile('./src/usuarios.json', datos, (err) => {
            if (err) throw (err);
            console.log('Archivo guardado con exito');
        });

        return "El usuario se modifico exitosamente"
    } else {
        return "El usuario que ingreso no existe en la base de datos"
    }

});

hbs.registerHelper('desmatricular', (curso, cedulaMatriculados, usuarios) => {

    let texto;
    console.log(cedulaMatriculados)
    console.log(usuarios)


    texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>CEDULA:</th>\
                <th>NOMBRE:</th>\
                <th>CORREO:</th>\
                <th>TELEFONO:</th>\
                </thead>\
                <tbody>";

    cedulaMatriculados.forEach(matriculado => {
        let user = usuarios.find(ver => ver.cedula == matriculado);
        console.log(user);
        texto = (texto +
            "<tr class='table-info text-center'>" +
            '<td>' + user.cedula + '</td>' +
            '<td>' + user.nombre + '</td>' +
            '<td>' + user.correo + '</td>' +
            '<td>' + user.telefono + '</td>' +
            '</tr>');


    })
    texto = (texto + "</tbody></table><br></div>");

    return texto
});

hbs.registerHelper('cerrar', (id) => {

    let texto = ("<form action='/docenteasignado?id=" + id + "' method='post'>" +
        "<p>Cedula:</p>" +
        "<input type='number' name='cedula' required>" +
        " <br>" +
        " <br>" +
        " <button class='btn btn-dark'>ASIGNAR</button>" +
        "<br>" +
        "</form>")



    return texto;
});

hbs.registerHelper('eliminarCurso', (cedula, cursosF) => {

    let texto;

    // console.log(cursosF)

    texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MAS INFORMACION:</th>\
                <th>DARSE DE BAJA:</th>\
                </thead>\
                <tbody>";

    cursosF.forEach(cursos => {
        texto = (texto +
            "<tr class='table-info text-center'>" +
            '<td>' + cursos.id + '</td>' +
            '<td>' + cursos.nombre_curso + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td><div class="accordion" id="accordionExample"></div>' +
            '<div class="card">' +
            '<div class="card-header" id="headingOne">' +
            '<h5 class="mb-0">' +
            '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
            "Detalles" +
            '</button></h5></div>' +
            '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
            '<div class="card-body">' +
            "Modalidad: " + cursos.modalidad + '<br>Intensidad: ' + cursos.intensidad +
            '</div></div></div></div></td>' + '<td><form action="/aspirante?cedula=' + cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">DARSE DE BAJA</button></form></td>' +
            '</tr>');
    })
    texto = (texto + "</tbody></table></div>");
    return texto
})

//no se necesita mas
hbs.registerHelper('registrarCurso', (id, nombre_curso, descripcion, modalidad, valor, intensidad, estado) => {
    listaCursos = require('./cursos.json');
    let duplicado = listaCursos.find(ver => ver.id == id);

    let texto;
    let curso;

    if (!duplicado) {
        curso = {
            "nombre_curso": nombre_curso,
            "id": id,
            "descripcion": descripcion,
            "valor": valor,
            "modalidad": modalidad,
            "intensidad": intensidad,
            "estado": estado
        };

        if (curso.modalidad == null) {
            curso.modalidad = 'No especificada'
        }

        if (curso.intensidad == null) {
            curso.intensidad = 'No especificada'
        }

        listaCursos.push(curso);
        let datos = JSON.stringify(listaCursos);
        fs.writeFile('./src/cursos.json', datos, (err) => {
            if (err) throw (err);
            console.log('Curso registrado exitosamente');
        });
        texto = "Curso " + curso.nombre_curso + " registrado exitosamente."
    } else {
        texto = "El curso ya existe."
    }

    return texto;

});
//no se necesita mas
hbs.registerHelper('inscribir', (cedula, id) => {
    let texto;
    let matricula;
    listaMatricula = require('./matricula.json');
    let duplicado = listaMatricula.find(ver => ver.cedula == cedula && ver.id == id);

    if (!duplicado) {
        matricula = {
            cedula: cedula,
            id: id
        }

        listaMatricula.push(matricula);
        let datos = JSON.stringify(listaMatricula);
        fs.writeFile('./src/matricula.json', datos, (err) => {
            if (err) throw (err);
            console.log('Matricula registrada exitosamente');
        });
        texto = 'Matricula registrada'
    } else {
        texto = 'Ya se encuentra matriculado en este curso'
    }
    return texto;

});

hbs.registerHelper('listar2', (cursosD, matriculasD) => {

    let texto;

    texto = "<div class='table-responsive'> <table class='table table-hover'>\
            <thead class='thead-dark text-center'>\
            <th>ID:</th>\
            <th>NOMBRE:</th>\
            <th>DESCRIPCION:</th>\
            <th>VALOR:</th>\
            <th>ESTUDIANTES:</th>\
            <th>CERRAR CURSO:</th>\
            </thead>\
            <tbody>";

    cursosD.forEach(cursos => {

        texto = (texto +
            "<tr class='table-info text-center'>" +
            '<td>' + cursos.id + '</td>' +
            '<td>' + cursos.nombre_curso + '</td>' +
            '<td>' + cursos.descripcion + '</td>' +
            '<td>' + cursos.valor + '</td>' +
            '<td><div class="accordion" id="accordionExample"></div>' +
            '<div class="card">' +
            '<div class="card-header" id="headingOne">' +
            '<h5 class="mb-0">' +
            '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
            "Detalles" +
            '</button></h5></div>' +
            '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
            '<div class="card-body">' +
            "Personas inscritas: " + matriculasD.filter(ver => ver.id == cursos.id).length +
            '</div></div></div></div></td>' +
            '<td><form action="/cerrado?id=' + cursos.id + ' " method="post"><button class="btn btn-dark">CERRAR</button></form></td>' +
            '</tr>');

    })
    texto = (texto + "</tbody></table></div>");

    return texto;
});

hbs.registerHelper('listar', (usuario, listaCursos, listaMatriculas, listaUsuarios) => {

    let texto;


    if (usuario.tipo == 'coordinador') {

        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MODALIDAD:</th>\
                <th>INTENSIDAD:</th>\
                <th>ESTADO:</th>\
                </thead>\
                <tbody>";

        listaCursos.forEach(cursos => {

            texto = (texto +
                "<tr class='table-info text-center'>" +
                '<td>' + cursos.id + '</td>' +
                '<td>' + cursos.nombre_curso + '</td>' +
                '<td>' + cursos.descripcion + '</td>' +
                '<td>' + cursos.valor + '</td>' +
                '<td>' + cursos.modalidad + '</td>' +
                '<td>' + cursos.intensidad + '</td>' +
                '<td>' + cursos.estado + '</td>' +
                '</tr>');
        })
        texto = (texto + "</tbody></table><form action='/coordinador' method='get'><button class='btn btn-dark'>REGISTRAR CURSO</button></form><br>" +
            "<form action='/coordinador2' method='get'><button class='btn btn-dark'>CERRAR CURSO</button></form><br>" +
            "<form action='/coordinador3' method='get'><button class='btn btn-dark'>DESMATRICULAR ESTUDIANTE</button></form><br>" +
            "<form action='/coordinador4' method='get'><button class='btn btn-dark'>MODIFICAR USUARIOS</button></form><br></div><br></div>");
    }
    else if (usuario.tipo == 'docente') {
        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MAS INFORMACION:</th>\
                </thead>\
                <tbody>";

        listaCursos.forEach(cursos => {
            if (cursos.docente == usuario.cedula) {
                texto = (texto +
                    "<tr class='table-info text-center'>" +
                    '<td>' + cursos.id + '</td>' +
                    '<td>' + cursos.nombre_curso + '</td>' +
                    '<td>' + cursos.descripcion + '</td>' +
                    '<td>' + cursos.valor + '</td>' +
                    '<td><div class="accordion" id="accordionExample"></div>' +
                    '<div class="card">' +
                    '<div class="card-header" id="headingOne">' +
                    '<h5 class="mb-0">' +
                    '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
                    "Detalles" +
                    '</button></h5></div>' +
                    '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
                    '<div class="card-body">')

                listaMatriculas.filter(ver => ver.id == cursos.id).forEach(ma => {
                    texto = (texto + "Nombre: " + listaUsuarios.find(v => v.cedula == ma.cedula).nombre + "<br>Correo: " + listaUsuarios.find(v => v.cedula == ma.cedula).correo + "<br><br>")
                })

                texto = (texto + '</div></div></div></div></td>' +
                    '</tr>');
            }
        })
        texto = (texto + "</tbody></table><br></div>");
    }
    else {

        texto = "<div class='table-responsive'> <table class='table table-hover'>\
                <thead class='thead-dark text-center'>\
                <th>ID:</th>\
                <th>NOMBRE:</th>\
                <th>DESCRIPCION:</th>\
                <th>VALOR:</th>\
                <th>MAS INFORMACION:</th>\
                <th>INSCRIBIRSE:</th>\
                </thead>\
                <tbody>";

        listaCursos.forEach(cursos => {
            if (cursos.estado == 'disponible') {
                texto = (texto +
                    "<tr class='table-info text-center'>" +
                    '<td>' + cursos.id + '</td>' +
                    '<td>' + cursos.nombre_curso + '</td>' +
                    '<td>' + cursos.descripcion + '</td>' +
                    '<td>' + cursos.valor + '</td>' +
                    '<td><div class="accordion" id="accordionExample"></div>' +
                    '<div class="card">' +
                    '<div class="card-header" id="headingOne">' +
                    '<h5 class="mb-0">' +
                    '<button class="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">' +
                    "Detalles" +
                    '</button></h5></div>' +
                    '<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">' +
                    '<div class="card-body">' +
                    "Modalidad: " + cursos.modalidad + '<br>Intensidad: ' + cursos.intensidad +
                    '</div></div></div></div></td>' +
                    '<td><form action="/inscrito?cedula=' + usuario.cedula + '&id=' + cursos.id + ' " method="post"><button class="btn btn-dark">INSCRIBIR</button></form></td>' +
                    '</tr>');
            }
        })
        texto = (texto +
            "</tbody></table><form action='/aspirante?cedula=" +
            usuario.cedula + "' method='post'><button class='btn btn-dark'>DARME DE BAJA EN UN CURSO</button></form><br>" +
            '<form action="/updateuser?cedula=' + usuario.cedula + ' " method="post"><button class="btn btn-dark">MODIFICAR MI INFORMACION</button></form><br></div>');

    }
    return texto;
})