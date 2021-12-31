import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import CountryInfo from "./components/CountryInfo";
import Header from "./components/Header";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/country/:countryName" element={<CountryInfo />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
