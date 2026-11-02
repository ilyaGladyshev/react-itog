import {pool} from './db.js';
import bcryptjs from "bcryptjs";
import { generateToken } from './jwt.js';

async function hashPassword(password){
    if (!password) return '';
    return await bcryptjs.hash(password, 10);
}

export async function readUsers() {
    try {
        const ret = [];
        const [result, fields] = await pool.query("SELECT id, login, firstName, " + 
            "middleName, lastName, passwordHash, dateBirth from users"); 
        result.forEach(({id, login, firstName, middleName, lastName, dateBirth, passwordHash}) => {
            let userName;
            Object.values(login).map(l => userName = l);
            const user = {userName : {id, login, firstName, middleName, lastName, dateBirth, passwordHash}};
            ret.push(user);
        });
        return ret;
    } catch (error) {
      console.error('readUsersFile error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

export async function readLogins() {
    try {
        const ret = [];
        const [result, fields] = await pool.query("SELECT login from users"); 
        result.forEach((login) => ret.push(login));
        return ret;
    } catch (error) {
      console.error('readUsersFile error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;  
    }
}

export async function createUser(login, firstName, lastName, middleName, dateBirth, password){
    try {
        const lowerLogin = login.toLowerCase().trim();
        const passwordHash = await hashPassword(password);
        const query = 'INSERT INTO users (login, firstName, lastName, ' +
            'middleName, dateBirth, passwordHash) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await pool.execute(query,
            [lowerLogin, firstName, lastName, middleName, dateBirth, passwordHash]);  
        const token = generateToken({ id: result.insertId.toString(), login: login}); 
        return {
            id: result.insertId,
            login: login,
            firstName : firstName,
            lastName : lastName,
            middleName : middleName,
            dateBirth: dateBirth,
            token: token
        };      
    } catch (error) {
      console.error('createUser error: ', error)
      if (error.code === 'ENOENT') return null;
      throw error;          
    }
}

export async function findUserBylogin(login, password){
    try {
        const lowerLogin = login.toString().toLowerCase();
        const [rows, fields] = await pool.execute("SELECT id, login, firstName, " +
            "lastName, passwordHash, dateBirth from users where login = :lowerLogin LIMIT 1",
            {lowerLogin: lowerLogin});
        if (!rows.length) return {status: 'not_found', error: 'Пользователь не найден'};
        const {id, login, firstName, lastName, passwordHash, dateBirth} = rows[0];
        if (user){
            const currentHash = user.passwordHash;
            if (currentHash){
                const isMatch = await bcryptjs.compare(password, currentHash);
                if (isMatch) { 
                    const token = generateToken({ id}); 
                    return {status: 'success', 
                        user: {id, token, firstName, lastName, login, dateBirth}}
                    };
                }
            } else{
                return {status: 'wrong_password', error: 'Неверный пароль'};
            } 
        } catch (error) {
            console.error('findUserBylogin error: ', error);
            throw error;        
        }
}

export async function findUserByloginOnly(login){
    try {
        if (!login) return null;
        const lowerLogin = login.toString().toLowerCase();
        const [rows, fields] = await pool.execute("SELECT id, login, firstName, lastName, dateBirth from users where login = :lowerLogin LIMIT 1",
            {lowerLogin:lowerLogin});
        if (rows.length === 0)  return null;
        const {id, firstName, lastName, dateBirth} = rows[0];
        return {id, login, firstName, lastName, dateBirth}; 
    } catch (error) {
        console.error('findByUserOnlyError: ', error); 
        throw error;      
    }
}
  