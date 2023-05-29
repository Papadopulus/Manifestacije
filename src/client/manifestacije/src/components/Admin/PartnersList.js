import {useEffect, useRef, useState} from "react";
import checkTokenAndRefresh from "../../shared/tokenCheck";
import axios from "axios";
import UserDeleteBox from "../DialogBoxes/UserDeleteBox";
import EditNameBox from "../DialogBoxes/EditNameBox";
import ViewBox from "../DialogBoxes/ViewBox";
import EditPartnerBox from "../DialogBoxes/EditPartnerBox";
import ViewPartnerBox from "../DialogBoxes/ViewPartnerBox";
import "./Admin.css";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
const CategoriesList = () => {
    const [allPartners, setAllPartners] = useState([]);

    const [partnerDelete, setPartnerDelete] = useState(null);
    const [partnerEdit, setPartnerEdit] = useState(null);
    const [partnerView, setPartnerView] = useState(null);
    const shouldLog = useRef(true);


    const confirmView = async (category) => {
        setPartnerView(category);
    }
    const cancelHandleView = () => {
        setPartnerView(null);
    }
    const confirmEdit = async (category) => {
        setPartnerEdit(category);
    }
    const cancelHandleEdit = () => {
        setPartnerEdit(null);
    }
    const confirmDelete = async (category) => {
        setPartnerDelete(category);
    }
    const cancelHandleDelete = () => {
        setPartnerDelete(null);
    }
    const getAllPartners = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/partners`, {headers: header})
        setAllPartners(response.data);
    }
    useEffect(() => {
        if (shouldLog.current) {
            shouldLog.current = false;

            getAllPartners();
        }
        return () => {
            shouldLog.current = false;
        }
    }, [])

    const handleDeletePartner = async () => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        await axios.delete(`${process.env.REACT_APP_BASE_URL}/partners/${partnerDelete.id}`, {headers: header})
        getAllPartners();
        setPartnerDelete(null);
    }
    const handleEditPartner = async (payload) => {
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/partners/${partnerEdit.id}`, payload, {headers: header})
        const updatedPartner = response.data;
        const updatedPartnerList = allPartners.map(partner => partner.id === updatedPartner.id ? updatedPartner : partner);
        setAllPartners(updatedPartnerList);
        setPartnerEdit(null);
    }
    return (
        <>
            {partnerDelete && (
                <UserDeleteBox
                    message={"Are you sure you want to delete this partner?"}
                    onConfirm={handleDeletePartner}
                    onCancel={cancelHandleDelete}
                />
            )}
            {partnerEdit && (
                <EditPartnerBox
                    message={"Are your sure u want to edit this partner?"}
                    onConfirm={handleEditPartner}
                    onCancel={cancelHandleEdit}
                />
            )}
            {partnerView && (
                <ViewPartnerBox
                    message={"Partner information"}
                    onCancel={cancelHandleView}
                    wholeData={partnerView}
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
                    {allPartners.map((partner) => (
                        <tr key={partner.id}>
                            <td>{partner.name}</td>
                            <td>
                                <IconButton onClick={() => confirmDelete(partner)} >
                                    <DeleteIcon sx={{ fontSize: 31 }}></DeleteIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmEdit(partner)}>
                                    <EditIcon sx={{ fontSize: 30 }}></EditIcon>
                                </IconButton>
                            </td>
                            <td>
                                <IconButton onClick={() => confirmView(partner)}>
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