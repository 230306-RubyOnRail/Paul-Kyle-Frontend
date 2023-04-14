import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { User } from "../models/user";
import { Personnel } from '../models/personnel';
import { authAppClient } from "../remote/authenticated-app-client";

interface ICreatUserProps {
    currentUser: User | undefined,
  }

export default function EditReimbursement(props: ICreatUserProps) {
  const [status, setStatus] = useState<number | null>(null);
  const[new_username, set_new_username] = useState<string>("");
  const[new_pass, set_new_pass] = useState<string>("");
  const[new_name, set_new_name] = useState<string>("");
  const[new_title, set_new_title] = useState<string>("");


function handleCreate() {
  let update_user: Personnel = {
    username: new_username,
    pass: new_pass,
    name: new_name,
    title: new_title
}
CreateUser(update_user);
}




  async function CreateUser(props: Personnel) {
    try {
      const response = await authAppClient.post<Personnel>(
        'http://localhost:3000/personnel', props
      );
      setStatus(response.status);
    } catch (error) {
      console.error('Error creating user:', error);
      setStatus(null);
    }
  }

  function Edit() {
    return (
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
            id="username"
            label="Username"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set_new_username(e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="pass"
            label="User Password"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set_new_pass(e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="First and Last Name"
            label="Name"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set_new_name(e.target.value)}
          />
        </div>
        <div>
          <TextField
            id="title"
            label="User Role"
            InputLabelProps={{ shrink: true }}
            onChange={(e) => set_new_title(e.target.value)}
          />
        </div>
      </Box>
    )
  }

  

 return (
    props.currentUser ? 
    <div style={{padding: "20px"}}> 
      {Edit()}
      <Button variant="contained" color="primary" component={Link} to="/home" onClick={handleCreate}>
          Create User
        </Button>
    </div >
    :
    <Navigate to="/login"/>
  );
}