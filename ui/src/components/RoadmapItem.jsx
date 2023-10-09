import { FaChevronUp, FaComment } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectLikes } from "../features/user/userSelector";
import { likeFeedback } from "../features/feedbacks/feedbacksSlice";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import { useState } from "react";
import Loading from "./Loading";

const borderColor = {
	"in-progress": "border-t-in-progress",
	live: "border-t-live",
	planned: "border-t-planned",
};

const RoadmapItem = ({ data }) => {
	const { title, description, upvotes, category, comments, id, status } = data;
	const bgColors = ["bg-in-progress", "bg-planned", "bg-live"];
	const dispatch = useDispatch();
	const feedbacks = useSelector(selectFeedbacks);
	const [isDisabled, setIsDisabled] = useState(false);
	const user = useSelector((state) => state.feedbacks.user);
	const username = user.username;
	const likes = user.likes;
	const isLiked = id in likes;

	async function likeAFeedback(id) {
		setIsDisabled(true);
		const feedbackId = id;
		const feedbackIndex = feedbacks.findIndex((f) => f.id === feedbackId);
		let newLikes = { ...likes };
		let newFeedback = {
			...feedbacks[feedbackIndex],
		};
		if (!isLiked) {
			newLikes[feedbackId] = {};
			newFeedback.upvotes++;
			await dispatch(likeFeedback({ newFeedback, newLikes, username }))
				.unwrap()
				.then(() => setIsDisabled(false));
			return;
		}
		newFeedback.upvotes--;
		delete newLikes[feedbackId];
		await dispatch(likeFeedback({ newFeedback, newLikes, username }))
			.unwrap()
			.then(() => setIsDisabled(false));
	}


	return (
		<div
			className={` bg-white border-t-[.4rem] ${borderColor[status]} relative flex flex-col gap-4 rounded-md p-6`}
		>
			<div className="space-y-4 ">
				<div className="text-sm  text-slate-600 flex items-center gap-x-2 mb-3">
					<span className={`w-2 h-2 bg-${status} rounded-full`}></span>
					<span>{status}</span>
				</div>
				<Link
					to={`/feedback/${id}`}
					className=" text-blue-950 hover:underline transition font-bold text-sm "
				>
					{title}
				</Link>
				<p className=" text-slate-700 text-[0.8rem]   pr-4">{description}</p>
				<div className=" bg-blue-50 text-blue-600 font-semibold text-xs w-[fit-content] p-2 rounded-md capitalize">
					{category}
				</div>
			</div>
			<div className="flex justify-between font-semibold text-blue-950 ">
				<button
					disabled={isDisabled}
					onClick={() => likeAFeedback(id)}
					className={`flex self-start text-sm group  disabled:bg-slate-300 group disabled:text-slate-500 items-center gap-2 p-2 rounded-md ${
						isLiked
							? "bg-blue-600 text-white hover:bg-blue-700"
							: "bg-blue-50 text-blue-950 hover:bg-blue-200"
					}  transition-colors group-disabled:500 `}
				>
					<FaChevronUp
						className={`${isLiked ? "fill-white" : "fill-blue-600"}`}
					/>
					{upvotes}
				</button>
				<span className="flex items-center right-6 text-sm bottom-0 top-0 my-auto gap-1">
					<FaComment className="w-5 h-5 fill-slate-300" />
					{comments ? comments.length : 0}
				</span>
			</div>
		</div>
	);
};

export default RoadmapItem;
