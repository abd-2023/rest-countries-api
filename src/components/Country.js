const Country = ({ country: { name, population, region, capital, flag } }) => {
    
	var singleCountry = (
		<div className="single-country" >
			<img src={flag} alt="country flag" width="250" />
			<h2 className="country-name" dangerouslySetInnerHTML={{__html: name}} ></h2>
			<p className="country-population"> Population: {population.toLocaleString("en-IN")} </p>
			<p className="country-region" > Region: {region} </p>
			<p className="country-capital"> Capital: {capital} </p>
		</div>
	);
    
	return singleCountry;
};

export default Country;
