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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditLocationBox from "../DialogBoxes/EditLocationBox";
const CategoriesList = () => {
    const [allLocations, setAllLocations] = useState([]);

    const [locationDelete, setLocationDelete] = useState(null);
    const [locationEdit, setLocationEdit] = useState(null);
    const [locationView, setLocationView] = useState(null);
    const [locationAdd,setLocationAdd] = useState(null);
    const shouldLog = useRef(true);


    const confirmAdd = async (location) => {
        setLocationAdd(location);
    }
    const cancelAdd = () => {
        setLocationAdd(null);
    }
    const confirmView = async (location) => {
        setLocationView(location);
    }
    const cancelHandleView = () => {
        setLocationView(null);
    }
    const confirmEdit = async (location) => {
        setLocationEdit(location);
    }
    const cancelHandleEdit = () => {
        setLocationEdit(null);
    }
    const confirmDelete = async (location) => {
        setLocationDelete(location);
    }
    const cancelHandleDelete = () => {
        setLocationDelete(null);
    }
    const getAllLocations = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/locations`, {headers: header})
        setAllLocations(response.data);
    }
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;

            getAllLocations();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])
    const handleAddLocation = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/locations`,payload, {headers: header})
        console.log(response.data);
        setAllLocations(prevState => [...prevState,response.data])
        setLocationAdd(null);
    }

    const handleDeleteLocation = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/locations/${locationDelete.id}`, {headers: header})
        getAllLocations();
        setLocationDelete(null);
    }
    const handleEditLocation = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/locations/${locationEdit.id}`, payload, {headers: header})
        const updatedLocation = response.data;
        const updatedLocationsList = allLocations.map(location => location.id === updatedLocation.id ? updatedLocation : location);
        setAllLocations(updatedLocationsList);
        setLocationEdit(null);
    }
    console.log(locationEdit)
    return (
        <>
            {locationDelete && (
                <UserDeleteBox
                    message={"Da li ste sigurni da zelite da obrisete lokaciju?"}
                    onConfirm={handleDeleteLocation}
                    onCancel={cancelHandleDelete}
                />
            )}
            {locationEdit && (
                <EditLocationBox
                    message={"Da li ste sigurni da zelite da promenite lokaciju?"}
                    onConfirm={handleEditLocation}
                    onCancel={cancelHandleEdit}
                    name={locationEdit.name}
                />
            )}
            {locationView && (
                <ViewBox
                    message={"Informacije o lokaciji"}
                    onCancel={cancelHandleView}
                    wholeData={locationView}
                />
            )}
            {locationAdd && (
                <EditLocationBox
                    message={"Da li ste sigurni da zelite da dodate lokaciju?"}
                    onCancel={cancelAdd}
                    onConfirm={handleAddLocation}
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
                    Dodaj lokaciju
                </button>
            </div>
                <table className={"onlyNameTable"}>
                    <thead>
                    <tr>
                        <th>Ime</th>
                    </tr>
                    </thead>
                    <tbody>
                    {allLocations.map((location) => (
                        <tr key={location.id}>
                            <td>{location.name}</td>
                            <td>
                                <IconButton onClick={() => confirmDelete(location)} >
                                    <DeleteIcon sx={{ fontSize: 31 }}></DeleteIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmEdit(location)}>
                                    <EditIcon sx={{ fontSize: 30 }}></EditIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmView(location)}>
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