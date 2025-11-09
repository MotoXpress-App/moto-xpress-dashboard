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
            <div className="choferes-container" style={{ marginLeft: "220px" }}>
               {/* <h1>Choferes</h1> */}
                <TableDriver data={data} headers={headers} detalles={detalles} />
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .choferes-container {
                        margin-left: 0 !important;
                        padding-top: 60px;
                    }
                }

                @media (max-width: 480px) {
                    .choferes-container {
                        padding: 5px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Choferes;
