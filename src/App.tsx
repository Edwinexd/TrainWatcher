import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
          try {
            const [workName, homeName] = await Promise.all([
              getStationName(work),
              getStationName(home),
            ]);
            setWorkName(workName);
            setHomeName(homeName);
          } catch (error) {
            console.error(error);
            throw error;
          }
        };
        toast.promise(setStationNames(), {
          pending: 'Fetching station names...',
          success: 'Successfully fetched station names!',
          error: 'Failed to fetch station names.',
        });
      }, [work, home])


    return (
        <div className="App">
            <h1>TrainWatcher</h1>
            {/* Show List Page button, changes view to /stations/cst */}
            <button onClick={() => navigate(`/stations/${work}`)}>{workName}</button>
            <button onClick={() => navigate(`/stations/${home}`)}>{homeName}</button>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                limit={1}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                theme="dark"
            />
        </div>
    );
}

export default App;
