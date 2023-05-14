import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";
import EditOrgBox from "../DialogBoxes/EditOrgBox";
import ViewBoxOrg from "../DialogBoxes/ViewBoxOrg";

const CategoriesList = () => {
    const [allOrganisations, setAllOrganisations] = useState([]);

    const [organisationDelete, setOrganisationDelete] = useState(null);
    const [organisationEdit, setOrganisationEdit] = useState(null);
    const [organisationView, setOrganisationView] = useState(null);
    const shouldLog = useRef(true);


    const confirmView = async (category) => {
        setOrganisationView(category);
    }
    const cancelHandleView = () => {
        setOrganisationView(null);
    }
    const confirmEdit = async (category) => {
        setOrganisationEdit(category);
    }
    const cancelHandleEdit = () => {
        setOrganisationEdit(null);
    }
    const confirmDelete = async (category) => {
        setOrganisationDelete(category);
    }
    const cancelHandleDelete = () => {
        setOrganisationDelete(null);
    }
    const getAllOrganisations = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/organizations`, {headers: header})
        setAllOrganisations(response.data);
    }
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;

            getAllOrganisations();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])

    const handleDeleteOrganisation = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/organizations/${organisationDelete.id}`, {headers: header})
        getAllOrganisations();
        setOrganisationDelete(null);
    }
    const handleEditOrganisation = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/organizations/${organisationEdit.id}`, payload, {headers: header})
        const updatedOrganisation = response.data;
        const updatedOranisationsList = allOrganisations.map(org => org.id === updatedOrganisation.id ? updatedOrganisation : org);
        setAllOrganisations(updatedOranisationsList);
        setOrganisationEdit(null);
    }
    return (
        <>
            {organisationDelete && (
                <UserDeleteBox
                    message={"Are you sure you want to delete this Organisation?"}
                    onConfirm={handleDeleteOrganisation}
                    onCancel={cancelHandleDelete}
                />
            )}
            {organisationEdit && (
                <EditOrgBox
                    message={"Are your sure u want to edit this Organisation?"}
                    onConfirm={handleEditOrganisation}
                    onCancel={cancelHandleEdit}
                />
            )}
            {organisationView && (
                <ViewBoxOrg
                    message={"Organisation information"}
                    onCancel={cancelHandleView}
                    wholeData={organisationView}
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
                    {allOrganisations.map((org) => (
                        <tr key={org.id}>
                            <td>{org.name}</td>
                            <td>
                                <button onClick={() => confirmDelete(org)}>Delete Organisation</button>
                            </td>
                            <td>
                                <button onClick={() => confirmEdit(org)}>Edit Organisation</button>
                            </td>
                            <td>
                                <button onClick={() => confirmView(org)}>Details of Organisation</button>
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