import React, {useState, useEffect} from "react";

const TaskList = ({tasks}) => {

	return (
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
	)
}

export default TaskList;