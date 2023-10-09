import { useSelector } from "react-redux";
import { selectUser } from "../features/user/userSelector";

const Reply = ({ data }) => {
	const { content, user, replyingTo } = data;
	const currentUser = useSelector(selectUser);
	return (
		<div className="pb-4">
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
						<p className="text-xs text-slate-600">@{user.username}</p>
					</div>
				</div>
				{/* <button className="text-blue-600 text-xs sm:text-sm font-semibold">
					Reply
				</button> */}
			</header>
			<div className="text-slate-700 md:pl-16 text-sm mt-4">
				<span className="text-purple-600 font-bold">@{replyingTo} </span>
				{content}
			</div>
		</div>
	);
};

export default Reply;
