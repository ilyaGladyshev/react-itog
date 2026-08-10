import React from "react";
import { Route, Router, Routes } from "react-router";
import TaskManager from "./TaskManager/TaskManager.jsx";
import Authorisation from "./Authorisation/Authorisation.jsx"
const RouterMenu = () => {
	return (
		<Routes>
			<Route path="/" element={<Authorisation/>}></Route>
			<Route path="/" element={<TaskManager/>}></Route>
		</Routes>
	)
};

export default RouterMenu;