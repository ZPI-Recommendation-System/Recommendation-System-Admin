import {redirect, useNavigate} from "react-router-dom";
import * as React from 'react';

export default function useLoginRedirect(token) {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!token) {
            redirect('/login');
        }
    }, [token, navigate]);
}
