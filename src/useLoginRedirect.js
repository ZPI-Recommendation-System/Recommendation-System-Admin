import {Redirect} from "react-router-dom";
import * as React from 'react';

export default function useLoginRedirect(token) {

    if(!token)
        return <Redirect to={"/login"}/>
    else
        return <></>
}
