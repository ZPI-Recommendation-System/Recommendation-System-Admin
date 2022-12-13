import {useNavigate} from "react-router-dom";
import * as React from 'react';

export default function useLoginRedirect(token) {
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log(!token)
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);
}
