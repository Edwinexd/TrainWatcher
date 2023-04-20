import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
    const navigate = useNavigate();

    const { work, home } = JSON.parse(localStorage.getItem("config") || "{}");
    
    const [workName, setWorkName] = React.useState<String>(work);
    const [homeName, setHomeName] = React.useState<String>(home);
    
    // Fetch station details
    const getStationName = async (id: String) => {
        const response = await fetch(`https://trainwatcher.edt.workers.dev/stations/${id}`)
        const data = await response.json();
        return data.AdvertisedLocationName;
    }
    
    useEffect(() => {
        const setStationNames = async () => {
            setWorkName(await getStationName(work));
            setHomeName(await getStationName(home));
        }
        setStationNames().then();
    }, [home, work])


    return (
        <div className="App">
            <h1>TrainWatcher</h1>
            {/* Show List Page button, changes view to /stations/cst */}
            <button onClick={() => navigate(`/stations/${work}`)}>{workName}</button>
            <button onClick={() => navigate(`/stations/${home}`)}>{homeName}</button>
        </div>
    );
}

export default App;
