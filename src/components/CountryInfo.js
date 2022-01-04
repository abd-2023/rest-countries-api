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
	const [borders, setBorders] = useState([]);

	var countryFetchURL = `https://restcountries.com/v3.1/name/${param.countryName}?fullText=true`;
	console.log("countryFetchURL", countryFetchURL);

	useEffect(() => {
		const abortFetch = new AbortController();
		async function getCountry() {
			console.log("fetching country started");
			// countryFetchURL = "https://mock.codes/500";

			var countryRes = await fetch(countryFetchURL, {
				signal: abortFetch.signal,
			});
			var countryData = await countryRes.json();
			var allBorders = countryData[0].borders;
			var allBordersNames = [];
			console.log("countryData", countryData);
			if (countryData[0].borders) {
				console.log("all borders", allBorders, countryData[0]);
				for (let i = 0; i < allBorders.length; i++) {
					if (i === 3) {
						break;
					}
					var countryCode = allBorders[i];
					var bordersRes = await fetch(
						`https://restcountries.com/v3.1/alpha/${countryCode}`,
						{ signal: abortFetch.signal }
					);
					var bordersData = await bordersRes.json();
					console.log(
						"bordersData",
						bordersData,
						bordersData[0].name.common
					);
					allBordersNames.push(bordersData[0].name.common);
				}

				console.log("allBordersNames", allBordersNames);
				// setBorders(allBordersNames);
				console.log("setBorders", setBorders(allBordersNames));
				// getBorder(countryData[0])

				// .catch((err) => {
				// 	console.log("error while fetching border countries", err);
				// 	setError(err);
				// });
			}
			console.log("fetching country completed");
			setCountry(countryData[0]);
			setCountryLoaded(true);
			return Promise.all([countryRes, bordersRes]);
		}

		getCountry().catch((err) => {
			if (err.name === "AbortError") {
				console.log("fetch aborted while fetching single country");
			} else {
				setError(err);
				console.log("error while fetching country", err, err.name);
			}
		});
		return () => {
			console.log("country fetch cleanup");
			abortFetch.abort();
		};
	}, [param.countryName]);

	var displayCountry;
	if (error) {
		// console.log("error", error);
		displayCountry = <div> {error.message} </div>;
	} else if (!countryLoaded) {
		displayCountry = <div> Loading... </div>;
	} else {
		console.log("country name", country.name);
		displayCountry = (
			<main>
				<div className="country-info">
					<Link to="/" className="back-home">
						Back
					</Link>
					<div className="desktop-counry-layout">
						<img
							src={country.flags.svg}
							width="300"
							alt={`Flag of ${country.name.common}`}
							className="country-flag"
						/>
						<div className="desktop-country-meta">
							<h2 className="country-name">
								{" "}
								{country.name.common}{" "}
							</h2>
							{/* prettier-ignore */}
							<div className="desktop-country-info">
							<div>
								<p> <b> Native name:</b> {Object.values(country.name.nativeName)[0].common} </p>
								{/* prettier-ignore */}
								<p> <b> Population:</b> {country.population.toLocaleString( "en-IN" )}</p>
								<p><b> Region: </b>{country.region}</p>
								<p><b> Sub Region:</b> {country.subregion}</p>
								{/* prettier-ignore */}
								<p> <b> Capital: </b>{country.capital ? country.capital.join(", ") : "No Capital"} </p>
							</div>
							<div>
								<p><b> Top Level Domain:</b> {country.tld.join(", ")}</p>
								<p><b> Currencies:</b>{Object.keys(country.currencies)}</p>
								<p><b> Languages: </b>{Object.values(country.languages).join(", ")}</p>
							</div>
						</div>

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
						</div>
					</div>
					{/* prettier-ignore */}
					<iframe src={mapURL} width="310" height="200" style={{ border: "none" }} ></iframe>
				</div>
			</main>
		);
	}
	return displayCountry;
};

export default CountryInfo;
