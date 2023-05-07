﻿import {useContext, useEffect, useRef, useState} from "react";
import axios, {all} from "axios";
import AuthContext from "../../store/AuthContext";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import {Await} from "react-router-dom";

const UsersList = () => {
    const [allUsers, setAllUsers] = useState([]);
    const {user} = useContext(AuthContext);
    const shouldLog = useRef(true);
    //send refresh token
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;
            const getUsers = async () => {
                await checkTokenAndRefresh();
                let header = {
                    "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
                }
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {headers: header})
                
                setAllUsers(response.data);
               
            }
            getUsers();
            
            
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])
    const confirmDelete = async (user) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const confirmed = window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName} ${user.id}?`);

        if (confirmed) {
            
            // Implement your code to delete the user here, for example:
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${user.id}`,{headers:header})
            
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {headers: header})

            setAllUsers(response.data);
        }
    }
    console.log(allUsers);
    return (
        <>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allUsers.map((user) => (
                        
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={()=> confirmDelete(user)}>Delete User</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            
        </>
    )
}
export default UsersList;