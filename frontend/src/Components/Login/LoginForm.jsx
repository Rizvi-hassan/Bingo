import React from 'react'
import { useState } from 'react';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [invalid, setInvalid] = useState(false);
    const handleLogin = (event) => {
        event.preventDefault();
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
            <form className='form' action={handleLogin}>
                <div style={{ 'marginBottom': '10px' }}>
                    <input type="text" name='email' className="input-field" id='email' value={formData.email} onChange={handleChange} placeholder='Enter Email' />

                </div>
                <div style={{ 'marginBottom': '20px' } }>
                    <input type="password" name='password' className="input-field" id='password' value={formData.password} onChange={handleChange} placeholder='Enter Password' />
                </div>

                <button type="submit" className="login-btn" >Login</button>
                
                <p style={{ 'fontFamily': "Open Sans, sans- serif", 'fontSize': '17px' }}>Don't have an account? <span style={{ 'color': '#1a4a9b', 'textDecoration': 'underline' }} >Register</span> </p>
            </form>
        </div>
    )
}

export default LoginForm