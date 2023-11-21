import React from "react";
import { useSelector } from "react-redux";
import { selectStatus } from "../features/feedbacks/feedbackSelector";
//bg-purple-800
//bg-blue-600
//bg-red-600

export const BTN_VARS = {
	purple: "bg-purple-700",
	blue: "bg-blue-600",
	red: "bg-red-600",
};

const Button = ({ children, onClick, variant = "purple", full, ...otherProps }) => {
	const status = useSelector((state) => state.currentUser.status);
	return (
		<button
			onClick={onClick}
			disabled={status === "pending"}
			className={`flex items-center ${full && "w-full"
				} text-sm disabled:bg-gray-400 text-white font-bold capitalize gap-1 ${BTN_VARS[variant]
				} hover:bg-${variant}-700 active:scale-[.95] transition-all rounded-md py-2 px-4`}
			{...otherProps}
		>
			{children}
		</button>
	);
};

export default Button;
