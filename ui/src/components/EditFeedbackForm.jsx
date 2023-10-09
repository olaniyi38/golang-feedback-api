import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import generateRandomId from "../helpers/randomNum";
import { useDispatch, useSelector } from "react-redux";
import {
	createFeedback,
	deleteFeedback,
	editFeedback,
} from "../features/feedbacks/feedbacksSlice";
import { toast } from "react-toastify";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import { useState } from "react";

const CATEGORIES = ["ui", "ux", "enhancement", "bug", "feature"];

const EditFeedbackForm = ({ id }) => {
	const feedbacks = useSelector(selectFeedbacks);
	const feedback = feedbacks.find((fb) => fb.id === id);
	const { title, category, status, description } = feedback;
	const { register, formState, handleSubmit } = useForm({
		defaultValues: { title, category, status, description },
	});
	const [deleteActive, setDeleteActive] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const errors = formState.errors;

	async function onSubmit(data) {
		const newFeedback = {
			...feedback,
			...data,
		};

		console.log(newFeedback);
		await toast
			.promise(dispatch(editFeedback(newFeedback)).unwrap(), {
				success: "Feedback updated",
				error: "something went wrong",
				pending: "updating feedback",
			})
			.then(() => {
				navigate(-1);
			});
	}

	async function removeFeedback() {
		await toast
			.promise(dispatch(deleteFeedback(id)).unwrap(), {
				success: "feedback deleted",
				error: "error deleting feedback",
				pending: "deleting feedback",
			})
			.then(() => {
				navigate("/");
			});
	}
	
	

	return (
		<div className="space-y-8">
			<form className="space-y-5 ">
				<FormInput>
					<FormInput.Label
						label="Feedback Title"
						subLabel="Add a short and, desriptive headiline"
					/>
					<FormInput.Text register={register} name="title" errors={errors} />
				</FormInput>

				<FormInput>
					<FormInput.Label
						label="category"
						subLabel="choose a category for your feedback"
					/>
					<FormInput.Select
						name="category"
						register={register}
						options={CATEGORIES}
					/>
				</FormInput>
				<FormInput>
					<FormInput.Label
						label="update status"
						subLabel="Change feature status"
					/>
					<FormInput.Select
						register={register}
						name="status"
						errors={errors}
						options={["in-progress", "live", "planned", "suggestion"]}
					/>
				</FormInput>
				<FormInput>
					<FormInput.Label
						label="feedback detail"
						subLabel="include any specific comments on what should be improved, added, etc."
					/>
					<FormInput.TextArea name="description" register={register} />
				</FormInput>
			</form>
			<div className="flex items-center justify-between px-4">
				{deleteActive ? (
					<>
						<p className="font-medium text-red-400">Confirm delete:</p>
						<div className="flex items-center gap-x-4 ">
							<Button variant="blue" onClick={() => setDeleteActive(false)}>
								Cancel
							</Button>
							<Button variant="red" onClick={removeFeedback}>
								Delete
							</Button>
						</div>
					</>
				) : (
					<>
						<Button variant="red" onClick={() => setDeleteActive(true)}> Delete</Button>
						<div className="flex items-center gap-x-4 ">
							<Button onClick={() => navigate(-1)}>Cancel</Button>
							<Button variant="blue" onClick={handleSubmit(onSubmit)}>
								Save changes
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default EditFeedbackForm;
