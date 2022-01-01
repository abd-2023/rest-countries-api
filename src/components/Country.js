import { Link } from "react-router-dom";

const Country = ({
	country: { name, population, region, capital, flag, original_name },
}) => {
	var nameURIEndPoint = encodeURIComponent(original_name.toLowerCase());

	var singleCountry =
		// prettier-ignore
		<Link to={"country/" + nameURIEndPoint} className="single-country" aria-labelledby="country-name" aria-describedby="country-meta">
			{/* <Link to="/invoices" className="single"> Abd </Link> */}
			<img src={flag} alt={"Flag of " + name} className="country-flag" loading="lazy" onLoad={console.log(`${name} flag loaded`)}/>
			<div className="country-details">
				<h2
					className="country-name"
					id="country-name"
					dangerouslySetInnerHTML={{ __html: name }}
				></h2>
				<div id="country-meta">
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
		</Link>;

	return singleCountry;
};

export default Country;
