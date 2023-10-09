import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import EditFeedbackForm from "../components/EditFeedbackForm";
import GoBackButton from "../components/GoBackButton";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import Loading from "../components/Loading";

const EditFeedback = () => {
	const { id } = useParams();
	const feedbacks = useSelector(selectFeedbacks);

	if (feedbacks.length === 0) {
		return <Loading />;
	}

	return (
		<section className="max-w-[32rem] mx-auto py-8 pb-16">
			<GoBackButton>
				<HiOutlineChevronLeft />
				Go back
			</GoBackButton>
			<div className=" bg-white relative rounded-2xl mt-12 p-8">
				<span className="bg-gradient-to-br from-blue-500 to-purple-500 text-white grid place-items-center absolute top-[-1rem] left-6 w-10 h-10 rounded-full">
					<HiOutlinePlus className="w-5 h-5" />
				</span>
				<h1 className="pt-6 mb-8 font-semibold text-blue-950">Edit Feedback</h1>
				<EditFeedbackForm id={id} />
			</div>
		</section>
	);
};

export default EditFeedback;
