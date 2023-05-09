import {useEffect, useRef, useState} from "react";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";

const UsersList = () => {
    const [allUsers, setAllUsers] = useState([]);
    // const {user} = useContext(AuthContext);
    const shouldLog = useRef(true);
    const [deleteUser, setDeleteUser] = useState(null);
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
        setDeleteUser(user);
    };
    const handleCancelDeleteUser  = () => {
        setDeleteUser(null);
    };
    const handleDeleteUser  = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        // const confirmed = window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName} ${user.id}?`);

        // if (confirmed) {
            
            // Implement your code to delete the user here, for example:
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${deleteUser.id}`,{headers:header})
            
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {headers: header})

            setAllUsers(response.data);
        setDeleteUser(null);
        // }
    }
    console.log(allUsers);
    return (
        <>
            {deleteUser && (
                <UserDeleteBox
                    message={`Are you sure you want to delete ${deleteUser.firstName} ${deleteUser.lastName} ${deleteUser.id}?`}
                    onConfirm={handleDeleteUser}
                    onCancel={handleCancelDeleteUser}
                />
            )}
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allUsers.map((user) => (
                        
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.roles[0]}</td>
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