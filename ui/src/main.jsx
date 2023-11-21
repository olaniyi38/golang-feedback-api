import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import Providers from "./features/Providers";

import 'react-loading-skeleton/dist/skeleton.css'
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<Providers>
		<App />
	</Providers>
);
