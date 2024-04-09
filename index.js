
// Librerías
import chalk from "chalk"; // Dar formato a los mensajes en la consola
import { v4 as uuidv4 } from "uuid"; //generar UUID
import moment from "moment"; // manejar fechas y horas
import _ from "lodash"; // Utilidades para trabajar con arrays, objetos, etc
import axios from "axios"; // Para solicitudes HTTP
import express from "express"; // Importar el módulo Express

// Creando instancia de la aplicación Express
const app = express();

// Pacientes para soliciar a la API
const cantPacientes = 10;

// Función para imprimir en consola, con letra azul y fondo blanco
const verenConsola = (grupoGenero) => {
    console.log(chalk.blue.bold.bgWhite("Lista de pacientes"))
    _.forEach(grupoGenero, (usuarios, genero) => {
        console.log(`${genero == 'male' ? 'Masculino' : 'Femenino'}:`);
        // Iterar sobre los usuarios de cada grupo
        _.forEach(usuarios, (usuario, i) => {
            console.log(chalk.blue.bgWhite(`${i + 1}. Nombre: ${usuario.name.first} - Apellido: ${usuario.name.last} - Género: ${usuario.gender} - uuid: ${usuario.uuid} - Timestamp: ${usuario.timestamp}`));
        });
    });
};

// función para generar el html para mostrar en en localhost
const generaHTML = (grupoGenero) => {
    let html = '<h1>Lista de Pacientes</h1>';
    _.forEach(grupoGenero, (usuarios, genero) => {
        html += `<h2>${genero == 'male' ? 'Masculino' : 'Femenino'}:</h2>`;
        html += '<ul>';
        _.forEach(usuarios, (usuario, i) => {
            html += `<li>${i+1}. Nombre: ${usuario.name.first} - Apellido: ${usuario.name.last} - Género: ${usuario.gender} - uuid: ${usuario.uuid} - Timestamp: ${usuario.timestamp}</li>`;
        });
        html += '</ul>';
    });
    return html;
};

// Solicitud GET a la ruta raíz ("/")
app.get("/", (req, res) => {
    
    // Realiza una solicitud HTTP a randomuser para obtener pacientes
    axios.get(`https://randomuser.me/api/?results=${cantPacientes}`).then((data) => {
        // Procesando datos obtenidos por la API
        const pacientes = data.data.results.map(paciente => ({
                    ...paciente,
            //Se agrega el uuid y timestap a cada paciente que se encuentre en pacientes
            uuid: uuidv4().slice(0,6),
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        }));
        // Agrupamos por genero
        const grupoGenero = _.groupBy(pacientes, 'gender');
        // Se llama a función para imprimir por consola.
        verenConsola(grupoGenero);
        // Se genera un html para enviarlo como respuesta
        res.send(generaHTML(grupoGenero));
    });
});

// Creando servidor con express en puerto 3000
app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});

// Ruta genérica 
app.get("*", (req, res) => {
    res.send("<center><h1>Esta página no existe... </h1></center>");
});