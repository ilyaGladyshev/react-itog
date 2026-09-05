import React, {useState, useEffect} from "react";
import FullInput from "../Inputs/FullInput.jsx";
import LessInput from "../Inputs/LessInput.jsx";
import ComboBox from "../Inputs/ComboBox.jsx";
import './Authorisation.css';



const Authorisation = ({onLoginSuccess}) => {
	const [step, setStep] = useState(0);
	const [userList, setUserList] = useState([]);
	const [loadind, setLoading] = useState(false);
	const [login, setLogin] = useState('');
	const [selectedLogin, setSelectedLogin] = useState('');
	const [fullName, setFullName] =useState({firstName : '', lastName : '', middleName : '', dateBirth: ''})
	
	useEffect(() =>{
		async function fetchUsers() {
			try {
				setSelectedLogin('new_account');
				const response = await fetch('/api/users');
				const logins = await response.json();
				setUserList(logins);
				/*if (logins.length > 0){
					setSelectedLogin(logins[0]);
				} else{
					setSelectedLogin('new_account');
				}*/ 				
			} catch (error) {
				console.error('Не удалось загрузить пользователей', error);	
			}
		}
		fetchUsers();
	}, []);

	const onResetAuthorisation = () => {
		setStep(3);
	}

	const handleCheckLogin = async (e) => {
		e.preventDefault();
		if (selectedLogin !== 'new_account'){
			setLoading(true);
			try {
				const response = await fetch('/api/check-user', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json'},
					body: JSON.stringify({login: selectedLogin})
				});
				const data = await response.json();
				if (data.status === 'exists'){
					alert(`С возвращением, ${data.user.firstName}!`);
					onLoginSuccess(data.user);
				}
			} catch (error) {
				alert("Ошибка сервера!");
			} finally{
				setLoading(false);
			}
		}
		else{
			setStep(1);
			/*if (!login.trim()) return alert('Введите новый логин!');
				const response = await fetch('/api/check-user', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json'},
					body: JSON.stringify({login: selectedLogin})
				});
				const data = await response.json();
				if (data.status === 'exists'){
					return('Этот логин занят, введите новый логин!');
				}
				setStep(1);*/
		}
	}

	const changeFirstName = (text) =>{
		setFullName({...fullName, firstName : text});
	}

	const changeLastName = (text) =>{
		setFullName({...fullName, lastName : text});
	}

	const changeMiddleName = (text) =>{
		setFullName({...fullName, middleName : text});
	}

	const changeLogin = (text) =>{
		setLogin(text);
	}

	const changeDate = (e) =>{
		setFullName({...fullName, dateBirth : e.target.value});		
	}

	const writeNewUser = async (e) => {
		e.preventDefault();
		if (login.trim() === ""){
			console.log("Введите логин!");
		} else if (fullName.firstName.trim() === ""){
			console.log("Введите имя!");
		} else if (fullName.lastName.trim() === ""){
			console.log("Введите фамилию!");
		} else if (fullName.dateBirth === ""){
			console.log("Введите дату рождения!");			
		} else{
			setLoading(true);
			try {
				const response = await fetch('/api/register', {
					method: 'POST',
					headers: {'Content-Type': '/application/json'},
					body: JSON.stringify({
						login: login.trim(),
						firstName: fullName.firstName.trim(),
						lastName: fullName.lastName.trim(),
						middleName: fullName.middleName.trim(),
						dateBirth: fullName.dateBirth.trim()
					})
				});
				const data = await response.json();
				if (response.ok && data.success){
					alert('Регистрация успешна!');
					onLoginSuccess(data.user);
				}	
			} catch (error) {
				console.error("Ошибка сети", error);	
			} finally{
				setLoading(false);
			}
		}
	}

	const loginOnChange = (text) =>{
		setSelectedLogin(text);
	}

	return (

		<div className="authorisation-container">
			<h3>Авторизация</h3>
			{step === 0 && (
				<form className="autorization-form" onSubmit = {handleCheckLogin} 
				onReset = {(e) => {
						e.preventDefault();
						onResetAuthorisation();
					}}>
					<ComboBox listValues={userList} propsName="login" placeholder="Ваш логин" onChangeProps={loginOnChange} />
					<button type="submit">Войти</button>
					<button type="reset">Отмена</button>
				</form>
			)}
			{step === 1 && (
				<form classname="autorization-form" onSubmit = {writeNewUser} 
				 onReset = {(e) => {
						e.preventDefault();
						{setStep(0)}
					}}>
					<LessInput propsName="login" placeholder="Логин" type="text" onChangeProps={changeLogin} />						
					<LessInput propsName="name" placeholder="Ваше имя" type="text" onChangeProps={changeFirstName} />
					<LessInput propsName="surname" placeholder="Ваше фамилия" type="text" onChangeProps={changeLastName} />
					<LessInput propsName="lastname" placeholder="Ваше отчество" type="text" onChangeProps={changeMiddleName} />				
					<FullInput type='date' propsName="dateBirth" onChangeProps={changeDate}/>
					<button type="submit">Зарегистрировать нового пользователя</button>
					<button type="reset">Отмена</button>
				</form>
			)}		
			{step === 3 && (
				<div>Осуществлен выход!</div>
			)}		
		</div>
	)
};

export default Authorisation;