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
	const [sort, setSort] = useState("sort1");
	var displayCountries;

	function matchCountries() {
		var searchInput = document.getElementById("country-input").value;
		var searchInputPattern = new RegExp(`[${searchInput}]`, "ig");
		var countryName = searchInput ? searchInput : "";
		var breakCountryName = countryName.split("").join(".*");
		var pattern = new RegExp(`${breakCountryName}`, "ig");
		var firstCountryIndex = (page - 1) * 8;
		var lastCountryIndex = page * 8;
		var sortedArray;
		// var sortedArray = countries.sort((x, y) =>
		// 	x.name.common.localeCompare(y.name.common)
		// );
		switch (sort) {
			case "sort1":
				sortedArray = countries.sort((fsEle, sdEle) => {
					var fsElename = fsEle.name.common;
					var sdElename = sdEle.name.common;
					if (fsElename < sdElename) {
						return -1;
					} else if (fsElename > sdElename) {
						return 1;
					}
					return 0;
				});
				break;
			case "sort2":
				sortedArray = countries.sort((fsEle, sdEle) => {
					var fsElename = fsEle.name.common;
					var sdElename = sdEle.name.common;
					if (fsElename < sdElename) {
						return 1;
					} else if (fsElename > sdElename) {
						return -1;
					}
					return 0;
				});
				break;
			case "sort3":
				sortedArray = countries.sort((fsEle, sdEle) => {
					var fsElename = fsEle.population;
					var sdElename = sdEle.population;
					return fsElename - sdElename;
				});
				break;
			case "sort4":
				sortedArray = countries.sort((fsEle, sdEle) => {
					var fsElename = fsEle.population;
					var sdElename = sdEle.population;
					return sdElename - fsElename;
				});
				break;
			default:
				break;
		}
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
		const abortFetch = new AbortController();
		async function getRegion() {
			console.log("fetch started");
			var regionUrl = `https://restcountries.com/v3.1/region/${
				region ? region : "africa"
			}`;
			// var regionUrl = "https://mock.codes/500";
			console.log("region url", regionUrl);
			var regionData = await fetch(regionUrl, {
				signal: abortFetch.signal,
			});
			var data = await regionData.json();

			setRegionLoaded(true);

			console.log("fetching all countries completed");
			setCountries(data);
			setPage(1);
		}

		// effect
		getRegion().catch((err) => {
			if (err.name === "AbortError") {
				console.log("error while fetching region", err, err.name);
			} else {
				console.log(
					"error excpet abort error while fetching region",
					err,
					err.name
				);
				setError(err);
			}
			console.log("error while fetching region", err, err.name);
		});
		console.log("region", region, countries);
		return () => {
			console.log("all countries fetch cleanup");
			abortFetch.abort();
		};
	}, [region]);

	function sortChanged() {
		var sortValue = document.getElementById("sort").value;
		setSort(sortValue);
	}
	useEffect(() => {
		matchCountries();
	}, [sort]);
	function paginate(navPage) {
		window.scroll(0, 0);
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
			<div className="search-filter">
				<div className="country-search">
					<img src="search-icon.svg" alt="" />
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
				<div className="sort">
					<select
						name="sort"
						id="sort"
						defaultValue=""
						onChange={sortChanged}
						aria-label="sort countries"
					>
						<option value="" disabled>
							Defualt Sort
						</option>
						<option value="sort1">Sort by name: A-Z </option>
						<option value="sort2">Sort by name : Z-A</option>
						<option value="sort3">
							Sort by Population: low to high
						</option>
						<option value="sort4">
							Sort by Population: high to low
						</option>
					</select>
				</div>
				<div className="region-filter">
					{/* prettier-ignore */}
					<select name="region" id="region" aria-label="Filter Region" defaultValue="" onChange={changeRegion} >
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
			</div>
			<div className="all-countries">{displayCountries}</div>
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
		</div>
	);
}

export default App;
