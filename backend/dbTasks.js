import {pool} from './db.js';

export async function readTasks() {
    try {
        const result = [];
        const rows = await pool.query("SELECT * from tasks"); 
        if (rows) {
            const listTask = [];
            rows.forEach(t => {
                const {id, title, status, description, priority} = t;
                listTask.push({id, title, status, description, priority});
            });
            return listTask;
        }
        else return null;
    } catch (error) {
      console.error('readUsersFile error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

export async function getTasksByAuthor(author) {
    try { 
        const [rows, fields] = await pool.execute("SELECT id, title, status, " +
            "description, priority from tasks where author = :author",
        {author: author});
        if (rows) {
            const listTask = [];
            rows.forEach(t => {
                const {id, title, status, description, priority} = t;
                listTask.push({id, title, status, description, priority});
            });
            return listTask;
        }
        else return null;
    } catch (error) {
      console.error('getTasksByAuthor error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

function checkPriority(text){
	const HIGH_PATTERN = /(?<!Не)Срочно|(?<!Не)Важно|(?<!НЕ)Прежде всего|(?<!Не)срочно|(?<!Не)важно/i;
    const LOW_PATTERN = /Несрочно|Неважно|Непрежде всего|не срочно|не важно|не прежде всего/i;	
    if (HIGH_PATTERN.test(text))
        return 2;
    else if (LOW_PATTERN.test(text))
        return 0;
    else return 1;
}

export async function createTask(title, description, author) {
    try {
        const query = 'INSERT INTO tasks (title, description, ' +
            'author, priority) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query,
            [title, description, author, checkPriority(description.trim())]); 
        const newTask = {
            id: result.insertId.toString(),
            title: title.trim(),
            status: "В планах",
            description: description.trim(),           
            author: author,
            priority: checkPriority(description.trim())
        };
        return newTask;	
    } catch (error) {
      console.error('createTask error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }	
}

export async function exportTasks(tasks){
    let csv = "ID; Название; Описание; Статус; Приоритет\n";
    tasks.forEach(t => csv += `${t.id};${t.title};${t.description};${t.status};${t.priority}\n`);
        return csv;
}

export async function completeTaskById(id) {
    try {
        const query = "UPDATE tasks SET status='Выполнено' WHERE id = :id";        
        const [rows, fields] = await pool.execute(query, {id: id});
        if (rows) return true;
            else return false;    
    } catch (error) {
      console.error('completeTaskById error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

export async function deleteTaskById(id) {
    try {
        const query = "DELETE FROM tasks WHERE id = :id";        
        const [rows, fields] = await pool.execute(query, {id: id});
        if (rows) return true;
            else return false;    
    } catch (error) {
      console.error('deleteTaskById error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

export async function changePriority(id, direction){
    try {
        const query = 'SELECT priority FROM tasks WHERE id = :id';
        const [rows, fields] = await pool.execute(query, {id: id});        
        if (rows.length === 0) return null;
        let currentPriority = rows.map(row => row.priority);
        if (direction === 'up' && currentPriority < 3) {
            currentPriority++;
        } else if (direction === 'down' && currentPriority >= 0) {
            currentPriority--;
        } else {
            return res.status(400).json({ error: 'Приоритет уже на пределе' });
        }   
        await pool.query(
            'UPDATE tasks SET priority = ?, isPriorityManual = true WHERE id = ?',
            [currentPriority, id]
        );
        return currentPriority;             
       
    } catch (error) {
      console.error('changePriority error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;         
    }
}
