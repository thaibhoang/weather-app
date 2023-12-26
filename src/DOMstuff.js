import query from './fetch';

export default function DOMstuff() {
    let currentCity = 'ha noi';
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const forecastDayDiv = document.querySelector('.forecastDay');
    const forecastHourDiv = document.querySelector('.forecastHour');

    function loadToday(infor, tempType = 'c'){
        const d= new Date();
        const currenthour = d . getHours();
        const condition = document.createElement('div');
        const city = document.createElement('div');
        const time = document.createElement('div');
        const temp = document.createElement('div');
        const feel = document.createElement('div');
        const humid = document.createElement('div');
        const wind = document.createElement('div');
        const rain = document.createElement('div');
        condition.textContent = infor.current.condition.text;
        city.textContent = infor.location.name;
        time.textContent = infor.location.localtime;
        temp.textContent = tempType === 'c' ? `${infor.current.temp_c} °C` : `${infor.current.temp_f} °F`;
        feel.textContent = tempType === 'c' ? `Feels Like ${infor.current.feelslike_c} °C` : `Feels Like ${infor.current.feelslike_f} °F`;
        humid.textContent = `Humidity ${infor.current.humidity} %`;
        wind.textContent = `Wind Speed ${infor.current.wind_kph} km/h`;
        rain.textContent = `Chance of rain ${infor.forecast.forecastday[0].hour[currenthour].chance_of_rain}`;
        left.append(condition, city, time, temp);
        right.append(feel, humid, wind, rain);
        left.setAttribute('data-day',0);
        left.classList.add('active');
    }

    
    function forecastDay(infor, tempType = 'c') {
        const dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thusday', 'Friday', 'Saturday']
        function getDay(number) {
            const today = new Date();
            const target = new Date(today.setDate(today.getDate() + number))
            return dayArray[target.getDay()]
        }

        function getInfor(number) {
            const day = getDay(number);
            const {maxtemp_c, maxtemp_f, mintemp_c, mintemp_f, condition: {text}} = infor.forecast.forecastday[number].day;
            return {day, maxtemp_c, maxtemp_f, mintemp_c, mintemp_f, text}
        }

        function boxForDay(number) {            
            const dayInfor = getInfor(number);
            const dayContainer = document.createElement('div');
            const dayDiv = document.createElement('div');
            const maxtempDiv = document.createElement('div');
            const mintempDiv = document.createElement('div');
            const textDiv = document.createElement('div');
            dayDiv.textContent = dayInfor.day;
            maxtempDiv.textContent = tempType === 'c' ? `${dayInfor.maxtemp_c} °C` : `${dayInfor.maxtemp_f} °F`;
            mintempDiv.textContent = tempType === 'c' ? `${dayInfor.mintemp_c} °C` : `${dayInfor.mintemp_f} °F`;
            textDiv.textContent = dayInfor.text;
            dayContainer.append(dayDiv, maxtempDiv, mintempDiv, textDiv);
            dayContainer.setAttribute('data-day',number);
            return dayContainer;
        }

        for (let i = 1; i < infor.forecast.forecastday.length; i++) {
            forecastDayDiv.append(boxForDay(i));
        }
    }

    function forecastHour(infor, number, tempType = 'c') {
        forecastHourDiv.textContent = '';
        function getHourInfor(hour) {
            const {temp_c, temp_f, condition: {text}} = infor.forecast.forecastday[number].hour[hour];
            return {temp_c, temp_f, text};
        }
        function changeHour(hour) {
            return hour < 12 ? `${hour}.am` : `${hour - 12}.pm`
        }
        function boxForHour(hour) {
            const container = document.createElement('div');
            const time = document.createElement('div');
            const temp = document.createElement('div');
            const condition = document.createElement('div');
            container.append(time, temp, condition);
            time.textContent = changeHour(hour);
            const hourInfor = getHourInfor(hour);
            temp.textContent = tempType === 'c' ? `${hourInfor.temp_c} °C` : `${hourInfor.temp_f} °F`;
            condition.textContent = hourInfor.text;
            return container;
        }
        const hourArray = [1,4,7,10,13,16,19,22];
        hourArray.forEach((hour) => {
            forecastHourDiv.append(boxForHour(hour));
        });
    }

    function hourEventListener(infor){
        const allDay = document.querySelectorAll('[data-day]');
        const newAllday = [...allDay];
        
        newAllday.forEach((dayDiv) => {
            dayDiv.addEventListener('click', () => {
                document.querySelectorAll('.active').forEach((div) => {
                    div.classList.remove('active');
                })
                dayDiv.classList.add('active');
                forecastHour(infor, Number(dayDiv.dataset.day), 'c')
            });
        });
    }

    // reset functions when searching for new city
    function reset() {
        left.textContent = '';
        right.textContent = '';
        forecastDayDiv.textContent = '';
        forecastHourDiv.textContent = '';
    }

    async function loadPage(city, tempType) {
        const data = await query(city)
        if (data === undefined) return;
        reset();
        currentCity = city;
        loadToday(data, tempType);
        forecastDay(data, tempType);
        forecastHour(data, 0, tempType);
        hourEventListener(data);     
    }

    function getInputEL() {
        const searchButton = document.querySelector('button');
        const input = document.querySelector('input');
        searchButton.addEventListener('click', () => {
            loadPage(input.value, 'c')  ;
            input.value = '';
        });
        loadPage('ha noi', 'c');
    }


    (function changeTempType() {
        const cButton = document.querySelector('.C');
        cButton.addEventListener('click', () => {
            loadPage(currentCity, 'c')  
        });
        const fButton = document.querySelector('.F');
        fButton.addEventListener('click', () => {
            loadPage(currentCity, 'f')  
        });
    })()
    return {getInputEL}

    
}