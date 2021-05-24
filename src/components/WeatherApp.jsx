import React, { useState, useEffect } from "react";
import "../css/style.css";
import {
	MdKeyboardArrowRight,
	MdNavigation,
	MdGpsFixed,
	MdLocationOn,
	MdClose,
} from "react-icons/md";

const WeatherApp = () => {
	const [locations, setLocations] = useState([]);
	const [title, setTitle] = useState([]);
	const [city, setCity] = useState("");
	const [ready, setReady] = useState(false);
	const [today, setToday] = useState([]);
	const [weatherAfter, setWeatherAfter] = useState([]);
	const [varTemp, setVarTemp] = useState(false);

	useEffect(() => {
		currentLocation()
	}, [])

	const getCountries = async (e) => {
		e.preventDefault();
		setCity(city);
		await fetch(
			`https://intense-hollows-87072.herokuapp.com/https://www.metaweather.com/api/location/search/?query=${city}`
		)
			.then((response) => response.json())
			.then((data) => setLocations(data))
			.catch((e) => console.log(e));
	};

	const setPlaces = async (item) => {
		const { woeid } = item;
		await fetch(
			`https://intense-hollows-87072.herokuapp.com/https://www.metaweather.com/api/location/${woeid}/`
		)
			.then((response) => response.json())
			.then((data) => {
				const hoy = data.consolidated_weather.filter(
					(item, index) => index === 0
				);
				const future = data.consolidated_weather.slice(1, 6);
				setTitle(data);
				setToday(hoy);
				setWeatherAfter(future);
				setReady(true);
			})
			.catch((e) => console.log(e));
	};
	const date = (dat) => {
		var event = new Date(dat);
		var date_val = event.toDateString().split(" ");
		const localDate = date_val[0] + ", " + date_val[2] + " " + date_val[1];
		return localDate;
	};

	const fahrenheit = (temp) => {
		if (varTemp === true) {
			const fahren = (temp * 9) / 5 + 32;
			return Math.floor(fahren);
		} else {
			return Math.floor(temp);
		}
	};
	const currentLocation = async () => {
		var userIp = 0
		var lattLong = 1
		if(userIp !== 0){
			return;
		}
		await fetch('https://intense-hollows-87072.herokuapp.com/http://api.hostip.info/')
		.then(response => {
         return response.text();
    }).then(xml => { 
        return (new window.DOMParser()).parseFromString(xml, "text/xml");
    }).then(xmlDoc => {
        const user = xmlDoc.querySelector("ip");
        userIp = user.innerHTML
    });
    	await fetch(`https://intense-hollows-87072.herokuapp.com/http://www.geoplugin.net/json.gp?ip=${userIp}`)
    	.then(response => response.json())
    	.then(data => {
    		const lat = data.geoplugin_latitude
    		const long = data.geoplugin_longitude 
    		lattLong = lat+","+long
    	})
		await fetch(
			`https://intense-hollows-87072.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong=${lattLong}`)
		 	.then((response) => response.json())
			.then((data) => {
				const userCountry = data[0]
				setPlaces(userCountry)
			})
			.catch((e) => console.log(e));	
	}
	return (
		<div className="container">
			{ready === true ? (
				<div className="search-column">
					<div className="search-back">
						<button onClick={() => setReady(false)} className="btn-search-back">
							Search for places
						</button>
						<span className="icon-bg">
							<MdGpsFixed
								onClick={() => currentLocation()}
								className="gps-icon"
							/>
						</span>
					</div>
					{today.length !== 0 ? (
						today.map((item) => (
							<div key={item.id}>
								<div className="bg-imgToday">
									<img
										className="today-weather"
										src={`https://www.metaweather.com/static/img/weather/png/${item.weather_state_abbr}.png`}
										alt=""
									/>
								</div>
								<div className="today-temp">
									<div className="the-temp">
										<p>
											{fahrenheit(item.the_temp)}
											<span>{varTemp === false ? "°C" : "°F"}</span>
										</p>
									</div>
									<h4>{item.weather_state_name}</h4>
									<div className="today-date">
										<p>Today • {date(item.applicable_date)}</p>
									</div>
									<div className="title-name">
										<MdLocationOn /> {title.title}
									</div>
								</div>
							</div>
						))
					) : (
						<span></span>
					)}
				</div>
			) : (
				<div className="search-column">
					<div>
						<MdClose onClick={() => setReady(true)} className="close-icon" />
					</div>
					<form onSubmit={getCountries}>
						<input
							onChange={(e) => setCity(e.target.value)}
							className="input-locations"
							placeholder="&#xe8b6;   search location"
							type="text"
						/>
						<button className="btn-search" type="submit">
							Search
						</button>
					</form>
					<ul className="locations">
						{locations.map((item) => (
							<li className="locations-list" key={item.woeid}>
								<button
									onClick={() => {
										setPlaces(item);
									}}
									className="search-city"
								>
									{locations.length === 0 ? (
										<p>
											No se han encontrado resultados
											{console.log("length de 0")}
										</p>
									) : (
										item.title
									)}
									<MdKeyboardArrowRight />
								</button>
							</li>
						))}
					</ul>
				</div>
			)}
			<div className="result-column">
				<div className="btn-temp">
					<button
						className="grados active"
						id="btnCelsius"
						onClick={() => {
							setVarTemp(false);
							document.getElementById("btnCelsius").classList.add("active");
							document
								.getElementById("btnFahrenheit")
								.classList.remove("active");
						}}
					>
						°C
					</button>
					<button
						className="grados"
						id="btnFahrenheit"
						onClick={() => {
							setVarTemp(true);
							document.getElementById("btnCelsius").classList.remove("active");
							document.getElementById("btnFahrenheit").classList.add("active");
						}}
					>
						°F
					</button>
				</div>
				<div className="container-result">
					{weatherAfter.length !== 0 ? (
						weatherAfter.map((item) => (
							<div key={item.id} className="cardxDay">
								<p className="weatherDate">{date(item.applicable_date)}</p>
								<img
									src={`https://www.metaweather.com/static/img/weather/png/${item.weather_state_abbr}.png`}
									alt=""
								/>
								<p className="temps">
									<span>
										{fahrenheit(item.max_temp)}
										{varTemp === false ? "°C" : "°F"}
									</span>
									<span>
										{fahrenheit(item.min_temp)}
										{varTemp === false ? "°C" : "°F"}
									</span>
								</p>
							</div>
						))
					) : (
						<span></span>
					)}
				</div>
				<div className="titleOfDay">
					<p>Today’s Hightlights</p>
				</div>
				{today.length !== 0 ? (
					today.map((item) => (
						<div key={item.id} className="container-infoToday">
							<div className="info wind">
								<p className="titleInfo">Wind status</p>
								<p className="infoData">
									{Math.floor(item.wind_speed)}
									<span className="medidor"> mph</span>
								</p>
								<div className="description">
									<MdNavigation
										style={{ transform: `rotate(${item.wind_direction}deg)` }}
									/>

									<span> {item.wind_direction_compass}</span>
								</div>
							</div>
							<div className="info humidity">
								<p className="titleInfo">Humidity</p>
								<p className="infoData">
									{item.humidity}
									<span className="medidor"> %</span>
								</p>
								<div className="description d2">
									<div className="percent-num">
										<span>0</span>
										<span>50</span>
										<span>100</span>
									</div>
									<div className="barHumidity-white">
										<div
											style={{ width: `${item.humidity}%` }}
											className="barHumidity-yellow"
										></div>
									</div>
									<span className="percent-percent">%</span>
								</div>
							</div>
							<div className="info visibility">
								<p className="titleInfo">Visibility</p>
								<p className="infoData">
									{Math.floor(item.visibility)}
									<span className="medidor"> milles</span>
								</p>
							</div>
							<div className="info air">
								<p className="titleInfo">Air pressure</p>
								<p className="infoData">
									{item.air_pressure} <span className="medidor">mb</span>
								</p>
							</div>
						</div>
					))
				) : (
					<div className="container-infoToday">
						<div className="info wind">
							<p className="titleInfo">Wind status</p>
							<p className="infoData">
								<span className="medidor"> mph</span>
							</p>
							<div className="description">
								<MdNavigation />

								<span></span>
							</div>
						</div>
						<div className="info humidity">
							<p className="titleInfo">Humidity</p>
							<p className="infoData">
								<span className="medidor"> %</span>
							</p>
							<div className="description d2">
								<div className="percent-num">
									<span>0</span>
									<span>50</span>
									<span>100</span>
								</div>
								<div className="barHumidity-white">
									<div className="barHumidity-yellow"></div>
								</div>
								<span className="percent-percent">%</span>
							</div>
						</div>
						<div className="info visibility">
							<p className="titleInfo">Visibility</p>
							<p className="infoData">
								<span className="medidor"> milles</span>
							</p>
						</div>
						<div className="info air">
							<p className="titleInfo">Air pressure</p>
							<p className="infoData">
								<span className="medidor">mb</span>
							</p>
						</div>
					</div>
				)}
				<div className="create mt-5 text-center montse mb-3">
					created by <span>Contreras Nicolás</span> - devChallenges.io
				</div>
			</div>
		</div>
	);
};

export default WeatherApp;
