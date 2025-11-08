import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import TableDriver from './Page/Driver/TableDriver';
import axios from 'axios';

const Choferes = () => {

    const [data, setData] = useState([]);
    const [detalles, setDetalles] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/driver/all-driver`);
        
        const campos = ['id', 'email', 'lastname', 'name'];

        const resultado = response.data.map(obj =>
            Object.fromEntries(campos.map(campo => [campo, obj[campo]]))
        );

        setData(resultado);
    };

    // 🔹 Relación entre claves y nombres visibles
    const headers = [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'lastname', label: 'Apellido' },
        { key: 'name', label: 'Nombre' },
    ];

    return (
        <div>
            <Sidebar />
           {/* <h1>Choferes</h1> */}
            <TableDriver data={data} headers={headers} detalles={detalles} />
        </div>
    );
};

export default Choferes;
