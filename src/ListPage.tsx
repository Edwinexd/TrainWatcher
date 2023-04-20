import React, { useEffect } from 'react';
import './ListPage.css';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

function ListPage() {
    const navigate = useNavigate();
    
    const { stationId } = useParams();
    
    const { work, home } = JSON.parse(localStorage.getItem("config") || "{}");

    let [items, setItems] = React.useState<any[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const response = await fetch(`https://trainwatcher.edt.workers.dev/arrivals/${stationId}/${stationId === work ? home : work}`);
                const data = await response.json();
                let output: any[] = [];
                for (let i = 0; i < data.length; i++) {
                    output.push({
                        name: data[i].InformationOwner + " - " + data[i].AdvertisedTrainIdent,
                        departure: null,
                        arrival: data[i].AdvertisedTimeAtLocation,
                        id: data[i].AdvertisedTrainIdent,
                    });
                }
                // items = output;
                setItems(output);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [home, stationId, work]);

    return (
        <div className="ListPage">
            <h1>Arrivals</h1>
            <ul>
                {items.map((item) => (
                    <li key={item.id} onClick={() => navigate(`/trains/${item.id}`)}>
                        {item.name}
                        <div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <span>{item.departure}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height="1.5rem"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                                <span>{moment(item.arrival).format("HH:mm")}</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <span>Arrival: {moment(item.arrival).fromNow()}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height="1.5rem"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListPage;