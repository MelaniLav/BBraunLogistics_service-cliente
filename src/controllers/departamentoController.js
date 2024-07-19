const { sql } = require('../database/config');
const { response, request } = require('express');
//const sql = require('mssql');

const geDepartamentos = async (req, res) => {
    try {
        const result = await sql.query('SELECT nombre_departamento FROM departamentos');
        // Extraer solo los nombres de los departamentos del resultado
        const nombresDepartamentos = result.recordset.map(departamento => departamento.nombre_departamento);

        res.json(nombresDepartamentos);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
}

const getDepartamentoPorNombre = async (nombre) => {
    try {
        const result = await sql.query`SELECT id_departamento FROM departamentos WHERE nombre_departamento = ${nombre}`;
        if (result.recordset.length > 0) {
            return result.recordset[0].id_departamento;
        } else {
            throw new Error('No hay departamento para ese nombre');
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        throw err; // Propaga el error para manejarlo en la función que llama
    }
}

module.exports = {
    geDepartamentos,
    getDepartamentoPorNombre
}
