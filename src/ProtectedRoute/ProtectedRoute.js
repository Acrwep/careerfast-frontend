import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
    const navigate = useNavigate();
    const [roleId, setRoleId] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("loginDetails");
            if (stored) {
                const loginDetails = JSON.parse(stored);
                setRoleId(loginDetails.role_id);
            }
        } catch (error) {
            console.error("Invalid JSON in localStorage", error);
        }
    }, []);

    useEffect(() => {
        if (roleId !== null && !allowedRoles.includes(roleId)) {
            navigate("/job-portal", { replace: true });
            message.error("Unauthorized access. This section is reserved for recruiter accounts only.");
        }
    }, [roleId, navigate, allowedRoles]);

    if (roleId === null) {
        return null;
    }

    return children;
};

export default ProtectedRoute;