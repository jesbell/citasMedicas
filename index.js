import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import axios from "axios"; 
import express from "express";

const app = express();

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

app.get("/", (req, res) => {
    
    axios.get(`https://randomuser.me/api/?results=${cantPacientes}`).then((data) => {
        const pacientes = data.data.results.map(paciente => ({
                    ...paciente,
            uuid: uuidv4().slice(0,6),
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
        }));
        // agrupamos por genero
        const grupoGenero = _.groupBy(pacientes, 'gender');

        verenConsola(grupoGenero);

        res.json(grupoGenero);
    });
});

app.listen(3000, () => {
    console.log("El servidor está inicializado en el puerto 3000");
});