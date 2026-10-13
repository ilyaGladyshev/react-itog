import { useEffect } from "react";
import { useState } from "react";
import { Route, Routes } from "react-router";
import TaskManager from "../TaskManager/TaskManager.jsx";
import Authorisation from "../Authorisation/Authorisation.jsx"
import "../App/App.css";

export default function RouterMenu(){
	const [theme, setTheme] = useState('light'); 
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const toggleTheme = () => {
		setTheme((prevTheme) => (prevTheme === 'light'? 'dark' : 'light'));
	}

	useEffect(() =>{
		async function checkAutoLogin(){
			const token = localStorage.getItem('token');
			if (!token){
				setLoading(false);
				return;
			}
			try {
				const response = await fetch('/api/auth/me', {
					method: 'GET',
					headers: {
						'Authorisation': `Brearer ${token}`
					}
				});
				const data = await response.json();
				if (response.ok && data.status === "success"){
					setCurrentUser(data.user);
				} else{
					localStorage.removeItem('token');
				}	
			} catch (error) {
				console.error('Ошибка авторизации', error);	
				setCurrentUser(null);
			} finally{
				setLoading(false);
			}
		}
		checkAutoLogin();
	}, []);
	
	if (loading){
		return (
			<div className={`app-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
				<h3>Секунду, восстанавливаем сессию</h3>
			</div>
		)
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