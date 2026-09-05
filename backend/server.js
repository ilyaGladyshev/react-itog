import http from 'http';
import { URL } from 'url';
import { findUserBylogin, createUser, readUsers,
    readTasks, writeTasks, completeTaskById, getTasksByAuthor,
    createTask, deleteTaskById, exportTasks
 } from './jsonMoker.js';

function getRequestBody(req){
    return new Promise ((resolve, reject) => {
        let body = '';
        req.on('data', chunck => {
            body += chunck.toString();
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(new Error('Невалидный JSON в запросе'));
            }
        });
        req.on('error', err => reject(err));
    });
}

const server = http.createServer(async (req, res) =>{
    const jsonHeader = { 'Content-Type': 'application/json; charset=utf-8'};
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    try {
    
        if (req.method === 'POST' && pathname === '/api/check-user')  {
            const { login } = await getRequestBody(req);
            if (!login){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Логин не указан"}));
            }
            const user = await findUserBylogin(login);
            res.writeHead(200, jsonHeader);            
            if (user){
                return res.end(JSON.stringify({
                    status: 'exists',
                    user
                }));
            } else {
                return res.end(JSON.stringify({status: 'not_found',}));
            }
        } 
        else if (req.method === 'POST' && pathname === '/api/register'){
            const { login, firstName, lastName, middleName, dateBirth} = await getRequestBody(req);
            if (!login || !firstName || !lastname || !dateBirth){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Заполнены не все обязательные поля"}));
            }
            const existingUser = await findUserBylogin(login); 
            if (existingUser){
                res.writeHead(409, jsonHeader);
                return res.end(JSON.stringify({error: "Этот логин уже занят"}));
            }   
            const newUser = await createUser(login, firstName, lastName, middleName, dateBirth)
            res.writeHead(201, jsonHeader);
            return res.end(JSON.stringify({
                success: true,
                user: newUser
            }));      
        }
        else if (req.method === 'POST' && pathname === '/api/tasks'){
            const { author, title, description } = await getRequestBody(req);
            
            if (!title || !author){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Заполнены не все обязательные поля"}));
            }

            const newTask = await createTask(title, description, author);
            res.writeHead(201, jsonHeader);
            return res.end(JSON.stringify(newTask));      
        }
        
        else if (req.method === 'GET' && pathname === '/api/tasks/export'){
            const author = url.searchParams.get('author');        
            if (!author){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Не удалось определить автора"}));
            }
            const userTasks = await getTasksByAuthor(author);
            const csv = await exportTasks(userTasks);
            console.log(csv);
            res.writeHead(200, {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': 'attachment; filename="tasks_report.csv"' 
            });
            return res.end(csv);      
        }        
        else if (req.method === 'POST' && pathname === '/api/tasks/complete'){
            const { id } = await getRequestBody(req);
            
            if (!id){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Не указан ID задачи"}));
            }

            const success = await completeTaskById(id);
            if (success){
                res.writeHead(201, jsonHeader);
                return res.end(JSON.stringify({ success: true }));    
            } else{
                res.writeHead(404, jsonHeader);
                return res.end(JSON.stringify({ error: "Задача не найдена" }));                    
            }
  
        }   
         else if (req.method === 'POST' && pathname === '/api/tasks/delete'){
            const { id } = await getRequestBody(req);
            
            if (!id){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Не указан ID задачи"}));
            }

            const success = await deleteTaskById(id);
            if (success){
                res.writeHead(201, jsonHeader);
                return res.end(JSON.stringify({ success: true }));    
            } else{
                res.writeHead(404, jsonHeader);
                return res.end(JSON.stringify({ error: "Задача не найдена" }));                    
            }
  
        }               
        else if (req.method === 'GET' && pathname === '/api/users')  {
            const users = await readUsers();
            const logins = Object.keys(users);
            res.writeHead(200, jsonHeader);
            return res.end(JSON.stringify(logins));
        }
        else if (req.method === 'GET' && pathname === '/api/tasks')  {
            const author = url.searchParams.get('author');
            if (!author){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Не указан автор задач"}));
            }
            const userTasks = await getTasksByAuthor(author);
            res.writeHead(200, jsonHeader);
            return res.end(JSON.stringify(userTasks));
        }       
        else {
            res.writeHead(404, jsonHeader);
            return res.end(JSON.stringify({error: "Запрашиваемый адрес не существует"}));            
        }
    } catch (error) {
        console.log("Критическая ошибка сервера: " + error.message);
        res.writeHead(500, jsonHeader);
        return res.end(JSON.stringify({error: "Внутренняя ошибка сервера"}));       
    }
});
 
server.listen(5000, () => {
    console.log('Сервер запущен');
    console.log('Слушает запросы на порту 5000');
    console.log("Текущая директория " + process.cwd())
})

