import stations from "./stations.js"

export default class map {
    constructor (selectedCity) {
        this.selectedCity = selectedCity;
        this.mapQuestKey = "4Ou16zkSpxJ8izAZ4MEUjBSLFDskRxu4";
        this.map = this.createMap();
        this.stations = {};
        this.allStations = [];
    }
    getName() {
        console.log(this.name);
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
        this.map.setView(this.selectedCity.position, 10)            //setView vient de mapQuest
        this.stations = new stations(this.selectedCity.name);
        this.loadStations();
    }

    loadStations() {
        this.stations.loadStations()
            .then((resp) => {
                this.allStations = resp;
                this.displayStations();
            })
            .catch((err) => {
                console.log("Erreur affichage")
            })
    }

    displayStations() {
        console.log(this.stations.getStation().length)
    }
}
