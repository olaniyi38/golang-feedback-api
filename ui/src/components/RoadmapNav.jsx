import React from "react";

const RoadmapNav = ({ title, onClick, isActive, count }) => {
	const bg = ["border-b-in-progress", "border-b-live", "border-b-planned"];
	return (
		<>
			<span
				onClick={onClick}
				className={`flex-1 capitalize transition-color cursor-pointer ${
					isActive
						? `border-b-4 border-b-${title} text-blue-950`
						: "border-b border-b-slate-400 text-slate-600"
				}  p-2 py-4`}
			>
				{title}({count})
			</span>
		</>
	);
};

export default RoadmapNav;
