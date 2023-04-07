import { Button } from "@mui/material";
import { User } from "../models/user";

interface IReimbursementsProps{
    currentUser: User | undefined
}


export default function Reimbursements(props: IReimbursementsProps) {
    return (
        <p>Reimbursements table here!</p>
    );
}