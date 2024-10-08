import React, { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import Main from './Main';
import { Dialog, DialogActions, DialogContent, TextField, Button } from '@mui/material';

const App = () => {
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [stopTime, setStopTime] = useState(null);
    const [cursorActivityTime, setCursorActivityTime] = useState(0);
    const [open, setOpen] = useState(true);
    const [formData, setFormData] = useState({ firstName: '', lastName: '', projectName: '', employeeId: '' });
    const [isFormValid, setIsFormValid] = useState(false);

    // Load saved data from local storage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('trackerData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setFormData({
                firstName: parsedData.firstName || '',
                lastName: parsedData.lastName || '',
                projectName: parsedData.projectName || '',
                employeeId: parsedData.employeeId || '',
            });
            setStartTime(parsedData.startTime ? new Date(parsedData.startTime) : null);
            setStopTime(parsedData.stopTime ? new Date(parsedData.stopTime) : null);
            setCursorActivityTime(parsedData.cursorActivityTime || 0);
            setOpen(false); // Close dialog if data exists
        }
    }, []);

    // Validate the form when formData changes or when it's loaded from local storage
    useEffect(() => {
        const { firstName, lastName, projectName, employeeId } = formData;
        setIsFormValid(firstName.trim() !== '' && lastName.trim() !== '' && projectName.trim() !== '' && employeeId.trim() !== '');
    }, [formData]);

    // Save tracking data to local storage
    const saveDataToLocalStorage = (updatedStartTime, updatedStopTime) => {
        const data = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            projectName: formData.projectName,
            employeeId: formData.employeeId,
            startTime: updatedStartTime ? updatedStartTime.toString() : startTime ? startTime.toString() : null,
            stopTime: updatedStopTime ? updatedStopTime.toString() : stopTime ? stopTime.toString() : null,
            cursorActivityTime: cursorActivityTime,
        };
        localStorage.setItem('trackerData', JSON.stringify(data));
    };

    // Handle form dialog close
    const handleClose = () => {
        setOpen(false);
    };

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form and save data
    const handleSubmit = () => {
        saveDataToLocalStorage(null, null); // Save data on submit
        handleClose(); // Close dialog
    };

    // Start tracking function
    const startTracking = () => {
        const now = new Date();
        setIsTracking(true);
        setStartTime(now);
        setStopTime(null); // Reset stop time
        setCursorActivityTime(0); // Reset cursor activity

        // Save data with the updated startTime
        saveDataToLocalStorage(now, null);
    };

    // Stop tracking function
    const stopTracking = () => {
        const now = new Date();
        setIsTracking(false);
        setStopTime(now);

        // Save data with the updated stopTime
        saveDataToLocalStorage(null, now);
    };

    // Send email and clear local storage
    const sendEmail = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Activity');

        worksheet.columns = [
            { header: 'First Name', key: 'firstName', width: 25 },
            { header: 'Last Name', key: 'lastName', width: 25 },
            { header: 'Project Name', key: 'projectName', width: 25 },
            { header: 'Employee ID', key: 'employeeId', width: 25 },
            { header: 'Logged In', key: 'loggedIn', width: 25 },
            { header: 'Logged Out', key: 'loggedOut', width: 25 },
            { header: 'Total Active Hours', key: 'totalActiveHours', width: 25 },
        ];

        const totalActiveHours = (cursorActivityTime / 3600000).toFixed(2); // Convert ms to hours

        worksheet.addRow({
            firstName: formData.firstName,
            lastName: formData.lastName,
            projectName: formData.projectName,
            employeeId: formData.employeeId,
            loggedIn: startTime ? startTime.toLocaleString() : '',
            loggedOut: stopTime ? stopTime.toLocaleString() : '',
            totalActiveHours: totalActiveHours,
        });

        // Save workbook as a file
        workbook.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/octet-stream' });
            saveAs(blob, 'activity.xlsx');

            // After sending or saving, clear local storage and reset the state
            localStorage.clear();
            setStartTime(null);
            setStopTime(null);
            setCursorActivityTime(0);
            setFormData({ firstName: '', lastName: '', projectName: '', employeeId: '' });
            setIsTracking(false);
            setOpen(true); // Reopen the dialog after clearing
        });
    };

    return (
        <div style={{ backgroundColor: '#00004d', height: '100vh' }}>
            <Dialog
                open={open}
                PaperProps={{ style: { borderRadius: 20, width: '400px' } }}
                BackdropProps={{ onClick: (e) => e.stopPropagation() }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                    <img src={`${process.env.PUBLIC_URL}/rrl-blue.png`} alt="Logo" style={{ width: '250px', marginBottom: '-70px', marginTop: '-50px' }} />
                </div>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="firstName"
                        label="First Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.firstName}
                        onChange={handleChange}
                        InputLabelProps={{ style: { fontSize: '14px' } }}  
                    />
                    <TextField
                        margin="dense"
                        name="lastName"
                        label="Last Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.lastName}
                        onChange={handleChange}
                        InputLabelProps={{ style: { fontSize: '14px' } }}  
                    />
                    <TextField
                        margin="dense"
                        name="projectName"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={formData.projectName}
                        onChange={handleChange}
                        InputLabelProps={{ style: { fontSize: '14px' } }}  
                    />
                    <TextField
                        margin="dense"
                        name="employeeId"
                        label="Employee ID"
                        type="number"
                        fullWidth
                        variant="standard"
                        value={formData.employeeId}
                        onChange={handleChange}
                        InputLabelProps={{ style: { fontSize: '14px' } }}  
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleSubmit} 
                        disabled={!isFormValid} 
                        fullWidth 
                        style={{ 
                            backgroundColor: isFormValid ? '#333370' : '#9ea9b1', 
                            color: 'white' , borderRadius: '10px', fontSize: '16px', padding: '10px 20px', marginBottom:'15px'
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Main 
                startTracking={startTracking} 
                stopTracking={stopTracking} 
                sendEmail={sendEmail} 
                startTime={startTime} 
                stopTime={stopTime} 
                firstName={formData.firstName} 
                visible={!open}
            />
        </div>
    );
};

export default App;
