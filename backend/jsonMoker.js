import fs from "fs/promises";
import path from "path"; 
import { fileURLToPath } from "url";

const _dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE_PATH = path.join(_dirname ,"users.json");
const TASKS_FILE_PATH = path.join(_dirname ,"tasks.json");
  
export async function readUsers() {
    try {
        const data = await fs.readFile(USERS_FILE_PATH, 'utf-8');
        return JSON.parse(data)
    } catch (error) {
        if (error.code === 'ENOENT'){
            console.log("Файл " + USERS_FILE_PATH + " не найден");
            return {};
        }   
        if (error instanceof SyntaxError){
            console.log("Ошибка в синтаксисе в файле JSON");
            return {};
        } 
        throw error; 
    }
}

export async function readTasks() {
    try {
        const data = await fs.readFile(TASKS_FILE_PATH, 'utf-8');
        return JSON.parse(data)
    } catch (error) {
        if (error.code === 'ENOENT'){
            console.log("Файл " + TASKS_FILE_PATH + " не найден");
            return {lastId : 0, tasks: []};
        }   
        if (error instanceof SyntaxError){
            console.log("Ошибка в синтаксисе в файле JSON");
            return {};
        } 
        throw error; 
    }
}

export async function writeUsers(usersObject) {
    try {
        const jsonString = JSON.stringify(usersObject, null, 4);
        await fs.writeFile(USERS_FILE_PATH, jsonString, 'utf-8');
        console.log('Пользователи успешно записаны!'); 
        return true;       
    } catch (error) {
        console.log("Не удалось записать пользователей в файл: " + error.message);
        return false;    
    }
}

export async function writeTasks(tasksObject) {
    try {
        const jsonString = JSON.stringify(tasksObject, null, 4);
        await fs.writeFile(TASKS_FILE_PATH, jsonString, 'utf-8');
        console.log('Запросы успешно записаны!'); 
        return true;       
    } catch (error) {
        console.log("Не удалось записать запросы в файл: " + error.message);
        return false;    
    }
}

export async function getTasksByAuthor(author) {
    const data = await readTasks();
    return data.tasks.filter(task => task.author === author.toLowerCase());
}

export async function findUserBylogin(login){
    if (!login) return null;
    const users = await readUsers();
    const lowerLogin = login.toString().toLowerCase();
    if (users[lowerLogin]){
        return { login: lowerLogin, ...users[lowerLogin]};
    }    
    return null;
}

export async function createUser(login, firstName, lastName, middleName, dateBirth) {
		const users = await readUsers();
        const lowerLogin = login.toLowerCase().trim();
		users[lowerLogin] = {
			firstName : firstName,
			lastName : lastName,
			middleName : middleName,
            dateBirth: dateBirth
		};
		await writeUsers(users);
        return {login: lowerLogin, ...users[lowerLogin]};		
}

function checkPriority(text){
	const HIGH_PATTERN = /(?<!Не)Срочно|(?<!Не)Важно|(?<!НЕ)Прежде всего|(?<!Не)срочно|(?<!Не)важно/i;
    const LOW_PATTERN = /Несрочно|Неважно|Непрежде всего|не срочно|не важно|не прежде всего/i;	
    console.log(HIGH_PATTERN.test(text));
    if (HIGH_PATTERN.test(text))
        return 2;
    else if (LOW_PATTERN.test(text))
        return 0;
    else return 1;
}

export async function createTask(title, description, author) {
        const data = await readTasks();
        data.lastId += 1;
		const newTask = {
            id: data.lastId,
            title: title.trim(),
            description: description.trim(),           
            status: "В планах",
            author: author.toLowerCase().trim(),
            priority: checkPriority(description.trim())
		};
        data.tasks.push(newTask);
		await writeTasks(data);
        return newTask;		
}

export async function exportTasks(tasks){
    let csv = "ID; Название; Описание; Статус; Приоритет\n";
    tasks.forEach(t => csv += `${t.id};${t.title};${t.description};${t.status};${t.priority}\n`);
        return csv;
}

export async function completeTaskById(id) {
    const data = await readTasks();
    const task = data.tasks.find(t => t.id === parseInt(id,10));
    console.log(task);
    if (task){
        task.status = "Выполнено";
        await writeTasks(data);
        return true;
    }
   return false;
}

export async function deleteTaskById(id) {
    const data = await readTasks();
    data.tasks = data.tasks.filter(t => t.id != parseInt(id,10));
    console.log(data.tasks);
    if (data.tasks){
        await writeTasks(data);
        return true;
    }
   return false;
}

