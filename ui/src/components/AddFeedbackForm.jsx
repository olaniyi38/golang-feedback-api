import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";
import { useDispatch } from "react-redux";
import { createFeedback } from "../features/feedbacks/feedbacksSlice";
import { toast } from "react-toastify";

const CATEGORIES = ["ui", "ux", "enhancement", "bug", "feature"];

const AddFeedbackForm = () => {
	const { register, formState, handleSubmit } = useForm();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const errors = formState.errors;

	async function onSubmit(data) {
		const feedback = {
			...data,
			id: new ObjectId().toString(),
			upvotes: 0,
			status: "suggestion",
			comments: [],
		};
		toast
			.promise(dispatch(createFeedback(feedback)).unwrap(), {
				success: "Feedback added",
				pending: "adding feedback",
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
						label="feedback detail"
						subLabel="include any specific comments on what should be improved, added, etc."
					/>
					<FormInput.TextArea name="description" register={register} />
				</FormInput>
			</form>
			<div className="flex items-center justify-end gap-x-4 px-4">
				<Button onClick={() => navigate(-1)} variant="red">
					Cancel
				</Button>
				<Button onClick={handleSubmit(onSubmit)}>Post feedback</Button>
			</div>
		</div>
	);
};

export default AddFeedbackForm;
