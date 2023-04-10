import { User } from "../models/user";
import {Navigate} from "react-router-dom";

interface IHomeProps {
    currentUser: User | undefined
}
export default function Home(props: IHomeProps){
    console.log(props.currentUser);
    return (
        props.currentUser ?
            <>
                <p>{props.currentUser.name} \n</p>
                <p>Welcome to Revature Reimbursements {props.currentUser.name}! </p>
            </>
            :
            <>
                <Navigate to="/login"/>
            </>

    )
}