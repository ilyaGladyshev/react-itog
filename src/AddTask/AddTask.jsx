import React from "react";
import FullInput from "../Inputs/FullInput.jsx";
import { useState } from "react";
import './AddTask.css';

const AddTask = ({onCloseTask, onAddTask}) => {
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim()) return alert('Введите наименование задачи');
		onAddTask(title.trim(), description.trim());
		setTitle('');
		setDescription('');
	}

	const handleReset = async(e) => {
		e.preventDefault();
		onCloseTask();
	}

	const changeTitle = (e) => {
		setTitle(e.target.value)
	}

	const changeDescription = (e) => {
		setDescription(e.target.value)
	}
	return (
		<div className="add-task-container">
			<form className="add-task-container__form" onSubmit = {handleSubmit} 
			onReset = {handleReset}>
				<h4>Создать новую задачу</h4>
				<FullInput propsName="title" 
						   type='text-area' 
						   placeholder="Введите наименование задачи" 						   
						   onChangeProps={changeTitle}/>
				<FullInput propsName="description" 
						   type='text-area' 
						   placeholder="Введите описание задачи" 						   
						   onChangeProps={changeDescription}/>
				<button type="submit">Добавить</button>
				<button type="reset">Отмена</button>
			</form>
		</div>
	)
};

export default AddTask;