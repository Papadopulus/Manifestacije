﻿import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";

const CategoriesList = () => {
    const [allLocations, setAllLocations] = useState([]);

    const [locationDelete, setLocationDelete] = useState(null);
    const [locationEdit, setLocationEdit] = useState(null);
    const [locationView, setLocationView] = useState(null);
    const shouldLog = useRef(true);


    const confirmView = async (category) => {
        setLocationView(category);
    }
    const cancelHandleView = () => {
        setLocationView(null);
    }
    const confirmEdit = async (category) => {
        setLocationEdit(category);
    }
    const cancelHandleEdit = () => {
        setLocationEdit(null);
    }
    const confirmDelete = async (category) => {
        setLocationDelete(category);
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
    return (
        <>
            {locationDelete && (
                <UserDeleteBox
                    message={"Are you sure you want to delete this location?"}
                    onConfirm={handleDeleteLocation}
                    onCancel={cancelHandleDelete}
                />
            )}
            {locationEdit && (
                <EditNameBox
                    message={"Are your sure u want to edit this location?"}
                    onConfirm={handleEditLocation}
                    onCancel={cancelHandleEdit}
                />
            )}
            {locationView && (
                <ViewBox
                    message={"Location information"}
                    onCancel={cancelHandleView}
                    wholeData={locationView}
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
                    {allLocations.map((location) => (
                        <tr key={location.id}>
                            <td>{location.name}</td>
                            <td>
                                <button onClick={() => confirmDelete(location)}>Delete Location</button>
                            </td>
                            <td>
                                <button onClick={() => confirmEdit(location)}>Edit Location</button>
                            </td>
                            <td>
                                <button onClick={() => confirmView(location)}>Details of Location</button>
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