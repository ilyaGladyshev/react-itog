import "./TaskList.css"

const TaskList = ({ tasks, onCompleteTask, onDeleteTask }) => {
	function getStringPriority(priority){
		if (priority === 2){
			return "Высокий";
		} else if (priority === 1){ 
			return "Средний";
		} else if (priority === 0){ 
			return "Низкий";
		}  			
	}

	if ((!tasks) || (tasks.length === 0)){
		return <p>У вас пока нет активных задач</p>
	}
	return (
		<div>
			<h4>Ваши задачи</h4>
			{tasks.map((task) => {
				const isDone = task.status === 'Выполнено';
				const isUrgent = task.priority === 2;
				const isMiddle = task.priority === 1;
				const isNonUrgent = task.priority === 0;
				return (
					<div key={task.id} className="task">
						<strong className={isDone ? "done-head" : "active-head"}>{task.title}</strong>
						{task.description && <p className="description">{task.description}</p>}
						<div className="status-container">
							<span className={isDone ? "done-span" : "active-span"}>{task.status}</span>
							{isUrgent && <span className="urgent-span">Приоритет: {getStringPriority(task.priority)}</span>}					
							{isMiddle && <span className="middle-span">Приоритет: {getStringPriority(task.priority)}</span>}	
							{isNonUrgent && <span className="non-urgent-span">Приоритет: {getStringPriority(task.priority)}</span>}							
						</div>
						{!isDone && (
							<button onClick={() => onCompleteTask(task.id)}>
								Готово
							</button>						
						)
						}
						<button className="delete" onClick={() => onDeleteTask(task.id)}>
							Удалить
						</button>	
					</div>
				)
			})
			}
		</div>
	)
	/*return (
		<div>
		{
			tasks.map((task, index) => {
				return (
				<div key={index}>
					<p>{index + 1}</p>
					<p>Имя исполнителя - {task.name}</p>
					<p>Фамилия исполнителя - {task.surname}</p>
					<p>Отчество исполнителя - {task.lastname}</p>
				</div>
				)
			})}
		</div>
	)*/
}


export default TaskList;