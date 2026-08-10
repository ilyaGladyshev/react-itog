import React, {useState, useEffect} from "react";
import FullInput from "../Inputs/FullInput.jsx";
import LessInput from "../Inputs/LessInput.jsx";
import './Authorisation.css';

const Authorisation = () => {
	const [users, setUsers] = useState([]);
	const [authorisationIsOpened, setAuthorisationIsOpened] = useState(true);
	const [authorisationIsReset, setAuthorisationIsReset] = useState(false);	
	
	const onResetAuthorisation = () => {
		setAuthorisationIsReset(true);
	}

	const onConfirmAuthorisation = () => {

	}
	 const loginOnChangeInput = (text) =>{

	}
	async function readFileUsers(parfilePath) {
		
	}
	useEffect(() => {
		readFileUsers("");
	}, [])
	return (

		<div classname="authorisation-container">
			<form classname="authorisation-container__form" onSubmit = {(e) => {
					e.preventDefault();
					onConfirmAuthorisation(e.target); 				
				}} onReset = {(e) => {
					e.preventDefault();
					onResetAuthorisation();
				}}>
				<LessInput propsName="login" placeholder="Ваш логин" type="text" onChangeProps={loginOnChangeInput} />
				<FullInput type='password' propsName="password" />
				<button type="submit">Зарегистрироваться</button>
				<button type="reset">Отмена</button>
			</form>
		</div>
	)
};

export default Authorisation;