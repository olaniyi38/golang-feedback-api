import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSelector";
import { Navigate } from "react-router-dom";

const Protected = ({ children }) => {
	const user = useSelector(selectUser);
	if (user === null) {
		return <Navigate to="/auth/sign-in" />;
	}
	return <>{children}</>;
};

export default Protected;
