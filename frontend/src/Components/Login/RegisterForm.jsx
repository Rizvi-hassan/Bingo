import React from 'react'
import { useState, useRef } from 'react';
import { Player } from '../Play/Player';
import { api } from '../../lib/axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        profileUrl: ''

    });
    const [profilePic, setProfilePic] = useState(null);
    const [invalid, setInvalid] = useState(false);
    const fileInputRef = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setInvalid(false);
        setErrMsg('');

        if (formData.email === '' || formData.username === '' || formData.password === '' || formData.confirmPassword === '' || !profilePic) {
            setInvalid(true);
            setErrMsg('All fields are required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setInvalid(true);
            setErrMsg('Passwords do not match');
            return;
        }

        const data = new FormData();
        data.append('username', formData.username.trim());
        data.append('email', formData.email.trim());
        data.append('password', formData.password);
        data.append('profile', profilePic);

        await register(data);

        setFormData({
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        });
    }

    const register = async (data) => {
        setLoading(true);
        try {
            const result = await api.post('/auth/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (result.status === 200) {
                console.log('Registration successful:', result.data);
                setInvalid(false);
                setErrMsg('');
                navigate('/');
            }
            

        } catch (error) {
            // console.error('Error during registration:', error);
            setErrMsg(error.response.data.message);
            setInvalid(true);

        } finally {
            setLoading(false);
        }

    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }

    const handleProfileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePic(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    profileUrl: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div>
            <h1 style={{ 'textAlign': 'center', 'marginBottom': '15px' }}>Register</h1>
            <form onSubmit={handleRegister} className='form'>
                <div style={{ 'marginBottom': '10px' }}>
                    <input type="text" name='email' className="input-field" id='email' value={formData.email} onChange={handleChange} placeholder='Enter Email' />

                </div>
                <div style={{ 'marginBottom': '10px' }}>
                    <input type="text" name='username' className="input-field" id='username' value={formData.username} onChange={handleChange} placeholder='Enter Username' />

                </div>

                <div style={{ 'marginBottom': '10px' }}>
                    <input type="password" name='password' className="input-field" id='password' value={formData.password} onChange={handleChange} placeholder='Enter Password' />
                </div>

                <div style={{ 'marginBottom': '10px' }}>
                    <input type="password" name='confirmPassword' className="input-field" id='confirmPassword' value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password' />
                </div>

                <div style={{ 'marginBottom': '20px', display: 'flex', alignItems: 'center', 'gap': '1rem', 'justifyContent': 'center' }}>
                    <Player image={formData.profileUrl} />
                    <div>
                        <button type='button' className='login-btn' onClick={() => fileInputRef.current?.click()}>Profile Picture</button>
                        <span style={{ 'display': 'block', 'fontSize': '10px' }}>*We recommend square images</span>
                    </div>

                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleProfileChange} style={{ display: 'none' }} />

                </div>




                {invalid && <span style={{ color: 'red', fontFamily: 'Open Sans, sans-serif', fontSize: '15px' }}>{errMsg}</span>}
                <button type="submit" className="login-btn" disabled={loading} >{loading? "Loading..." : 'Register'}</button>

                {/* <p style={{ 'fontFamily': 'Open Sans, sans-serif', 'fontSize': '17px' }}>Have an account? <span style={{ 'color': 'blue' }} >Login</span> </p> */}
            </form>
        </div>
    )
}

export default RegisterForm