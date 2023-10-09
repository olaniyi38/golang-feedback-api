import React from "react";
import Reply from "./Reply";
import { useState } from "react";
import Button from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import { toast } from "react-toastify";
import { editFeedback } from "../features/feedbacks/feedbacksSlice";
import { selectUser } from "../features/user/userSelector";
import { HiOutlineTrash } from "react-icons/hi";

const Comment = ({ data, feedbackId }) => {
	const { id, content, user, replies } = data;
	const [replyActive, setReplyActive] = useState(false);
	const [reply, setReply] = useState("");
	const feedbacks = useSelector(selectFeedbacks);
	const feedback = feedbacks.find((fb) => fb.id === feedbackId);
	const currentUser = useSelector(selectUser);
	const dispatch = useDispatch();

	function onChangeHandler(e) {
		setReply(e.target.value);
	}

	async function deleteComment(id) {
		const newFeedback = { ...feedback };
		const newComments = [...feedback.comments];
		const index = newComments.findIndex((c) => c.id === id);
		newComments.splice(index, 1);
		newFeedback.comments = newComments;
		await toast.promise(dispatch(editFeedback(newFeedback)).unwrap(), {
			success: "comment deleted",
			pending: "deleting comment",
			error: "error deleting comment",
		});
	}

	const newReply = {
		content: reply,
		replyingTo: user.username,
		user: {
			...currentUser,
		},
	};

	async function postReply() {
		const newComments = feedback.comments.map((c) => {
			if (c.id === id) {
				return c.replies
					? { ...c, replies: [...c.replies, { ...newReply }] }
					: { ...c, replies: [{ ...newReply }] };
			}
			return c;
		});
		const newFeedback = {
			...feedback,
			comments: newComments,
		};

		await toast
			.promise(dispatch(editFeedback(newFeedback)).unwrap(), {
				success: "Posted comment",
				pending: "Posting comment",
				error: "something went wrong",
			})
			.then(() => setReply(""));
	}

	return (
		<div className="border-b border-b-slate-300 last:border-none pb-6">
			<header className="flex justify-between items-center">
				<div className="flex gap-x-3 md:gap-x-6 items-center text-sm">
					<div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full">
						<img
							src={user.image}
							alt=""
							className="rounded-full absolute inset-0"
						/>
					</div>
					<div>
						<p className="text-blue-950 font-semibold text-sm">
							{user.name === currentUser.name ? "You" : user.name}
						</p>
						<p className="text-xs  text-slate-600">@{user.username}</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setReplyActive(!replyActive)}
						className="text-blue-600 text-xs sm:text-sm font-semibold"
					>
						Reply
					</button>
					{user.username === currentUser.username && (
						<button onClick={deleteComment}>
							<HiOutlineTrash className="w-5 h-5 stroke-red-600" />
						</button>
					)}
				</div>
			</header>
			<div className="text-slate-700 md:pl-16 text-sm mt-4 ">{content}</div>
			{replies && (
				<div className="pl-6 md:ml-10 border-l mt-4 md:mt-8 border-l-slate-300">
					{replies.map((r) => (
						<Reply key={r.content} data={r} />
					))}
				</div>
			)}
			{replyActive && (
				<div className="flex flex-col gap-y-3 mt-4 md:mt-6 md:pl-16">
					<textarea
						onChange={onChangeHandler}
						value={reply}
						placeholder={`replying to @${user.username}`}
						className="flex-1 p-4 placeholder:text-sm text-sm  focus:outline-blue-600 outline-1 border border-slate-500 rounded-md"
						cols="30"
						rows="3"
					></textarea>
					<div className="flex  justify-end gap-x-4">
						<Button onClick={() => setReplyActive(false)}>cancel</Button>
						<Button onClick={postReply} variant="blue">
							Post Reply
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Comment;
