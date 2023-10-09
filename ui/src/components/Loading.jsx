import React from "react";

const Loading = ({ full = true }) => {
	return (
		<div
			className={`${
				full ? "h-[100vh]" : "h-[50vh]"
			} w-full grid place-items-center`}
		>
			<div
				className={`border-4 border-t-slate-900 animate-spin border-slate-300 ${
					full ? "w-20 h-20" : "w-10 h-10"
				} rounded-full`}
			></div>
		</div>
	);
};

export default Loading;
