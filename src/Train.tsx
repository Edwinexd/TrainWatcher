import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import './Train.css';
import { ToastContainer, Slide, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Train() {
    const { trainId } = useParams();

    const { work, home } = JSON.parse(localStorage.getItem("config") || "{}");

    const [trainData, setTrainData] = useState<any>();
    const [countdownTime, setCountdownTime] = useState<String>();
    const [disembarkationDirection, setDisembarkationDirection] = useState<String>();
    const [track, setTrack] = useState<String>();
    const [delay, setDelay] = useState<String>();

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(`https://trainwatcher.edt.workers.dev/trains/${trainId}`);
            const data = await response.json();
            // trainData format = [{"ActivityId":"1500adde-f75d-3909-08db-3630cc258dee","ActivityType":"Avgang","Advertised":true,"AdvertisedTimeAtLocation":"2023-04-20T06:45:00.000+02:00","AdvertisedTrainIdent":"200","Canceled":false,"Deleted":false,"Deviation":["Buss"],"EstimatedTimeIsPreliminary":false,"FromLocation":[{"LocationName":"Nk","Priority":1,"Order":0}],"InformationOwner":"Mälardalstrafik AB","LocationSignature":"Nk","ModifiedTime":"2023-04-06T00:03:40.587Z","NewEquipment":0,"PlannedEstimatedTimeAtLocationIsValid":false,"ProductInformation":["Mälartåg"],"ScheduledDepartureDateTime":"2023-04-20T00:00:00.000+02:00","ToLocation":[{"LocationName":"Söö","Priority":1,"Order":0}],"TrackAtLocation":"x","TypeOfTraffic":"Buss","WebLink":"https://malartag.se/","WebLinkName":"Mälartåg Kundservice","Delay":null,"DisembarkationDirection":null}]
            if (data) {
                for (let i = 0; i < data.length; i++) {
                    // Get entry where ActivityType is 'Ankomst' and LocationSignature is 'Nk' or 'Cst' (Nyköping C or Stockholm C) and 
                    // FromLocation list contains an Object with LocationName 'Nk' or 'Cst' (Nyköping C or Stockholm C)
                    let blob = data[i];
                    blob.FromLocation = blob.FromLocation || []; // If FromLocation is undefined, set it to an empty array
                    blob.ViaFromLocation = blob.ViaFromLocation || []; // If ViaFromLocation is undefined, set it to an empty array
                    // Combine blob.FromLocation and blob.ViaFromLocation into one array
                    let passing_locations = blob.FromLocation.concat(blob.ViaFromLocation);
                    if (blob.ActivityType === 'Ankomst' && blob.Advertised === true && (blob.LocationSignature.toLowerCase() === home || blob.LocationSignature.toLowerCase() === work) && passing_locations.find((obj: any) => obj.LocationName.toLowerCase() === home || obj.LocationName.toLowerCase() === work)) {
                        setTrainData(data[i]);
                        break;
                    }
                }
            }
        } catch (error) {
            toast.warn("Failed to fetch train info from Trafikverket API", {
                position: "bottom-center",
                autoClose: 30000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                transition: Slide,
                theme: "dark",
            });
            console.error(error);
        }
    }, [home, work, trainId]);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 30000); // Fetch data every thirty seconds

        return () => clearInterval(interval);
    }, [fetchData]);
    // Loop every second
    useEffect(() => {
        const render = () => {
            if (!trainData) {
                return;
            }
            let estimatedArrivalTime;
            if (trainData.EstimatedTimeAtLocation) {
                estimatedArrivalTime = moment(trainData.EstimatedTimeAtLocation);
            } else {
                estimatedArrivalTime = moment(trainData.AdvertisedTimeAtLocation);
            }
            const now = moment();
            const diff = moment(estimatedArrivalTime).diff(now);
            if (diff < 0) {
                setCountdownTime(estimatedArrivalTime.fromNow());
            } else {
                setCountdownTime(moment.utc(diff).format('HH:mm:ss'));
            }
            setDisembarkationDirection(trainData.DisembarkationDirection);
            setTrack(trainData.TrackAtLocation);
            if (trainData.Delay) {
                setDelay(moment.duration(trainData.Delay, "seconds").humanize());
            } else {
                setDelay(undefined);
            }
        };
        const interval = setInterval(async () => {
            render();
        }, 500);
        render()
        return () => clearInterval(interval);
    }, [trainData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="Train">
            <h1>Train {trainId}</h1>
            <h2>Arrival: {countdownTime}</h2>
            {/* Display a right arrow if disembarkationDirection is Right, left arrow if direction is left otherwise no arrow */}            
            <h2>Disembarkation: {disembarkationDirection} {disembarkationDirection === 'Right' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" height="1.5em"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg> : disembarkationDirection === 'Left' ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" height="1.5em"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12H4.5m0 0l6.75-6.75M4.5 12l6.75 6.75" /></svg> : ''} </h2>
            <h2>Track: {track} </h2>
            <h2 style={{ color: delay ? 'yellow' : 'white' }}>Delay: {delay}</h2>
            <ToastContainer
                position="bottom-center"
                autoClose={30000}
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

export default Train;