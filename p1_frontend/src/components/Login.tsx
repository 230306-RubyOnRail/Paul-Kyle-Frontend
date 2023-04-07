import { SyntheticEvent, useState } from "react";
import { User } from "../models/user";
import { Navigate } from "react-router-dom";

interface ILoginProps{
    currentUser: User | undefined,
    setCurrentUser: (nextUser: User) => void
}

export default function Login(props: ILoginProps){
    return (
        <p>TODO: Login page here!</p>
    );
}