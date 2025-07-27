import React from 'react'
import { useState } from 'react';
import { api } from '../../lib/axios';
import authStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [invalid, setInvalid] = useState(false);
    const { setUser } = authStore();
    const [errMsg, setErrMsg] = useState('');
    const navigate = useNavigate();

    const handleLogin = async(event) => {
        event.preventDefault();
        setInvalid(false);
        setErrMsg('')

        if(formData.email === '' || formData.password === '') {
            setInvalid(true);
            setErrMsg("All fields are required");
            return;
        }

        try {
            const response = await api.post('/auth/login', formData);
            if (response.status === 200){
                setUser(response.user)
                navigate('/');
            }
            
        } catch (error) {
            console.log(error);
            setInvalid(true);
            setErrMsg(error.message);
        }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    return (
        <div>   
            <h1 style={{ 'textAlign': 'center', 'marginBottom': '15px' }}>Login</h1>
            <form className='form' onSubmit={handleLogin}>
                <div style={{ 'marginBottom': '10px' }}>
                    <input type="text" name='email' className="input-field" id='email' value={formData.email} onChange={handleChange} placeholder='Enter Email' />

                </div>
                <div style={{ 'marginBottom': '20px' } }>
                    <input type="password" name='password' className="input-field" id='password' value={formData.password} onChange={handleChange} placeholder='Enter Password' />
                </div>

                {invalid && <span style={{ color: 'red', fontFamily: 'Open Sans, sans-serif', fontSize: '15px' }}>{errMsg}</span>}
                <button type="submit" className="login-btn" >Login</button>
                
                {/* <p style={{ 'fontFamily': "Open Sans, sans- serif", 'fontSize': '17px' }}>Don't have an account? <span style={{ 'color': '#1a4a9b', 'textDecoration': 'underline' }} >Register</span> </p> */}
            </form>
        </div>
    )
}

export default LoginForm