import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import Button from "./Button";
import { useDispatch } from "react-redux";
import { fetchFeedbacks } from "../features/feedbacks/feedbacksSlice";
import { useNavigate } from "react-router-dom";
import { signInUser, signUpUser } from "../features/user/userSlice";
import { Link } from "react-router-dom";

const AuthForm = ({ type }) => {
	const { handleSubmit, register, formState } = useForm();
	const errors = formState.errors;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function submitHandler(data) {
		{
			type === "sign-up"
				? await dispatch(signUpUser(data))
						.unwrap()
						.then(async () => {
							navigate("/");
							await dispatch(fetchFeedbacks()).unwrap();
						})
				: await dispatch(signInUser(data))
						.unwrap()
						.then(async () => {
							navigate("/");
							await dispatch(fetchFeedbacks()).unwrap();
						});
		}
	}

	return (
		<div key={type}>
			<h1 className="text-slate-700 text-xl first-letter:capitalize mb-8 font-black">
				{type}
			</h1>
			<form
				x
				onSubmit={handleSubmit(submitHandler)}
				className="space-y-4"
			>
				{type === "sign-up" && (
					<FormInput>
						<FormInput.Label label="Name" />
						<FormInput.Text name="name" register={register} errors={errors} />
					</FormInput>
				)}
				<FormInput>
					<FormInput.Label label="username" />
					<FormInput.Text name="username" register={register} errors={errors} />
				</FormInput>
				<FormInput>
					<FormInput.Label label="Password" />
					<FormInput.Text
						type="password"
						name="password"
						register={register}
						errors={errors}
					/>
				</FormInput>

				<Button variant="blue" full>
					<span className="flex-1 text-base">{type}</span>
				</Button>
				{type === "sign-in" ? (
					<p className=" mt-4">
						not a user?{" "}
						<Link className=" text-blue-600  ml-1" to="/auth/sign-up">
							sign-up
						</Link>
					</p>
				) : (
					<p className=" mt-4">
						already a user?{" "}
						<Link className=" text-blue-600 ml-1" to="/auth/sign-in">
							sign-in
						</Link>
					</p>
				)}
			</form>
		</div>
	);
};

export default AuthForm;
