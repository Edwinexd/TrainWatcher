import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import './Train.css';

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
            console.error(error);
            // TODO: Display warning to user
        }
    }, [home, work, trainId]);

    useEffect(() => {
        console.log(1)
        const interval = setInterval(() => {
            fetchData();
        }, 5000); // Fetch data every five seconds

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
            <h2>Disembarkation: {disembarkationDirection}</h2>
            <h2>Track: {track}</h2>
            {/* Color yellow if delay is not null */}
            <h2 style={{ color: delay ? 'yellow' : 'white' }}>Delay: {delay}</h2>
        </div>
    );
}

export default Train;