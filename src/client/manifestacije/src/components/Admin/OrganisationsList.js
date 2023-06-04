import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";
import EditOrgBox from "../DialogBoxes/EditOrgBox";
import ViewBoxOrg from "../DialogBoxes/ViewBoxOrg";
import "./Admin.css";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
const CategoriesList = () => {
    const [allOrganisations, setAllOrganisations] = useState([]);

    const [organisationDelete, setOrganisationDelete] = useState(null);
    const [organisationEdit, setOrganisationEdit] = useState(null);
    const [organisationView, setOrganisationView] = useState(null);
    const [imagesOrg,setImagesOrg] = useState([]);
    
    const shouldLog = useRef(true);


    const confirmView = async (organisation) => {
        setOrganisationView(organisation);
    }
    const cancelHandleView = () => {
        setOrganisationView(null);
    }
    const confirmEdit = async (organisation) => {
        setOrganisationEdit(organisation);
    }
    const cancelHandleEdit = () => {
        setOrganisationEdit(null);
    }
    const confirmDelete = async (organisation) => {
        setOrganisationDelete(organisation);
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
                    // onConfirm={handleEditOrganisation}
                    onCancel={cancelHandleEdit}
                    desc={organisationEdit.description}
                    logo={organisationEdit.logoUrl}
                    website={organisationEdit.websiteUrl}
                    facebook={organisationEdit.facebookUrl}
                    instagram={organisationEdit.instagramUrl}
                    twiter={organisationEdit.twitterUrl}
                    youtube={organisationEdit.youtubeUrl}
                    linkedin={organisationEdit.linkedInUrl}
                    organisationEdit={organisationEdit}
                    allOrganisations={allOrganisations}
                    setAllOrganisations={setAllOrganisations}
                    setOrganisationEdit={setOrganisationEdit}
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
                                <IconButton onClick={() => confirmDelete(org)} >
                                    <DeleteIcon sx={{ fontSize: 31 }}></DeleteIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmEdit(org)}>
                                    <EditIcon sx={{ fontSize: 30 }}></EditIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmView(org)}>
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
export default CategoriesList;