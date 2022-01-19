import { Link } from "react-router-dom";

const Country = ({
	country: { name, population, region, capital, flag, original_name },
}) => {
	var nameURIEndPoint = encodeURIComponent(original_name.toLowerCase());
	var countryName = original_name.toLowerCase().split(" ")[0];
	console.log("countryName", countryName);
	var singleCountry = (
		// prettier-ignore
		<Link to={"country/" + nameURIEndPoint} className="single-country" aria-labelledby={`country-name-${countryName}`} aria-describedby={`country-meta-${countryName}`}>
			{/* <Link to="/invoices" className="single"> Abd </Link> */}
			<img src={flag} alt={"Flag of " + original_name} className="country-flag"/>
			<div className="country-details">
				<h2
					className="country-name"
					id={`country-name-${countryName}`}
					dangerouslySetInnerHTML={{ __html: name }}
				></h2>
				<div id={`country-meta-${countryName}`}>
					<p className="country-population">
						<b> Population: </b> {population.toLocaleString("en-IN")}
					</p>
					<p className="country-region">
						<b> Region: </b> {region}
					</p>
					<p className="country-capital">
						<b> Capital: </b> {capital}
					</p>
				</div>
			</div>
		</Link>);

	return singleCountry;
};

export default Country;
