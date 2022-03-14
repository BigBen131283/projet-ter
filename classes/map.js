export default class map {
    constructor (selectedCity) {
        this.selectedCity = selectedCity;
        this.mapQuestKey = "4Ou16zkSpxJ8izAZ4MEUjBSLFDskRxu4";
        this.map = this.createMap()
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
        return map        
    }
    setMapPosition(selectedCity){
        this.selectedCity = selectedCity;
        this.map.setView(this.selectedCity.position, 10)            //setView vient de mapQuest
        // this.map.setZoom(10)                                     //idem pour setZoom
    }
}
