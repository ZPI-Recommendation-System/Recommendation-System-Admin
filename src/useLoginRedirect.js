import { useNavigate } from "react-router-dom";
import * as React from 'react';

export default function useLoginRedirect(token) {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!token) {
          navigate('/login');
        }
    }, [token, navigate]);
}