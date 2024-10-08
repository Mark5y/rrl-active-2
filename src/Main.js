import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/EventAvailable';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; // For a customizable alert snackbar


const Main = ({ startTracking, stopTracking, sendEmail, visible, firstName: firstNameProp }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [startTime, setStartTime] = useState(null);
    const [stopTime, setStopTime] = useState(null);
    const [firstName, setFirstName] = useState(''); // local state for firstName
    const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');


    // Function to update state from localStorage
    const updateDataFromLocalStorage = () => {
        const savedData = localStorage.getItem('trackerData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFirstName(parsedData.firstName || '');
            setStartTime(parsedData.startTime ? new Date(parsedData.startTime) : null);
            setStopTime(parsedData.stopTime ? new Date(parsedData.stopTime) : null);
        }
    };

    const handleSnackbarOpen = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    
    useEffect(() => {
        setFirstName(firstNameProp);
    }, [firstNameProp]);
    

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    // Load data from localStorage on mount
    useEffect(() => {
        updateDataFromLocalStorage();
    }, []);

    // Listen to changes in local storage
    useEffect(() => {
        const handleStorageChange = () => {
            updateDataFromLocalStorage();
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Force refresh from local storage after actions
    const handleStartTracking = () => {
        startTracking();
        updateDataFromLocalStorage(); // Refresh data after starting
        handleSnackbarOpen('Tracking started!');
    };

    const handleStopTracking = () => {
        stopTracking();
        updateDataFromLocalStorage(); // Refresh data after stopping
        handleSnackbarOpen('Tracking stopped!');
    };

    const handleSendEmail = () => {
        sendEmail();
        updateDataFromLocalStorage(); // Refresh data after sending
        handleSnackbarOpen('Email sent!');
        window.location.reload();   
    };

    // Format time for display
    const formatTime = (date) => {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return date ? date.toLocaleDateString('en-PH', options) : '';
    };

    return (
        <div style={{
            display: visible ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            flexDirection: 'column',
            backgroundColor: '#00004d'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '20px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
                width: '400px'
            }}>
                <img src={`${process.env.PUBLIC_URL}/rrl-blue.png`} alt="Logo" style={{ width: '250px', marginBottom: '-50px', marginTop: '-75px' }} />

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '-15px' }}>
                        <AccountCircleIcon style={{ marginRight: '5px',color: '#00004d' }} />
                        <p style={{ fontSize: 'large' }}>Hi, {firstName}!</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon style={{ marginRight: '5px', color: '#00004d' }} />
                        <p style={{ margin: '0', fontWeight: 'normal', fontSize: 'medium' }}>{formatTime(currentTime)}</p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '10px',
                    padding: '10px',
                    marginBottom: '20px',
                    marginTop: '20px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    textAlign: 'left'
                }}>
                    <div style={{ margin: '5px', display: 'flex', alignItems: 'center' }}>
                        <AddBoxIcon style={{ marginRight: '5px' , color: '#00004d' }} />
                        <p style={{ margin: '0', fontSize: 'medium' }}>Login Time:</p>
                    </div>
                    <p style={{ margin: '0', marginTop: '5px', fontSize: 'medium', marginLeft: '34px' }}>
                        {startTime ? formatTime(startTime) : 'Not logged in yet'}
                    </p>

                    <div style={{ margin: '5px', marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                        <DoNotDisturbOnIcon style={{ marginRight: '5px' , color: '#00004d'}} />
                        <p style={{ margin: '0', fontSize: 'medium' }}>Logout Time:</p>
                    </div>
                    <p style={{ margin: '0', marginTop: '5px', fontSize: 'medium', marginLeft: '34px', marginBottom: '10px' }}>
                        {stopTime ? formatTime(stopTime) : 'Not logged out yet'}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    <Button variant="contained" onClick={handleStartTracking} style={{ width: '100%', backgroundColor: '#00E676', borderRadius: '10px', fontSize: '16px', padding: '10px 20px' }}>Start</Button>
                    <Button variant="contained" onClick={handleStopTracking} style={{ width: '100%', backgroundColor: '#FF1744', borderRadius: '10px', fontSize: '16px', padding: '10px 20px' }}>Stop</Button>
                    <Button variant="contained" onClick={handleSendEmail} style={{ width: '100%', backgroundColor: '#FFD600', borderRadius: '10px', fontSize: '16px', padding: '10px 20px' }}>Send</Button>
                </div>
            </div>

            <Snackbar open={snackbarOpen} 
            autoHideDuration={3000} 
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Center the Snackbar
            >

    <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
        {snackbarMessage}
    </Alert>
</Snackbar>

        </div>

        
    );

  

};


export default Main;
