import React, {useState} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import './App.css';
import Nav from "./components/Nav";
import Reimbursements from "./components/Reimbursements";
import Home from "./components/Home";
import Login from "./components/Login";
import {User} from "./models/user";

function App() {

    const [principal, setPrincipal] = useState<User>();

    return (
        <BrowserRouter>
            <Nav currentUser={principal} setCurrentUser={setPrincipal} />
            <Routes>
                <Route path="/reimbursements" element={<Reimbursements currentUser={principal} />} />
                <Route path="/home" element={<Home currentUser={principal}/>} />
                <Route path="/login" element={<Login currentUser={principal} setCurrentUser={setPrincipal} />} />
            </Routes>
        </BrowserRouter>
  );
}

export default App;
