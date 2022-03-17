import stations from "./stations.js"

export default class map {
    constructor (selectedCity) {
        this.selectedCity = selectedCity;
        this.mapQuestKey = "4Ou16zkSpxJ8izAZ4MEUjBSLFDskRxu4";
        this.map = this.createMap();
        this.stations = {};
        this.allStations = [];
        this.latLngBounds = [];
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
        map.on('click', this.click, this);               // Take some action on click
        map.on('zoomanim',this.zoomLevelChange, this);   // Handle zoom change
        map.on('moveend', this.move, this);              // Handle dragging map
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
                console.log(resp);
                this.displayStations();
            })
            .catch((err) => {
                console.log("Erreur affichage")
            })
    }

    displayStations() {
        let viewableStations = this.allStations;
        console.log(viewableStations)
        let i=0
        for (i=0; i<viewableStations.length; i++) {
            let stationMarker = L.marker([viewableStations[i].position.lat, viewableStations[i].position.lng]);
            stationMarker.addTo(this.map); //créé par la fonction createMap et this.map est dans le constructeur
        }
    }

    #countEligibleStations(allStations) {
        let stationsDisplayed = [];
        const latSouth = this.latLngBounds._southWest.lat;
        const latNorth = this.latLngBounds._northEast.lat;
        const longEast = this.latLngBounds._northEast.lng;
        const longWest = this.latLngBounds._southWest.lng;
        let i=0;
        for (i=0; i<allStations.length; i++) {
            if(allStations[i].position.lat > latSouth
                && allStations[i].position.lat < latNorth
                && allStations[i].position.lng > longWest
                && allStations[i].position.lng < longEast) {
                  stationsDisplayed.push(allStations[i]);
                }
        }
        return stationsDisplayed;
    }

    click(event) {
        console.log(event.latlng) // voir mapquest
    }

    move(event) {
        console.log(this.map.getBounds())  // getBounds cf mapquest
        this.latLngBounds = this.map.getBounds(); 
        this.displayStations();
    }

    zoomLevelChange(event) {
        console.log(event.zoom)
        this.latLngBounds = this.map.getBounds(); 
        this.displayStations();
    }
}
