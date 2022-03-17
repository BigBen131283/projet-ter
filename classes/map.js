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
        // console.log(this.stations.getStation().length)
        let viewableStations = this.allStations;
        let i=0
        let markers = L.markerClusterGroup();
        for (i=0; i<viewableStations.length; i++) {
            let secondaryColor = this.#secondaryColor;
            if (viewableStations[i].available_bikes === 0) {
                secondaryColor = this.#nobikeColor;
            }
            markers.addLayer(L.marker([viewableStations[i].position.lat, viewableStations[i].position.lng], 
                                    {
                                        title : viewableStations[i].number, 
                                        draggable : false,
                                        clickable : true,
                                        icon : L.mapquest.icons.circle (
                                        {
                                            primaryColor: this.#primaryColor,       // Outer circle line ?
                                            secondaryColor: secondaryColor,   // Circle color ?
                                            shadow: true,
                                            symbol: viewableStations[i].available_bikes
                                        })
                                    }
                ).on('click', (e) => {
                    for (let i=0; i<viewableStations.length; i++) {
                        if (viewableStations[i].number === e.sourceTarget.options.title) {
                            console.log(viewableStations[i])
                            window.postMessage(
                                {
                                    origin : "clickedStation",
                                    station : viewableStations[i]
                                }
                            )
                        }
                    }
                })
            );            
        }
        this.map.addLayer(markers); //créé par la fonction createMap et this.map est dans le constructeur
    }
}