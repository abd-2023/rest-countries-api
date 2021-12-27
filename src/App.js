import "./App.scss";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Country from "./components/Country";
import uuid from "react-uuid";

function App() {
	const [region, setRegion] = useState("africa");
	const [error, setError] = useState(null);
	const [regionLoaded, setRegionLoaded] = useState(false);
	const [countries, setCountries] = useState([]);
	const [matchedCountries, setMatchedCountries] = useState([]);
	const [page, setPage] = useState(1);
	var totalPages = Math.ceil(countries.length / 8);
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
	}

	function matchCountries() {
		var searchInput = document.getElementById("country-input").value;
		var searchInputPattern = new RegExp(`[${searchInput}]`, "ig");
		var countryName = searchInput ? searchInput : "";
		var breakCountryName = countryName.split("").join(".*");
		var pattern = new RegExp(`${breakCountryName}`, "ig");
		var firstCountryIndex = (page - 1) * 8;
		var lastCountryIndex = page * 8;
		var countriesPerPage = countries.slice(
			firstCountryIndex,
			lastCountryIndex
		);

		console.log(
			"firstCountryIndex",
			firstCountryIndex,
			"lastCountryIndex",
			lastCountryIndex,
			"countriesPerPage",
			countriesPerPage
		);
		console.log(
			"breakCountryName",
			breakCountryName,
			"pattern",
			pattern,
			"searchInputPattern",
			searchInputPattern
		);

		var matchedCountry = countriesPerPage.reduce((newCountries, country) => {
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
					orignal_name: country.name.common,
				};
				newCountries.push(newCountry);
				// console.log("country matched", country)
				// return country;
			}
			return newCountries;
		}, []);

		setMatchedCountries(matchedCountry);
	}

	useEffect(() => {
		// if(page)
		matchCountries();
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
		setPage(1);
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

	useEffect(()=>{
		if(regionLoaded){
			matchCountries();
		}
	}, [page])

	if (error) {
		console.log("error", error);
		displayCountries = <div> {error.message} </div>;
	} else if (!regionLoaded) {
		displayCountries = <div> Loading... </div>;
	} else {
		displayCountries = matchedCountries.length
			? matchedCountries.map((country) => (
					<Country country={country} key={uuid()} />
			  ))
			: "No Country Found";
		// displayCountries = displayCountries.length ? displayCountries: <div> No countries Matched </div>;
	}

	return (
		<div className="App">
			<Header />
			<main>
				<div className="country-search">
					<input
						id="country-input"
						className="country"
						aria-label="Search for a country"
						type="text"
						name="country"
						placeholder="Search for a country"
						// onKeyDown={cutPasteSearch}
						onChange={matchCountries}
					/>
				</div>
				<div>
					<select
						name="region"
						id="region"
						defaultValue=""
						onChange={changeRegion}
					>
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
