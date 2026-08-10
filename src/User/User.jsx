import React from "react";
import FullInput from "../Inputs/FullInput.jsx";
import LessInput from "../Inputs/LessInput.jsx";
import './User.css';

const User = ({OnAddUser, OnCloseUser}) => {
	
	const addNameForOnChangeInput = (text) => {
		console.log(text);
	}
	
	return (
		<div className="add-task-container">
			<form className="add-task-container__form" onSubmit = {(e) => {
					e.preventDefault();
					onAddUser(e.target); 				
				}} onReset = {(e) => {
					e.preventDefault();
					onCloseUser();
				}}>
				<LessInput propsName="name" placeholder="Ваше имя" type="text" onChangeProps={addNameForOnChangeInput} />
				<LessInput propsName="surname" placeholder="Ваше фамилия" type="text" onChangeProps={addNameForOnChangeInput} />
				<LessInput propsName="lastname" placeholder="Ваше отчество" type="text" onChangeProps={addNameForOnChangeInput} />				
				<FullInput type='date' propsName="dateBirth" />
				<button type="submit">Добавить</button>
				<button type="reset">Отмена</button>
			</form>
		</div>
	)
};

export default User;