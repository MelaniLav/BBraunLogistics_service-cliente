
const {sql}= require('../database/config');
//const sql = require('mssql');
const { response, request } = require('express');
const ClienteDto = require('../Dtos/clienteDTO');  // Asegúrate de importar correctamente
const departamentoController = require('../controllers/departamentoController');

// Listar clientes
const geClientes = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM cliente');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
}

// Listar clientes con el nombre de departamento
const getClientesDto = async (req, res) => {
    try {
        const result = await sql.query(`
            SELECT cliente.id_cliente, cliente.empresa, cliente.representante, 
                   cliente.dni, cliente.email, cliente.telefono, cliente.direccion, 
                   departamentos.nombre_departamento
            FROM cliente
            JOIN departamentos ON cliente.id_departamento = departamentos.id_departamento
        `);

        const clientesDto = result.recordset.map(cliente => 
            new ClienteDto(cliente.id_cliente, cliente.empresa, cliente.representante, cliente.dni,
                cliente.email, cliente.telefono, cliente.direccion, cliente.nombre_departamento
            )
        );

        res.json(clientesDto);

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
};


// Buscar cliente por id
const getCliente = async (req, res = response) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM cliente WHERE id_cliente = ${id}`;
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Cliente no encontrado');
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
    }
}

// Insertar un cliente
const postInsertarCliente = async (req, res = response) => {
    try {
        const { id_cliente, empresa, representante, dni,email,telefono,direccion,departamento } = req.body;
        const id_departamento = await departamentoController.getDepartamentoPorNombre(departamento);

        const result = await sql.query`
        INSERT INTO cliente (id_cliente, empresa, representante, dni, email, telefono, direccion, id_departamento)
        VALUES (${id_cliente}, ${empresa}, ${representante}, ${dni}, ${email}, ${telefono}, ${direccion}, ${id_departamento})
    `;
        res.json({ message: 'Inserción exitosa', result: result.recordset });
        console.log("Insercion de cliente");
    } catch (err) {
        console.log("error pe");
        console.error('Error inserting data:', err);
        res.status(500).send('Error inserting data');
    }
}

// Actualizar un cliente
const putActualizarCliente = async (req, res = response) => {
    try {
        const { id_cliente, empresa, representante, dni,email,telefono,direccion,departamento } = req.body;
        const id_departamento = await departamentoController.getDepartamentoPorNombre(departamento);

        let updateFields = [];
        if (representante) updateFields.push(`representante = '${representante}'`);
        if (dni) updateFields.push(`dni = '${dni}'`);
        if (email) updateFields.push(`email = '${email}'`);
        if (telefono) updateFields.push(`telefono = '${telefono}'`);
        if (direccion) updateFields.push(`direccion = '${direccion}'`);
        if (departamento) updateFields.push(`id_departamento = '${id_departamento}'`);
        console.log("hola");

        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar' });
        }

        const query = `UPDATE cliente SET ${updateFields.join(', ')} WHERE id_cliente = '${id_cliente}'`;

        const result = await sql.query(query);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        res.json({ message: 'Actualización exitosa', result: result.recordset });
    } catch (err) {
        console.error('Error updating data:', err);
        res.status(500).send('Error updating data');
    }
}

module.exports = {
    geClientes,
    getCliente,
    postInsertarCliente,
    putActualizarCliente,
    getClientesDto
}

