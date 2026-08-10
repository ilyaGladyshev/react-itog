import React, {useState, useEffect} from "react";
import AddTask from "../AddTask/AddTask.jsx";
import TaskList from "../TaskList.jsx";
import './TaskManager.css'
const TaskManager = () => {
	
	const [addTaskIsOpened, setAddTaskIsOpened] = useState(false);
	const [taskList, setTaskList] = useState([]);
	const [task, setTask] = useState({});
	
	const onCloseAddTask = () => {
		console.log("close task");
		setAddTaskIsOpened(false);
	}

	const onAddTask = (e) => {
		console.log("onAdd");
		console.log(e);
		const obj = Object.values(e).reduce((obj, field) => {
					obj[field.name] = field.value;
					return obj
				}, {});
		setTask(obj);
		setTaskList([...taskList, obj]);
	}

	return (
		<div className='task-container'>
			<button className="btn tasks-container__add-task-button" onClick={() => setAddTaskIsOpened(!addTaskIsOpened)}>
				Добавить задачу
			</button>
			{addTaskIsOpened && <AddTask onCloseTask={onCloseAddTask} onAddTask={onAddTask}/>}
			<TaskList tasks={taskList || []}/>
		</div>
	)
}

export default TaskManager;