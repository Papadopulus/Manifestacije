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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {Button} from "../Navbar/NavButton"
const CategoriesList = () => {
    const [allPartners, setAllPartners] = useState([]);

    const [partnerDelete, setPartnerDelete] = useState(null);
    const [partnerEdit, setPartnerEdit] = useState(null);
    const [partnerView, setPartnerView] = useState(null);
    const[partnerAdd,setPartnerAdd] = useState(null);
    const shouldLog = useRef(true);


    const confirmAdd = async (partner) => {
        setPartnerAdd(partner);
    }
    const cancelAdd = () => {
        setPartnerAdd(null);
    }
    const confirmView = async (partner) => {
        setPartnerView(partner);
    }
    const cancelHandleView = () => {
        setPartnerView(null);
    }
    const confirmEdit = async (partner) => {
        setPartnerEdit(partner);
    }
    const cancelHandleEdit = () => {
        setPartnerEdit(null);
    }
    const confirmDelete = async (partner) => {
        setPartnerDelete(partner);
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

    const handleAddPartner = async (payload) => {
        console.log(payload);
        await checkTokenAndRefresh();
        let header = {
            "Authorization": `Bearer ${JSON.parse(localStorage.getItem("tokens")).token}`
        }
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/partners`, payload, {headers: header})
        setAllPartners(prevState => [...prevState,response.data]);
        setPartnerEdit(null);
    }
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
    console.log(partnerEdit);
    return (
        <>
            {partnerDelete && (
                <UserDeleteBox
                    message={"Da li ste sigurni da zalite da obrisete partnera?"}
                    onConfirm={handleDeletePartner}
                    onCancel={cancelHandleDelete}
                />
            )}
            {partnerEdit && (
                <EditPartnerBox
                    message={"Da li ste sigurni da zelite da izmenite partnera?"}
                    onConfirm={handleEditPartner}
                    onCancel={cancelHandleEdit}
                    partName={partnerEdit.name}
                    phoneNumber={partnerEdit.phoneNumber}
                    Accomodation={partnerEdit.isAccommodation}
                    Transport={partnerEdit.isTransport}
                />
            )}
            {partnerView && (
                <ViewPartnerBox
                    message={"Informacije o pertneru"}
                    onCancel={cancelHandleView}
                    wholeData={partnerView}
                />
            )}
            {partnerAdd && (
                <EditPartnerBox
                    message={"Da li zelite da dodate partnera?"}
                    onConfirm={handleAddPartner}
                    onCancel={cancelAdd}
                    fromAdd={true}
                />
            )}
            {/*<div>*/}
            <div className={"addItemDiv"}>
                {/*<IconButton onClick={() => confirmAdd(1)}>*/}
                {/*    <AddCircleOutlineIcon sx={{ fontSize: 31 }}></AddCircleOutlineIcon>*/}
                {/*</IconButton>*/}
                <button className={"addAnItem"} onClick={() => confirmAdd(1)}>
                    Dodaj partnera
                </button>
            </div>
                <table className={"onlyNameTable"}>
                    <thead>
                    <tr>
                        <th>Ime</th>
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
            {/*</div>*/}
        </>
    )
}
export default CategoriesList;