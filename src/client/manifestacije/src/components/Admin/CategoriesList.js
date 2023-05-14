import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";
import "./Admin.css";

const CategoriesList = () => {
    const [allCategories, setAllCategories] = useState([]);

    const [categoryDelete, setCategoryDelete] = useState(null);
    const [categoryEdit, setCategoryEdit] = useState(null);
    const [categoryView, setCategoryView] = useState(null);
    const shouldLog = useRef(true);


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
                    message={"Are you sure you want to delete this category?"}
                    onConfirm={handleDeleteCategory}
                    onCancel={cancelHandleDelete}
                />
            )}
            {categoryEdit && (
                <EditNameBox
                    message={"Are your sure u want to edit this category?"}
                    onConfirm={handleEditCategory}
                    onCancel={cancelHandleEdit}
                />
            )}
            {categoryView && (
                <ViewBox
                    message={"Category information"}
                    onCancel={cancelHandleView}
                    wholeData={categoryView}
                />
            )}
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allCategories.map((category) => (
                        <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>
                                <button onClick={() => confirmDelete(category)}>Delete category</button>
                            </td>
                            <td>
                                <button onClick={() => confirmEdit(category)}>Edit Category</button>
                            </td>
                            <td>
                                <button onClick={() => confirmView(category)}>Details of Category</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
export default CategoriesList;