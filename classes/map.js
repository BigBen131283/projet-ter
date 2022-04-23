import stations from "./stations.js"

export default class map {
    #primaryColor = "#15DEA5";
    #secondaryColor = "#2B29FF";
    #nobikeColor = "#EB1C41";
    #resaColor = "#30D620";
    constructor (selectedCity) {
        this.selectedCity = selectedCity;
        this.mapQuestKey = "4Ou16zkSpxJ8izAZ4MEUjBSLFDskRxu4";
        this.map = this.createMap();
        this.stations = {};
        this.allStations = [];
    }
    getName() {
        return(this.name);
    }
    createMap() {
        L.mapquest.key = this.mapQuestKey;
        let map = L.map('map', {
            center: this.selectedCity.position,
            layers: L.mapquest.tileLayer('map'),
            zoom: 3,                                           // Zoom range from 1 to 18, the greater the more focused
            minZoom: 2,
            maxZoom: 16,
        });
        this.stations = new stations(this.selectedCity.name);
        this.loadStations();
        return map        
    }

    setMapPosition(selectedCity){
        this.selectedCity = selectedCity;
        if (this.selectedCity.name == "--") {
            this.map.setView(this.selectedCity.position, 3)
        }
        else {
            this.map.setView(this.selectedCity.position, 10)            //setView vient de mapQuest
        }
        this.stations = new stations(this.selectedCity.name);
        this.loadStations();
    }

    setStationPosition(stationNumber){
        let x = this.getStation(stationNumber);
        this.map.setView(x.position, 14);
    }

    loadStations() {
        this.stations.loadStations() //Attention ici c'est le loadStation de station.js
            .then((resp) => {
                this.allStations = resp;
                window.postMessage(
                    {
                        origin : "MAPJS-STATIONSLOADED",
                        stationsnumber : this.allStations.length
                    }
                )
                this.displayStations();
            })
            .catch((err) => {
                console.log("Erreur affichage")
            })
    }

    displayStations() {
        let markers = L.markerClusterGroup();
        for ( let i=0; i<this.allStations.length; i++) {
            let secondaryColor = this.#secondaryColor;
            if (this.allStations[i].available_bikes === 0) {
                secondaryColor = this.#nobikeColor;
            }
            markers.addLayer(L.marker([this.allStations[i].position.lat, this.allStations[i].position.lng], 
                                    {
                                        title : this.allStations[i].number, 
                                        draggable : false,
                                        clickable : true,
                                        icon : L.mapquest.icons.circle (
                                        {
                                            primaryColor: this.#primaryColor,       // Outer circle line ?
                                            secondaryColor: secondaryColor,   // Circle color ?
                                            shadow: true,
                                            symbol: this.allStations[i].available_bikes
                                        })
                                    }
                ).on('click', (e) => {
                    for (let i=0; i<this.allStations.length; i++) {
                        if (this.allStations[i].number === e.sourceTarget.options.title) {
                            this.map.setView(this.allStations[i].position, this.map.getZoom())
                            window.postMessage(
                                {
                                    origin : "clickedStation",
                                    station : this.allStations[i]
                                }
                            )
                        }
                    }
                })
            );            
        }
        this.map.addLayer(markers); //créé par la fonction createMap et this.map est dans le constructeur
    }
    bookBike(stationNumber) {
        let i = this.searchStation(stationNumber);
        this.allStations[i].available_bikes--;
        this.displayStations();
    }
    unbookBike(stationNumber) {
        let i = this.searchStation(stationNumber);
        this.allStations[i].available_bikes++;
        this.displayStations();
    }
    searchStation(stationNumber) {
        for (let i=0; i<this.allStations.length; i++) {
            if (stationNumber === this.allStations[i].number) {
                return i;
            }
        }
    }
    getStation(stationNumber) {
        for (let i=0; i<this.allStations.length; i++) {
            if (stationNumber === this.allStations[i].number) {
                return this.allStations[i];
            }
        }
    }
    updateOneStation(stationNumber, inc) {
        let theStation = this.allStations[this.searchStation(stationNumber)];
        if (inc === 1) {
            this.allStations[this.searchStation(stationNumber)].available_bikes++;
        }
        else {
            this.allStations[this.searchStation(stationNumber)].available_bikes--;
        }
        this.displayStations();
        window.postMessage(
            {
                origin : "clickedStation",
                station : theStation
            }
        )
        return theStation;
    }
}