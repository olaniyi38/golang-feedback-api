import React from "react";
import AddFeedbackForm from "../components/AddFeedbackForm";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";

const CreateFeedback = () => {
	return (
		<section className="max-w-[32rem] mx-auto py-8 pb-16">
			<Link
				to="/"
				className="text-sm text-blue-950 font-semibold flex items-center gap-x-2 my-4"
			>
				<HiOutlineChevronLeft />
				<span>Go back</span>
			</Link>
			<div className=" bg-white relative rounded-2xl mt-12 p-8">
				<span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white grid place-items-center absolute top-[-1rem] left-6 w-10 h-10 rounded-full">
					<HiOutlinePlus className="w-5 h-5" />
				</span>
				<h1 className="pt-6 mb-8 font-semibold text-blue-950">Create New Feedback</h1>
				<AddFeedbackForm />
			</div>
		</section>
	);
};

export default CreateFeedback;
