import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import './App.css';
import Nav from "./components/Nav";
import Reimbursements from "./components/Reimbursements";
import Home from "./components/Home";
import Login from "./components/Login";
import {User} from "./models/user";
import EditReimbursement from "./components/EditReimbursement";
import CreateUser from "./components/CreateUser";

function App() {

    const [principal, setPrincipal] = useState<User>();
    const [reimbursementID, setReimbursementId] = useState<Number>();

    return (
        <BrowserRouter>
            <Nav currentUser={principal} setCurrentUser={setPrincipal} />
            <Routes>
                <Route path="/login" element={<Login currentUser={principal} setCurrentUser={setPrincipal} />} />
                <Route path="/home" element={<Home currentUser={principal}/>} />
                <Route path="/reimbursements" element={<Reimbursements currentUser={principal} setReimbursementID={setReimbursementId} />} />
                <Route path="/createuser" element={<CreateUser currentUser={principal} />} />
                <Route path="/editreimbursement" element={<EditReimbursement currentUser={principal} reimbursementID={reimbursementID} />} />
            </Routes>
        </BrowserRouter>
  );
}

export default App;
