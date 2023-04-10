import { User } from "../models/user";
import {Navigate} from "react-router-dom";

interface IHomeProps {
    currentUser: User | undefined
}
export default function Home(props: IHomeProps){
    return (
        props.currentUser ?
            <>
                <p>Welcome to Revature Reimbursements {props.currentUser.name}! </p>
            </>
            :
            <>
                <Navigate to="/login"/>
            </>

    )
}