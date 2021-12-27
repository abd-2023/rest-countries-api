const Country = ({ country: { name, population, region, capital, flag } }) => {
    
	var singleCountry = (
		<div className="single-country" >
			<img src={flag} alt="country flag" height="150" />
			<h2 className="country-name" dangerouslySetInnerHTML={{__html: name}} ></h2>
			<p className="country-population"> <b> Population: </b>  {population.toLocaleString("en-IN")} </p>
			<p className="country-region" > <b>  Region: </b> {region} </p>
			<p className="country-capital"> <b> Capital: </b> {capital} </p>
		</div>
	);
    
	return singleCountry;
};

export default Country;
