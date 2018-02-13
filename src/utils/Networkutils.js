export default class NetworkUtils {

    constructor(username, password){
        this.headers = {
			'Content-Type': 'application/json',
			'Authorization': 'Basic '+btoa(username + ":" + password)
        }
    }

    prepareParams(szamlak){
        if (Array.isArray(szamlak)){
			return JSON.stringify(szamlak);
        }else{
			return JSON.stringify([szamlak])
		}
    }

    postSzamlak(szamlak){
    	return fetch(window.CONFIG.backend + '/szamlak', {
			method: 'POST',
			headers: this.headers,
			body: this.prepareParams(szamlak)
		})
		.then((response) => {
            if (response.ok){
                return response.json();
			}else{
				throw Error("Szamla generalas nem sikerult: " + response.text());
            }
		});
    }

	generateSzamlaKep(szamlak){
		return fetch(window.CONFIG.backend + '/szamlak/generate', {
			method: 'POST',
			headers: this.headers,
			body: this.prepareParams(szamlak)
		})
		.then((response) => {
			if (response.ok){
				return response.json();
			}else{
				throw Error("Szamla generalas nem sikerult: " + response.text());
			}
		});
	}

}