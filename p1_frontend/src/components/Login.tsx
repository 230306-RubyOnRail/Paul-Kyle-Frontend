import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

import { User } from "../models/user";
import { authenticate } from "../remote/services/session-service";

interface ILoginProps{
    currentUser: User | undefined,
    setCurrentUser: (nextUser: User) => void
}

export default function Login(props: ILoginProps){

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    let updateUserName = (e: SyntheticEvent) => {
        setUserName((e.target as HTMLInputElement).value);
    }

    let updatePassword = (e: SyntheticEvent) => {
        setPassword((e.target as HTMLInputElement).value);
    }

    let login = async() => {
        if (userName && password) {
            try {
                let response = await authenticate({userName, password});

                if (response.status === 201) {
                    let data: User = response.data;
                    props.setCurrentUser(data);
                    sessionStorage.setItem('token', data.token);
                } else {
                    setErrorMessage('Credentials invalid');
                }
            } catch (err) {
                setErrorMessage('Unable to connect to the API')
            }
        } else {
          setErrorMessage('Invalid input for email/password')
        }
    }

    return (
        props.currentUser ?
            <>
                <Navigate to="/home"/>
            </>
            :
            <>
                <p>Login to Revature Reimbursements app!</p>
                <div>
                    <input type="text" id="login-email" placeholder="Enter your email" onChange={updateUserName}/>
                    <br /><br />
                    <input type="text" id="login-password" placeholder="Enter your password" onChange={updatePassword}/>
                    <br /><br />
                    <button id="login-button" onClick={login}>Login</button>
                </div>
                <div>
                    {errorMessage}
                </div>
            </>
    );
}