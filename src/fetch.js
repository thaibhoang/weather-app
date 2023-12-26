export default async function query(city) {

        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e48064a6845f4418a6e161923232312&q=${city}&days=4&aqi=no&alerts=no`, {mode: 'cors'});
        if (!response.ok) {
            alert('city not found, try to put space between the name');
            response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=e48064a6845f4418a6e161923232312&q=ha+noi&days=4&aqi=no&alerts=no`, {mode: 'cors'});
        }
        const jsonData = await response.json();

        return(jsonData);
        
}
