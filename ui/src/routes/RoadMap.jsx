import React from "react";
import { HiOutlineChevronLeft, HiOutlinePlus } from "react-icons/hi";
import { Link } from "react-router-dom";
import Button, { BTN_VARS } from "../components/Button";

import { useState } from "react";
import RoadmapList from "../components/RoadmapList";
import RoadmapNav from "../components/RoadmapNav";
import GoBackButton from "../components/GoBackButton";
import { useSelector } from "react-redux";
import { selectFeedbacks } from "../features/feedbacks/feedbackSelector";
import Loading from "../components/Loading";


const roadmaps = ["planned", "in-progress", "live"];

const RoadMap = () => {
	const [currentRoadmap, setCurrentRoadmap] = useState(roadmaps[0]);
	const feedbacks = useSelector(selectFeedbacks);

	if (!feedbacks) {
		return <Loading />;
	}

	return (
		<section className="max-w-[68rem] mx-auto sm:px-4 sm:py-8">
			<header className="bg-blue-950 text-white px-6 py-4 sm:rounded-lg md:mb-6 ">
				<GoBackButton>
					<HiOutlineChevronLeft />
					<span>Go Back</span>
				</GoBackButton>

				<div className="flex justify-between items-center mt-3">
					<h1 className=" font-bold text-lg">Roadmap</h1>
					<Link to="/create-feedback">
						<Button variant={"purple"}>
							<HiOutlinePlus />
							<span>Add Feedback</span>
						</Button>
					</Link>
				</div>
			</header>

			<div>
				<div className="md:hidden flex text-center font-semibold  text-sm ">
					{roadmaps.map((r, i) => {
						const isActive = r === currentRoadmap;
						const count = feedbacks.filter((pr) => pr.status === r).length;
						return (
							<RoadmapNav
								isActive={isActive}
								title={r}
								onClick={() => setCurrentRoadmap(roadmaps[i])}
								count={count}
							/>
						);
					})}
				</div>
				<div className="px-4 pb-16 md:flex items-start gap-x-4">
					{roadmaps.map((r) => {
						const values = feedbacks.filter((pr) => pr.status === r);
						return (
							<RoadmapList
								currentRoadmap={currentRoadmap}
								roadmap={r}
								values={values}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
};

export default RoadMap;
