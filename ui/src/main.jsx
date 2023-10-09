import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Providers from "./features/Providers";

ReactDOM.createRoot(document.getElementById("root")).render(
	<Providers>
		<App />
	</Providers>
);
