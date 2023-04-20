import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './App.css';

function Config() {
    const navigate = useNavigate();

    const { work, home } = useParams();

    localStorage.setItem("config", JSON.stringify({
        "work": work,
        "home": home
    }));

    
    useEffect(() => {
        // Wait 3 seconds before redirecting
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, [home, work])


    return (
        <div className="App">
            <h1>Configuration Set</h1>
            <h2>Redirecting...</h2>
        </div>
    );
}

export default Config;