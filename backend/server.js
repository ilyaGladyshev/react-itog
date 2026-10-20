import http from 'http';
import { URL } from 'url';
import { verifyToken } from './jwt.js';
import dotenv from 'dotenv';
import { findUserBylogin, findUserByloginOnly, createUser, readUsers,
    readTasks, writeTasks, completeTaskById, getTasksByAuthor,
    createTask, deleteTaskById, exportTasks
 } from './jsonMoker.js';
import { Console } from 'console';

dotenv.config();

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
    
        if (req.method === 'POST' && pathname === '/api/auth/check-user')  {
            const { login, password } = await getRequestBody(req);
            if (!login){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({response: {status: 'not_found', error: "Логин не указан"}}));
            }
            if (!password){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({response: {status: 'wrong_password', error: "Пароль не указан"}}));
            }
            const response = await findUserBylogin(login, password);
            res.writeHead(200, jsonHeader);            
            if (response.status === 'exists'){
                return res.end(JSON.stringify({
                    response
                }));
            } else {
                return res.end(JSON.stringify({response}));
            }
        } else if (req.method === 'GET' && pathname === '/api/auth/users')  {
            const users = await readUsers();
            const logins = Object.keys(users);
            res.writeHead(200, jsonHeader);
            return res.end(JSON.stringify(logins));
        } else if (req.method === 'GET' && pathname === '/api/auth/me')  {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Токен невалиден или просрочен"}));
            }           
            const user = await findUserByloginOnly(decodedUser.login);
            if (!user){
                res.writeHead(404, jsonHeader);
                return res.end(JSON.stringify({ error: "Пользователь не найден"}));
            }
            res.writeHead(200, jsonHeader);
            return res.end(JSON.stringify({status: 'success', user}));
        }  
        else if (req.method === 'POST' && pathname === '/api/auth/register'){
            const { login, firstName, lastName, middleName, dateBirth, password} = await getRequestBody(req);
            if (!login || !firstName || !lastName || !dateBirth){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Заполнены не все обязательные поля"}));
            }
            const existingUser = await findUserByloginOnly(login); 
            if (existingUser){
                res.writeHead(409, jsonHeader);
                return res.end(JSON.stringify({error: "Этот логин уже занят"}));
            }   
            const newUser = await createUser(login, firstName, lastName,
                 middleName, dateBirth, password);
            res.writeHead(201, jsonHeader);
            return res.end(JSON.stringify({
                success: true,
                user: newUser
            }));      
        }
        else if (req.method === 'POST' && pathname === '/api/tasks'){
            const { title, description } = await getRequestBody(req);
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Несанкционированный доступ или сессия истекла"}));
            }              
            if (!title){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({error: "Заполнены не все обязательные поля"}));
            }

            const newTask = await createTask(title, description, decodedUser.login);
            res.writeHead(201, jsonHeader);
            return res.end(JSON.stringify(newTask));      
        }
        
        else if (req.method === 'GET' && pathname === '/api/tasks/export'){
            
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Несанкционированный доступ или сессия истекла"}));
            }     
            const userTasks = await getTasksByAuthor(decodedUser.login);
            const csv = await exportTasks(userTasks);
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

            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Несанкционированный доступ или сессия истекла"}));
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

            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Несанкционированный доступ или сессия истекла"}));
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
        else if (req.method === 'GET' && pathname === '/api/tasks')  {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const decodedUser = verifyToken(token);
            if (!decodedUser){
                res.writeHead(400, jsonHeader);
                return res.end(JSON.stringify({ error: "Несанкционированный доступ или сессия истекла"}));
            }           
            const userTasks = await getTasksByAuthor(decodedUser.login);
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

