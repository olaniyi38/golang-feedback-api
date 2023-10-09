import { useSelector } from "react-redux";
import { selectStatus } from "../features/feedbacks/feedbackSelector";

const FormInput = ({ children }) => {
	return <div className="flex flex-col gap-y-4">{children}</div>;
};

FormInput.Label = ({ label, subLabel }) => {
	return (
		<label className="space-y-1">
			<p className="text-blue-950 text-sm font-bold capitalize">{label}</p>
			{subLabel && (
				<p className="text-xs text-slate-600 first-letter:capitalize">
					{subLabel}
				</p>
			)}
		</label>
	);
};

FormInput.Text = ({ name, errors, register, ...inputProps }) => {
	const pending = useSelector(selectStatus) === "pending";
	const errorStyle = errors[name.toLowerCase()]
		? "outline-red-500"
		: "focus:outline-blue-500";
	return (
		<>
			<input
				className={`bg-slate-200 disabled:bg-slate-200 disabled:text-slate-400 p-2 ${errorStyle} text-sm rounded-sm outline-none  outline-1 transition-all`}
				{...(register && register(name.toLowerCase(), { required: true }))}
				{...inputProps}
				disabled={pending}
			/>
		</>
	);
};

FormInput.Select = ({ options, name, errors, register, ...inputProps }) => {
	const pending = useSelector(selectStatus) === "pending";
	return (
		<select
			className={` bg-slate-200 disabled:bg-slate-200 disabled:text-slate-400 p-2 text-sm rounded-sm outline-none focus:outline-blue-600 outline-1 transition-all`}
			{...(register && register(name.toLowerCase(), { required: true }))}
			{...inputProps}
			disabled={pending}
		>
			{options.map((o) => (
				<option value={o}>{o}</option>
			))}
		</select>
	);
};

FormInput.TextArea = ({ register, name }) => {
	const pending = useSelector(selectStatus) === "pending";
	return (
		<textarea
			id="detail"
			cols="30"
			rows="5"
			className={` bg-slate-200 disabled:bg-slate-200 disabled:text-slate-400 p-2 text-sm rounded-sm outline-none focus:outline-blue-600 outline-1 transition-all`}
			{...(register && register(name.toLowerCase()))}
			disabled={pending}
		></textarea>
	);
};

export default FormInput;
