import React from "react";
import { useState } from "react";
import { Route, Router, Routes } from "react-router";
import TaskManager from "./TaskManager/TaskManager.jsx";
import Authorisation from "./Authorisation/Authorisation.jsx"

export default function RouterMenu(){
	const [currentUser, setCurrentUser] = useState(null);
	return (
		<div>
			{!currentUser ? (
				<Authorisation 
				onLoginSuccess={
					(user) => {
						setCurrentUser(user);
					}
				}></Authorisation>
			) : (
				<div>
					<p>Добро пожаловать, {currentUser.firstName}</p>
					<Routes>
						<Route path="/" element={<TaskManager user = {currentUser}/>}></Route>
					</Routes>
				</div>
			)}
		</div>
	)};