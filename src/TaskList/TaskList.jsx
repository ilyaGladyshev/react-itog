import "./TaskList.css"

const TaskList = ({ tasks, onCompleteTask, onDeleteTask, onPriorityChange }) => {
	function getStringPriority(priority){
		if (priority === 2){
			return "Высокий";
		} else if (priority === 1){ 
			return "Средний";
		} else if (priority === 0){ 
			return "Низкий";
		}  			
	}

    async function handlePriorityUpdate(id, direction){
        try {
			const token = localStorage.getItem('token');	
            const response = await fetch(`/api/tasks/priority`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
						   'Authorization': `Bearer ${token}`,
				 },
                body: JSON.stringify({ id, direction })
            });
            
            if (response.ok) {
                const data = await response.json();
                onPriorityChange(id, data.newPriority);
            }
        } catch (error) {
            console.error('Не удалось изменить приоритет', error);
        }
    };

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
						<div className="priority-container">
							<button className="priority-button"
									onClick={() => handlePriorityUpdate(task.id, 'up')} 
									disabled={task.priority === 2}>▲</button>
							<button className="priority-button"
									onClick={() => handlePriorityUpdate(task.id, 'down')} 
									disabled={task.priority === 0}>▼</button>
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
}


export default TaskList;