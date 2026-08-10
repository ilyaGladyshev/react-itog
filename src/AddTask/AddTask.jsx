import React from "react";
import FullInput from "../Inputs/FullInput.jsx";
import LessInput from "../Inputs/LessInput.jsx";
import './AddTask.css';

const AddTask = ({onCloseTask, onAddTask}) => {
	
	const addNameForOnChangeInput = (text) => {
		console.log(text);
	}
	
	return (
		<div className="add-task-container">
			<form className="add-task-container__form" onSubmit = {(e) => {
					e.preventDefault();
					onAddTask(e.target); 				
				}} onReset = {(e) => {
					e.preventDefault();
					onCloseTask();
				}}>
				<LessInput propsName="name" placeholder="Ваше имя" type="text" onChangeProps={addNameForOnChangeInput} />
				<LessInput propsName="surname" placeholder="Ваше фамилия" type="text" onChangeProps={addNameForOnChangeInput} />
				<LessInput propsName="lastname" placeholder="Ваше отчество" type="text" onChangeProps={addNameForOnChangeInput} />				
				<FullInput type='date' propsName="dateBirth" />
				<FullInput propsName="desc" type='text-area' placeholder="Введите описание задачи"/>
				<button type="submit">Добавить</button>
				<button type="reset">Отмена</button>
			</form>
		</div>
	)
};

export default AddTask;