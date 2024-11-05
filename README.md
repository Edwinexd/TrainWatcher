# TrainWatcher
A simple react app to ease commuting by showing the next arrival times for trains to a specific station.
Made with React and the CF Workers platform by Cloudflare.

## Usage using the hosted version
1. Go to [https://trainwatcher.edthing.com](https://trainwatcher.edthing.com). 
2. Configure your "home" and "work" stations by going to /config/:work/:home where :work and :home are the station ids provided by the Trafikverket API.
3. Go to / to select which station you want to see the next arrivals for.
4. Select the next arrival to see more details about the train and it's arrival time.


## Known limitations
- Does not support train routes which are not direct.
- Only a few stations have had their disembarkation directions added to [Edwinexd/TrainWatcher-api](https://github.com/Edwinexd/TrainWatcher-api).

Powered by [Trafikverket öppna API för trafikinformation](https://api.trafikinfo.trafikverket.se/) using [Edwinexd/TrainWatcher-api](https://github.com/Edwinexd/TrainWatcher-api).
