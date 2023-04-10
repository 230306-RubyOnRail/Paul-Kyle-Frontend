import { User } from "../models/user";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import '../styles/Nav.css';

interface INavProps {
    currentUser: User | undefined,
    setCurrentUser: (nextUser: User | undefined) => void
}

export default function Nav(props: INavProps) {

    function logout() {
        props.setCurrentUser(undefined);
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Revature Reimbursements
                    </Typography>
                    {
                        props.currentUser ?
                            <>
                                <Button color="inherit"><Link className="link" to="/home">Home</Link></Button>
                            </>
                            :
                            <></>
                    }

                    {
                        props.currentUser ?
                            <>
                                <Button color="inherit"><Link className="link" to="/reimbursements">Reimbursements</Link></Button>
                                <Button color="inherit" onClick={logout}>Logout</Button>
                            </>
                            :
                            <>
                                <Button color="inherit"><Link className="link" to="/login">Login</Link></Button>
                            </>

                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}