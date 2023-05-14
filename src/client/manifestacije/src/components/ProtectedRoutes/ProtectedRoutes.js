import {useContext} from "react";
import AuthContext from "../../store/AuthContext";
import { Navigate} from "react-router-dom";

const ProtectedRoutes = ({children,accessBy,allowedRoles}) => {
    const {user} = useContext(AuthContext);
    
    if (accessBy === "non-authenticated") {
        if (!user) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    } else if (accessBy === "authenticated") {
        if (user && (!allowedRoles || allowedRoles.includes(user.Roles))) {
            return children;
        } else {
            return <Navigate to="/" />;
        }
    } else if (allowedRoles && allowedRoles.includes(user.Roles)) {
        return children;
    } else {
        return <Navigate to="/" />;
    }
}
export default ProtectedRoutes;