import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './images/motox_logo.jpeg';  // Asegúrate de usar la ruta correcta
import axios from 'axios';
import './App.css';

const Login = ({ onLogin }) => {
    
    const [email, setEmail] = useState('');   // Estado para el nombre de usuario
    const [password, setPassword] = useState('');   // Estado para la contraseña

    const [clientType, setClientType] = useState('administrador');  // Estado para el tipo de cliente

    const [error, setError] = useState('');        // Estado para el mensaje de error
    const [loginTime, setLoginTime] = useState(null);

    const navigate = useNavigate();  // Hook de React Router para redirigir


    //-- VERSION HARDCODEADA --
    /*
    const handleLogin = () => {
        onLogin(); // Actualiza el estado en App
        navigate('/Home');
    };
    */


    //-- VERSION ORIGINAL --
    const handleLogin = () => {

        onLogin(); // Actualiza el estado en App - autoriza rutas
        navigate('/home');

    };


    const login = async (email, password) => {

        try {

            console.log(email, password);

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/login`,
                {
                    email: email,
                    password: password,
                },
            );

            console.log(response.data.data)

            //---------DATOS DE USUARIO EN LA SESION-------------------

            // Almacenar el  ID localStorage
            localStorage.setItem('id', response.data.data.id);

            // Almacenar el  nombre de cliente en localStorage
            localStorage.setItem('name', response.data.data.name);

            // Almacenar el borra_usu localStorage
            localStorage.setItem('lastname', response.data.data.lastname);

            // Almacenar el tipo cliente localStorage
            localStorage.setItem('email', response.data.data.email);

            // Almacenar el tipo cliente localStorage
            localStorage.setItem('terms', response.data.data.terms_and_conditions);

            //horario de login
            const currentTime = new Date().toLocaleString();

            // Guardar en localStorage
            localStorage.setItem('loginTime', currentTime);
            setLoginTime(currentTime);

            setError('');  // Limpiar cualquier error previo
            localStorage.setItem('isAuthenticated', 'true')

            //------------------------------------------------------------

            //navigate('/Home');  // Redirigir al usuario a la página de inicio
            handleLogin()

            return response.data;

        } catch (error) {

            if (error.response?.status === 401) {
                setError('Usuario o contraseña incorrectos');
            }
            else if (error.response) {
                // Error del servidor (por ejemplo, 401 Unauthorized)
                console.error('Error en la respuesta:', error.response.data);
            } else if (error.request) {
                // No hubo respuesta del servidor
                console.error('No se recibió respuesta del servidor:', error.request);
            } else {
                // Otro tipo de error
                console.error('Error al configurar la solicitud:', error.message);
            }
            //throw error;

        }
    };


    //-- VERSION HARDCODEADA --
    /*
    const login = async (email, password) => {

        if (email === 'marcos@gmail.com' && password === '1234') {
            handleLogin()
        } else {
            console.log('Datos erroneos')
        }
    }
    */


    const handleSubmit = (event) => {

        event.preventDefault();  // Evitar comportamiento predeterminado del formulario

        login(email, password)

    };

    return (
        <div className="container mt-5" >
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ marginTop: '20px' }}>
                        <div className="card-body">
                            <div className="text-center">
                                <img
                                    src={logo} // URL de la imagen externa
                                    alt="Imagen Externa"
                                    className="logo-img"
                                    width={200}
                                />
                            </div>

                            {/* Formulario de login */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado
                                        placeholder="Ingresa tu Email"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado
                                        placeholder="Ingresa tu contraseña"
                                    />
                                </div>
                                {/* Mensaje de error */}
                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Iniciar Sesión
                                    </button>
                                </div>
                                <Link to="/RecoverPass" className="nav-link">Has olvidado tu contraseña ?</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
