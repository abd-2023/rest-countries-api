import "./App.scss";
import { useState, useEffect } from "react";
import Country from "./components/Country";
import uuid from "react-uuid";

function App() {
	const [region, setRegion] = useState("africa");
	const [error, setError] = useState(null);
	const [regionLoaded, setRegionLoaded] = useState(false);
	const [countries, setCountries] = useState([]);
	const [matchedCountries, setMatchedCountries] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	var displayCountries;

	async function getRegion() {
		console.log("fetch started");
		var regionUrl = `https://restcountries.com/v3.1/region/${
			region ? region : "africa"
		}`;
		// var regionUrl = "https://mock.codes/500";
		console.log("region url", regionUrl);
		var regionData = await fetch(regionUrl);
		var data = await regionData.json();

		setRegionLoaded(true);

		console.log("fetch completed");
		setCountries(data);
		setPage(1);
	}

	function matchCountries() {
		var searchInput = document.getElementById("country-input").value;
		var searchInputPattern = new RegExp(`[${searchInput}]`, "ig");
		var countryName = searchInput ? searchInput : "";
		var breakCountryName = countryName.split("").join(".*");
		var pattern = new RegExp(`${breakCountryName}`, "ig");
		var firstCountryIndex = (page - 1) * 8;
		var lastCountryIndex = page * 8;
		var sortedArray = countries.sort((x, y) =>
			x.name.common.localeCompare(y.name.common)
		);
		console.log("sort countries", sortedArray);

		var matchedCountry = countries.reduce((newCountries, country) => {
			// console.log("country name", country.name);
			if (country.name.common.match(pattern)) {
				let newCountry = {
					name: country.name.common.replace(
						searchInputPattern,
						`<span style="color:red;">$&</span>`
					),
					flag: country.flags.svg,
					population: country.population,
					region: country.region,
					capital: country.capital
						? country.capital.join(", ")
						: "No Capital",
					original_name: country.name.common,
				};
				newCountries.push(newCountry);
				// console.log("country matched", country)
				// return country;
			}
			return newCountries;
		}, []);

		// setAllMatchedCountries(matchedCountry);

		var countriesPerPage = matchedCountry.slice(
			firstCountryIndex,
			lastCountryIndex
		);

		// prettier-ignore
		console.log( "firstCountryIndex", firstCountryIndex, "lastCountryIndex", lastCountryIndex, "countriesPerPage", countriesPerPage );
		// prettier-ignore
		console.log( "breakCountryName", breakCountryName, "pattern", pattern, "searchInputPattern", searchInputPattern );

		setMatchedCountries(
			countriesPerPage.length ? countriesPerPage : "No Country Found"
		);
		return matchedCountry;
		// setMatchedCountries(matchedCountry);
	}

	function searchCountry() {
		var matchedCountry = matchCountries();
		setPage(1);
		// setTotalPages(Math.ceil(matchedCountry.length / 8));
		var totalSearchPages = Math.ceil(matchedCountry.length / 8);
		setTotalPages(totalSearchPages > 0 ? totalSearchPages : 1);
	}
	// useEffect(() => {

	// }, [allMatchedCountries])

	useEffect(() => {
		if (regionLoaded) {
			var matchedCountry = matchCountries();
			var totalSearchPages = Math.ceil(matchedCountry.length / 8);
			setTotalPages(totalSearchPages > 0 ? totalSearchPages : 1);
			// setTotalPages(Math.ceil(matchedCountry.length / 8));
		}
		console.log("totalPages", totalPages);
	}, [countries]);

	function changeRegion() {
		var selectedRegion = document.getElementById("region").value;
		console.log("selectedRegion", selectedRegion);
		setRegion(selectedRegion);
	}

	useEffect(() => {
		// effect
		getRegion().catch((err) => {
			setError(err);
			console.log("error while fetching region", err);
		});
		console.log("region", region, countries);
		// return () => {
		// 	// cleanup
		// }
	}, [region]);

	function paginate(navPage) {
		if (navPage === "next-page") {
			setPage(page + 1);
		} else if (navPage === "prev-page") {
			setPage(page - 1);
		}
		console.log("navPage", navPage);
	}

	useEffect(() => {
		if (regionLoaded) {
			matchCountries();
		}
	}, [page]);

	if (error) {
		console.log("error", error);
		displayCountries = <div> {error.message} </div>;
	} else if (!regionLoaded) {
		displayCountries = <div> Loading... </div>;
	} else {
		displayCountries = Array.isArray(matchedCountries)
			? matchedCountries.map((country) => (
					<Country country={country} key={uuid()} />
			  ))
			: matchedCountries;
	}

	return (
		<div className="App">
			<main>
				<div className="country-search">
					<input
						id="country-input"
						className="country"
						aria-label="Search for a country"
						type="text"
						name="country"
						placeholder="Search for a country"
						onChange={searchCountry}
					/>
				</div>
				<div>
					{/* prettier-ignore */}
					<select name="region" id="region" defaultValue="" onChange={changeRegion} >
						<option disabled value="">
							Filter by Region
						</option>
						<option value="africa">Africa</option>
						<option value="america">America</option>
						<option value="asia">Asia</option>
						<option value="europe">Europe</option>
						<option value="oceania">Oceania</option>
					</select>
				</div>
				<div>{displayCountries}</div>
				<div className="pagination">
					{page == 1 ? (
						""
					) : (
						<button
							onClick={() => paginate("prev-page")}
							className="prev"
						>
							prev
						</button>
					)}
					{page == totalPages ? (
						""
					) : (
						<button
							onClick={() => paginate("next-page")}
							className="next"
						>
							next
						</button>
					)}
				</div>
			</main>
		</div>
	);
}

export default App;
