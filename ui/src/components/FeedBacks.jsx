import Button from "./Button";
import { FaPlus } from "react-icons/fa";
import { HiOutlineLightBulb, HiOutlinePlus } from "react-icons/hi";
import FeedBack from "./FeedBack";
import FeedbacksSkeleton from './FeedbacksSkeleton'
import { Link } from "react-router-dom";
import { useState } from "react";
import FeedbacksList from "./FeedbacksList";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSelector";
import { selectStatus } from "../features/feedbacks/feedbackSelector";


const FeedBacks = ({ data }) => {
	const feedBacks = data;
	const [sortBy, setSortBy] = useState("mostUpvotes");
	const feedbacksFetchStatus = useSelector(selectStatus)

	const sorted = feedBacks.sort((a, b) => {
		switch (sortBy) {
			case "mostComments":
				return b.comments.length - a.comments.length;
			case "leastComments":
				return a.comments.length - b.comments.length;
			case "mostUpvotes":
				return b.upvotes - a.upvotes;
			case "leastUpvotes":
				return a.upvotes - b.upvotes;
		}
	});

	function updateSort(e) {
		setSortBy(e.target.value);
	}

	return (
		<section>
			<header className=" sticky top-0 md:top-4 z-10 h-full flex items-center justify-between p-4 md:rounded-md bg-blue-950 text-sm text-white">
				<div className="hidden sm:flex items-end gap-3 font-bold text-lg">
					<span>
						<HiOutlineLightBulb className="w-8 h-8 stroke-1" />
					</span>
					<span>{feedBacks.length}</span>
					<span>Suggestions</span>
				</div>

				<div className="flex items-center gap-2">
					<label htmlFor="#sort">Sort By</label>
					<select
						name="sort"
						id="#sort"
						className="bg-blue-950 font-semibold outline-none disabled:text-gray-400 transition-colors"
						onChange={updateSort}
						disabled={feedbacksFetchStatus === "pending" || feedbacksFetchStatus === "failed"}
					>
						<option value="mostUpvotes">Most upvotes</option>
						<option value="leastUpvotes">Least upvotes</option>
						<option value="mostComments">Most comments</option>
						<option value="leastComments">Least comments</option>
					</select>
				</div>
				<Link to="/create-feedback">
					<Button disabled={feedbacksFetchStatus === "pending" || feedbacksFetchStatus === "failed"}>
						<FaPlus className="w-3 h-3" />
						<span>Add feedback</span>
					</Button>
				</Link>
			</header>

			{feedbacksFetchStatus === "pending" ? <FeedbacksSkeleton /> : <FeedbacksList data={sorted} />}
		</section>
	);
};

export default FeedBacks;
