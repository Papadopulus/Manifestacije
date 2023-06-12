import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";
import "./Admin.css";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CategoriesList = () => {
    const [allCategories, setAllCategories] = useState([]);

    const [categoryDelete, setCategoryDelete] = useState(null);
    const [categoryEdit, setCategoryEdit] = useState(null);
    const [categoryView, setCategoryView] = useState(null);
    const [categoryAdd,setCategoryAdd] = useState(null);
    const shouldLog = useRef(true);


    const confirmAdd = async (category) => {
        setCategoryAdd(category);
    }
    const cancelHandleAdd = () => {
        setCategoryAdd(null);
    }
    const confirmView = async (category) => {
        setCategoryView(category);
    }
    const cancelHandleView = () => {
        setCategoryView(null);
    }
    const confirmEdit = async (category) => {
        setCategoryEdit(category);
    }
    const cancelHandleEdit = () => {
        setCategoryEdit(null);
    }
    const confirmDelete = async (category) => {
        setCategoryDelete(category);
    }
    const cancelHandleDelete = () => {
        setCategoryDelete(null);
    }
    const getAllCategories = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/categories`, {headers: header})
        setAllCategories(response.data);
    }
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;

            getAllCategories();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])

    const handleAddCategory = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/categories`,payload, {headers: header})
        console.log(response.data);
        setAllCategories(prevState => [...prevState,response.data])
        setCategoryAdd(null);
    }
    const handleDeleteCategory = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/categories/${categoryDelete.id}`, {headers: header})
        getAllCategories();
        setCategoryDelete(null);
    }
    const handleEditCategory = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/categories/${categoryEdit.id}`, payload, {headers: header})
        const updatedCategory = response.data;
        const updatedCategoryList = allCategories.map(category => category.id === updatedCategory.id ? updatedCategory : category);
        setAllCategories(updatedCategoryList);
        setCategoryEdit(null);
    }
    return (
        <>
            {categoryDelete && (
                <UserDeleteBox
                    message={"Da li ste sigurni da zelite da obrisete kategoriju?"}
                    onConfirm={handleDeleteCategory}
                    onCancel={cancelHandleDelete}
                />
            )}
            {categoryEdit && (
                <EditNameBox
                    message={"Da li ste sigurni da zelite da izmenite kategoriju?"}
                    onConfirm={handleEditCategory}
                    onCancel={cancelHandleEdit}
                    name={categoryEdit.name}
                />
            )}
            {categoryView && (
                <ViewBox
                    message={"Informacije o kategoriji"}
                    onCancel={cancelHandleView}
                    wholeData={categoryView}
                />
            )}
            {categoryAdd && (
                <EditNameBox
                    message={"Da li ste sigurni da zelite da dodate kategoriju?"}
                    onCancel={cancelHandleAdd}
                    onConfirm={handleAddCategory}
                    fromAdd={true}
                />   
            )}
            {/*<div>*/}
            {/*<div>*/}
            {/*    <IconButton onClick={() => confirmAdd(1)}>*/}
            {/*        <AddCircleOutlineIcon sx={{ fontSize: 31 }}></AddCircleOutlineIcon>*/}
            {/*    </IconButton>*/}
            {/*</div>*/}
            <div className={"addItemDiv"}>
                {/*<IconButton onClick={() => confirmAdd(1)}>*/}
                {/*    <AddCircleOutlineIcon sx={{ fontSize: 31 }}></AddCircleOutlineIcon>*/}
                {/*</IconButton>*/}
                <button className={"addAnItem"} onClick={() => confirmAdd(1)}>
                    Dodaj kategoriju
                </button>
            </div>
                <table className={"onlyNameTable"}>
                    <thead>
                    <tr>
                        <th>Ime</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allCategories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>
                                <IconButton onClick={() => confirmDelete(category)} >
                                    <DeleteIcon sx={{ fontSize: 31 }}></DeleteIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmEdit(category)}>
                                    <EditIcon sx={{ fontSize: 30 }}></EditIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmView(category)}>
                                    <PersonIcon sx={{ fontSize: 32 }}></PersonIcon>
                                </IconButton>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            {/*</div>*/}
        </>
    )
}
export default CategoriesList;