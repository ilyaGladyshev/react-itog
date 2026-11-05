import React, {useState, useEffect} from "react";
import AddTask from "../AddTask/AddTask.jsx";
import TaskList from "../TaskList/TaskList.jsx";
import './TaskManager.css'
const TaskManager = ({user}) => {
	
	const [addTaskIsOpened, setAddTaskIsOpened] = useState(false);
	const [taskList, setTaskList] = useState([]);
	const REACT_APP_URL = process.env.REACT_APP_URL;
	const [hideCompleted, setHideCompleted] = useState(false);
	const [onlyUrgent, setOnlyUrgent] = useState(false);
	const onCloseAddTask = () => {
		console.log("close task");
		setAddTaskIsOpened(false);
	}
	const filteredTask = taskList.filter(t =>{
		if (hideCompleted && t.status === "Выполнено") return false;
		if (onlyUrgent && t.priority !== 2) return false;
		return true;
	})
	const loadTasks = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${REACT_APP_URL}/api/tasks`,{
				method: 'GET',
				headers: {
					'Authorization': `Brearer ${token}`
				}
			})
			const data = await response.json();
			setTaskList(data);
		} catch (error) {
			console.error("Ошибка загрузки задач", error);		
		}
	}
	const onPriorityChange = (id, priority) => {
		setTaskList(prevList => 
			prevList.map(task => {
				if (task.id === id) {
					return { ...task, priority: priority };
				}
				return task;
			}))
	}

	const onAddTask = async (title, description, priority) =>{
		const token = localStorage.getItem('token');
		try {
			await fetch(`${REACT_APP_URL}/api/tasks`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Brearer ${token}`
				},
				body: JSON.stringify({ title, description})
			});
			loadTasks();
		} catch (error) {
			alert("Не удалось сохранить задачу на сервере");	
		}
	}

	useEffect(() => {
		loadTasks();
	}, [user.login]);

	const onCompleteTask = async (id) => {
		try {
			const token = localStorage.getItem('token');
			await fetch(`${REACT_APP_URL}/api/tasks/complete`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Brearer ${token}`
				},
				body: JSON.stringify({id})
				
			});
			loadTasks();
		} catch (error) {
			alert("Ошибка при изменении статуса");	
		}		
	}

	const onDeleteTask = async (id) => {
		try {
			const token = localStorage.getItem('token');			
			await fetch(`${REACT_APP_URL}/api/tasks/delete`, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Authorization': `Brearer ${token}`
				},
				body: JSON.stringify({id})
			});
			loadTasks();
		} catch (error) {
			alert("Ошибка при изменении статуса");	
		}		
	}

	const handleExport = async () => {
		const token = localStorage.getItem('token');		
		const response = await fetch(`${REACT_APP_URL}/api/tasks/export`, {
			method: 'GET',
			headers: {
					'Authorization': `Brearer ${token}`				
			}
		});
		if (!response.ok){
			console.log("Не удалось выгрузить файл");
			return;
		}
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'task_report.csv';
		document.body.append(a);
		a.click();
		a.remove();
		window.URL.revokeObjectURL(url);
	}

	return (
		<div className='task-container'>
			<h3>Панель управления задачами</h3>
			<div className="head">
				<button onClick={() => setAddTaskIsOpened(!addTaskIsOpened)}>
					Добавить задачу
				</button>
				<button className = "btn-export" 
					onClick={handleExport}>
					Выгрузить список задач
				</button>	
			</div>
			<div className="filters">
				<button onClick={() => setHideCompleted(!hideCompleted)}
				className = {hideCompleted ? "fiters_button-complited_hide" : "__fiters_button_non-hide"}>
				{hideCompleted ? 'Показать выполненные' : 'Скрыть выполненные'}
				</button>
				<button onClick={() => setOnlyUrgent(!onlyUrgent)}
				className = {onlyUrgent ? "fiters_button-urgent_hide" : "__fiters_button_non-hide"}>
				{onlyUrgent ? 'Все приоритеты' : 'Только срочные'}
				</button>
			</div>
			{addTaskIsOpened && <AddTask onCloseTask={onCloseAddTask} onAddTask={onAddTask}/>}
			<TaskList tasks={filteredTask || []} onCompleteTask={onCompleteTask} 
			onDeleteTask={onDeleteTask}/>
		</div>
	)
}

export default TaskManager;