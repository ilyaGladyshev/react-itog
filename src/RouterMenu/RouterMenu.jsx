import React from "react";
import { useState } from "react";
import { Route, Router, Routes } from "react-router";
import TaskManager from "../TaskManager/TaskManager.jsx";
import Authorisation from "../Authorisation/Authorisation.jsx"
import "../App/App.css";

export default function RouterMenu(){
	const [theme, setTheme] = useState('light'); 
	const [currentUser, setCurrentUser] = useState(null);
	
	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light'? 'dark' : 'light'));
	}

	return (
		<div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
			<div className="theme-container">
				<button onClick={toggleTheme} className="btn-secondary">
					{theme === 'light' ? 'Темная тема' : 'Светлая тема'}
				</button>
			</div>
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