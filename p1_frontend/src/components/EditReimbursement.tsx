import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import React, {useEffect, useState} from "react";

import {User} from "../models/user";
import {Navigate} from "react-router-dom";
import {ReimbursementRequest} from "../models/reimbursement-request";
import {authAppClient} from "../remote/authenticated-app-client";



interface IEditReimbursementProps{
    currentUser: User | undefined,
    reimbursementID: Number | undefined
}

async function fetchReimbursementRequest(id: Number): Promise<ReimbursementRequest> {
    const response = await authAppClient.get<ReimbursementRequest>(`http://localhost:3000/reimbursement/${id}`);
    return response.data;
}

async function updateReimbursementRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
    const response = await authAppClient.put<ReimbursementRequest>(`http://localhost:3000/reimbursement/${request.id}`, request);
    return response.data;
}

export default function EditReimbursement(props: IEditReimbursementProps){
    const [reimbursementRequest, setReimbursementRequest] = useState<ReimbursementRequest>();
    const [new_request_amount, set_new_request_amount] = useState<number>(0.0);
    const[new_subject, set_new_subject] = useState<string>("");
    const[new_request, set_new_request] = useState<string>("");
    const[new_status, set_new_status] = useState<number>(0);
    const[new_manager_comment, set_new_manager_comment] = useState<string>("");

    useEffect(() => {
        async function getRequest() {
            setReimbursementRequest(await fetchReimbursementRequest(props.reimbursementID!));
            set_new_request_amount(reimbursementRequest!.request_amount);
            set_new_subject(reimbursementRequest!.subject);
            set_new_request(reimbursementRequest!.request);
            set_new_status(reimbursementRequest!.status);
            set_new_manager_comment(reimbursementRequest!.manager_comment);
        }
        getRequest().then();

    }, [props.reimbursementID]);
    //setReimbursementRequest();

    return (
        props.currentUser ?
            <>
                {chooseForm()}
                <Button color="primary" onClick={() => updateReimbursement()}>Update Reimbursement</Button>
            </>
            :
            <>
                <Navigate to="/login"/>
            </>
    )

    function updateRequest(){

    }

    function chooseForm(){
        if (props.currentUser?.user_title === "0"){
            return employeeEdit();
        } else if (props.currentUser?.user_title === "1"){
            return managerEdit();
        }
    }
    function employeeEdit(){
        return(
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '50ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField
                        id="Reimbursement ID"
                        label="Reimbursment ID"
                        InputLabelProps={{ shrink: true }}
                        defaultValue = {props.reimbursementID}
                        InputProps={{readOnly: true}}
                    />
                </div>
                <div>
                    <TextField
                        id = "Reimbursement From"
                        label = "Reimbursement From"
                        InputLabelProps={{ shrink: true }}
                        defaultValue = {props.currentUser!.name}
                        inputProps = {{readOnly: true}}
                    />
                </div>
                <div>
                    <TextField
                        id = "Amount Requested"
                        label = "Amount Requested"
                        InputLabelProps={{ shrink: true }}
                        defaultValue ={reimbursementRequest?.request_amount}
                        color="secondary"
                        variant="filled"

                        onChange={(e) => set_new_request_amount(Number(e.target.value) ?? 0.0)}
                    />
                </div>
                <div>
                    <TextField
                        id = "Reimbursement for"
                        label = "Reimbursement for"
                        InputLabelProps={{ shrink: true }}
                        defaultValue ={reimbursementRequest?.subject}
                        color="secondary"
                        variant="filled"

                        onChange={(e) => set_new_subject(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        id = "More Information"
                        label = "More Information"
                        InputLabelProps={{ shrink: true }}
                        defaultValue = {reimbursementRequest?.request}
                        color="secondary"
                        variant="filled"
                        multiline={true}
                        minRows={2}

                        onChange={(e) => set_new_request(e.target.value)}
                    />
                </div>
                <div>
                    <TextField
                        id = "Status"
                        label = "Status"
                        InputLabelProps={{ shrink: true }}
                        defaultValue ={reimbursementRequest?.status}
                        inputProps = {{readOnly:true}}
                    />
                </div>
                <div>
                    <TextField
                        id = "Manager ID"
                        label = "Manager ID"
                        InputLabelProps={{ shrink: true }}
                        defaultValue = {reimbursementRequest?.manager_id}
                        inputProps = {{readOnly:true}}
                    />
                </div>
                <div>
                    <TextField
                        id = "Manager Comment"
                        label = "Manager Comment"
                        InputLabelProps={{ shrink: true }}
                        defaultValue = {reimbursementRequest?.manager_comment}
                        inputProps = {{readOnly:true}}
                    />
                </div>
            </Box>
        )
    }

    function managerEdit(){
        return(
            <></>
        );
    }

    function updateReimbursement(){
        let updatedReimbursment: ReimbursementRequest = {
                id: reimbursementRequest!.id,
                personnel_id: reimbursementRequest!.personnel_id,
                request_amount: new_request_amount,
                subject: new_subject,
                request: new_request,
                status: new_status,
                manager_id: reimbursementRequest!.manager_id,
                manager_comment: new_manager_comment
            }
        console.log(updatedReimbursment);
    }

}

