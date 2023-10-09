import React from "react";
import FeedBack from "./FeedBack";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";
import Button from "./Button";
import { HiOutlinePlus } from "react-icons/hi";

const FeedbacksList = ({ data }) => {
	return (
		<div className="flex flex-col gap-4 p-4 pt-8 pb-16">
			{data.length === 0 ? (
				<div className=" h-[60vh] flex flex-col justify-center items-center gap-y-1 px-8">
					<div className="mb-8">
						<PiMagnifyingGlassDuotone className="w-20 h-20 " />
					</div>
					<h1 className=" font-bold md:text-xl text-blue-950">
						No feedbacks yet
					</h1>
					<p className=" text-slate-600">
						Got a suggestion? Found a bug that needs to be squashed?
					</p>
					<p className=" text-slate-600 mb-4">
						We love hearing about new ideas to improve our app
					</p>
					<Link to="/create-feedback">
						<Button>
							<HiOutlinePlus />
							<span>Add Feedback</span>
						</Button>
					</Link>
				</div>
			) : (
				data.map((req) => <FeedBack key={req.id} data={req} />)
			)}
		</div>
	);
};

export default FeedbacksList;
