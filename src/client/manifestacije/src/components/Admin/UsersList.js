import {useEffect, useRef, useState} from "react";
import axios from "axios";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditUserBox from "../DialogBoxes/EditUserBox";
import ViewUserBox from "../DialogBoxes/ViewUserBox";
import "./Admin.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import {IconButton} from '@mui/material';

const UsersList = () => {

    const [allUsers, setAllUsers] = useState([]);
    const shouldLog = useRef(true);
    const [deleteUser, setDeleteUser] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [viewUser, setViewUser] = useState(null);

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
    const handleCancelDeleteUser = () => {
        setDeleteUser(null);
    };


    const confirmEdits = async (user) => {
        setEditUser(user);
    }
    const handleCancelEditUser = () => {
        setEditUser(null);
    }

    const confirmViewUser = async (user) => {
        setViewUser(user);
    }
    const handleCancelViewUser = () => {
        setViewUser(null);
    }
    const handleDeleteUser = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/users/${deleteUser.id}`, {headers: header})
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`, {headers: header})
        setAllUsers(response.data);
        setDeleteUser(null);
    }
    const handleEditUser = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${editUser.id}`, payload, {headers: header})
        const updatedUser = response.data;
        const updatedUserList = allUsers.map(user => user.id === updatedUser.id ? updatedUser : user);
        setAllUsers(updatedUserList);
        console.log(response);
        setEditUser(null);
    }
    return (
        <>
            {deleteUser && (
                <UserDeleteBox
                    message={`Are you sure you want to delete ${deleteUser.firstName} ${deleteUser.lastName} ${deleteUser.id}?`}
                    onConfirm={handleDeleteUser}
                    onCancel={handleCancelDeleteUser}
                />
            )}
            {editUser && (
                <EditUserBox
                    message={`Confirm edits for the User ${editUser.firstName} ${editUser.lastName} ?`}
                    onConfirm={handleEditUser}
                    onCancel={handleCancelEditUser}
                />
            )}
            {viewUser && (
                <ViewUserBox
                    message={`User information`}
                    // onConfirm={handleViewUser}
                    onCancel={handleCancelViewUser}
                    wholeUser={viewUser}
                />

            )}
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
                    {allUsers
                        .filter((user) => user.roles[0] === "User")
                        .map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>

                            <td>
                                <IconButton onClick={() => confirmDelete(user)} >
                                    <DeleteIcon sx={{ fontSize: 30 }}></DeleteIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmEdits(user)}>
                                    <EditIcon sx={{ fontSize: 30 }}></EditIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmViewUser(user)}>
                                    <PersonIcon sx={{ fontSize: 32 }}></PersonIcon>
                                </IconButton>
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