import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { selectUser } from "../features/user/userSelector";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Auth = () => {
	const user = useSelector(selectUser);
	if (user) {
		return <Navigate to="/" />;
	}
	return (
		<section className="px-6 space-y-8 pt-32 max-w-xl mx-auto">
			<div>
				<Outlet />
			</div>
		</section>
	);
};

export default Auth;
