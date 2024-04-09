import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import _ from "lodash";
import axios from "axios";

const cantPacientes = 10;

axios.get(`https://randomuser.me/api/?results=${cantPacientes}`).then((data) => {
    const pacientes = data.data.results.map(paciente => ({
        ...paciente,
        uuid: uuidv4().slice(0,6),
        timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
    }));
    // agrupamos por gender
    const grupoGenero = _.groupBy(pacientes, 'gender');

    // iteramos por genero
    _.forEach(grupoGenero, (usuarios, genero) => {
        if(genero == 'male'){
            var gen = "Masculino";
        }
        else{
            var gen = "Femenino";
        }
        console.log(`Usuarios de género ${gen}:`);
        // Iterar sobre los usuarios de cada grupo
        _.forEach(usuarios, (usuario, i) => {
            console.log(chalk.blue.bgWhite(`${i + 1}. Nombre: ${usuario.name.first} - Apellido: ${usuario.name.last} - Género: ${usuario.gender} - uuid: ${usuario.uuid} - Timestamp: ${usuario.timestamp}`));
        });
    });
});