import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import uuid from "react-uuid";

const CountryInfo = () => {
	var param = useParams();
	var mapURL =
		"https://maps.google.com/maps?width=1500&height=1500&hl=en&q=" +
		param.countryName +
		"&z=9&ie=UTF8&iwloc=B&output=embed";
	const [error, setError] = useState(null);
	const [countryLoaded, setCountryLoaded] = useState(false);
	const [country, setCountry] = useState({});
	const [bordersLoaded, setBordersLoaded] = useState(false);
	const [borders, setBorders] = useState([]);

	var countryFetchURL = `https://restcountries.com/v3.1/name/${param.countryName}?fullText=true`;
	console.log("countryFetchURL", countryFetchURL);

	async function getBorder(countryData) {
		var allBorders = countryData.borders;
		console.log("all borders", allBorders, countryData);
		var allBordersNames = [];
		for (let i = 0; i < allBorders.length; i++) {
			if (i === 3) {
				break;
			}
			let countryCode = allBorders[i];
			var res = await fetch(
				`https://restcountries.com/v3.1/alpha/${countryCode}`
			);
			var bordersData = await res.json();
			console.log("bordersData", bordersData, bordersData[0].name.common);
			allBordersNames.push(bordersData[0].name.common);
		}

		console.log("allBordersNames", allBordersNames);
		// setBorders(allBordersNames);
		console.log("setBorders", setBorders(allBordersNames));
		// setBorders([...allBordersNames]);
		setBordersLoaded(true);
	}

	async function getCountry() {
		console.log("fetching country started");
		// countryFetchURL = "https://mock.codes/500";

		var res = await fetch(countryFetchURL);
		var countryData = await res.json();
		console.log("countryData", countryData);
		if (countryData[0].borders) {
			getBorder(countryData[0]).catch((err) => {
				setError(err);
				console.log("error while fetching border country", err);
			});
		}
		console.log("fetching country completed");
		setCountry(countryData[0]);
		setCountryLoaded(true);
	}

	useEffect(() => {
		getCountry().catch((err) => {
			setError(err);
			console.log("error while fetching country", err);
		});
		// effect
		// return () => {
		// 	cleanup
		// }
	}, [param.countryName]);

	var displayCountry;
	if (error) {
		// console.log("error", error);
		displayCountry = <div> {error.message} </div>;
	} else if (!countryLoaded && !bordersLoaded) {
		displayCountry = <div> Loading... </div>;
	} else {
		console.log("country name", country.name);
		displayCountry = (
			<div className="country-info">
				<Link to="/" className="back-home">Back</Link>
				<img
					src={country.flags.svg}
					width="300"
					alt={`Flag of ${country.name.common}`}
					className="country-flag"
				/>
				<h2 className="country-name"> {country.name.common} </h2>
				{/* prettier-ignore */}
				<p> <b> Native name:</b> {Object.values(country.name.nativeName)[0].common} </p>
				{/* prettier-ignore */}
				<p> <b> Population:</b> {country.population.toLocaleString( "en-IN" )}</p>
				<p> <b> Region: </b>{country.region} </p>
				<p> <b> Sub Region:</b> {country.subregion} </p>
				{/* prettier-ignore */}
				<p> <b> Capital: </b>{country.capital ? country.capital.join(", ") : "No Capital"} </p>
				<p> <b> Top Level Domain:</b> {country.tld.join(", ")} </p>
				<p> <b> Currencies:</b> {Object.keys(country.currencies)} </p>
				<p><b> Languages: </b>{Object.values(country.languages).join(", ")}</p>

				{borders.length ? <h3>Border Countries</h3> : ""}
				{borders.map((borderCountry) => (
					<Link
						to={`/country/${encodeURIComponent(
							borderCountry.toLowerCase()
						)}`}
						key={uuid()}
						className="border-country"
						onClick={window.scroll(0, 0)}
					>
						{borderCountry}
					</Link>
				))}

				{/* prettier-ignore */}
				<iframe src={mapURL} width="310" height="200" style={{ border: "none" }} ></iframe>
			</div>
		);
	}
	return displayCountry;
};

export default CountryInfo;
