export default class stations {
    // mais j'aurais pu l'appeler comme dans la classe map
    constructor (cityName) {
        this.cityName = cityName;
        this.urlBase = "https://api.jcdecaux.com/vls/v1/stations?contract=";
        this.apiKey = "47a5805f3a3ea418d8b31f455ea44acde74e4fe8";
        this.url = this.urlBase + this.cityName + "&apiKey=" + this.apiKey;
        this.allStations = [];
    } 

    loadStations() {
        return new Promise ( (resolve, reject) => {
            fetch(this.url)
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                })
                .then((value) => {
                    this.allStations = value;
                    resolve(value)
                })
                .catch((err) => {
                    reject(err);
                })
        })
    }

    getStation() {
        return this.allStations;
    }
}

