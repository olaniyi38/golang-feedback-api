import { HiOutlineChevronLeft } from "react-icons/hi";

import FeedBack from "../components/FeedBack";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import Comment from "../components/Comment";
import { useState } from "react";

import GoBackButton from "../components/GoBackButton";
import { useDispatch, useSelector } from "react-redux";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import { editFeedback } from "../features/feedbacks/feedbacksSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { BSON } from "bson";
import { selectUser } from "../features/user/userSelector";


const FeedBackPage = () => {
	const { id } = useParams();
	const feedbacks = useSelector(selectFeedbacks);
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();

	const feedback = feedbacks.find((d) => d.id === id);

	const lim = 100;

	const [comment, setComment] = useState("");

	function onChangeHandler(e) {
		const { value } = e.target;
		if (!(value.length > lim)) {
			setComment(value);
		}
	}

	const newComment = {
		id: new BSON.ObjectId().toString(),
		content: comment,
		user: { ...currentUser },
	};

	function addComment() {
		const newFeedback = {
			...feedback,
			comments: [...feedback.comments, { ...newComment }],
		};
		comment.length > 0 &&
			toast
				.promise(dispatch(editFeedback(newFeedback)).unwrap(), {
					success: "Comment added",
					pending: "adding comment",
				})
				.catch((payload) => {
					toast(payload.message, { type: "error" });
				});
		setComment("");
	}

	if (!feedback) {
		return <Loading />;
	}

	return (
		<section className="px-4 pb-16 lg:pt-10">
			<div className="max-w-[60rem] mx-auto">
				<header className="flex justify-between items-center py-8">
					<GoBackButton>
						<HiOutlineChevronLeft className="stroke-2 w-4 h-4 " />
						<span className="text-slate-700">Go Back</span>
					</GoBackButton>
					<Link to={`/edit-feedback/${id}`}>
						<Button variant={"blue"}>Edit Feedback</Button>
					</Link>
				</header>

				<div className="py-8  space-y-4">
					<FeedBack data={feedback} />

					<div className="space-y-4 bg-white p-6 rounded-md">
						<h1 className="font-bold text-blue-950 text-lg">
							{feedback.comments.length} Comment(s)
						</h1>
						<div className="space-y-6">
							{feedback.comments.map((c) => (
								<Comment key={c.id} feedbackId={id} data={c} />
							))}
						</div>
					</div>
				</div>
				<div className="bg-white space-y-6 p-6 rounded-md">
					<h1 className="text-blue-950 font-bold">Add Comment</h1>
					<textarea
						className="bg-slate-100 rounded-md
                w-full p-4 placeholder:text-sm placeholder:text-slate-600 outline-none focus:outline-blue-900 transition-all"
						rows={4}
						type="text"
						name="comment"
						placeholder="Type your comment here..."
						value={comment}
						onChange={onChangeHandler}
					/>
					<div className="flex items-center justify-between">
						<span className="text-sm text-slate-600">
							{lim - comment.length} Characters left
						</span>
						<Button onClick={addComment} variant="blue">
							Post Comment
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FeedBackPage;
