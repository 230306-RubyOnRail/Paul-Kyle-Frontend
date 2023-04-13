import { DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import {Link, Navigate} from "react-router-dom";

import {authAppClient} from "../remote/authenticated-app-client";
import { User } from "../models/user";
import { ReimbursementRequest} from "../models/reimbursement-request";


interface IReimbursementProps{
  currentUser: User | undefined,
  setReimbursementID: (newID: Number) => void
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: .1 , editable: false },
  { field: 'personnel_id', headerName: 'User ID', flex: .1, editable: false },
  { field: 'request_amount', headerName: 'Amount', flex: .1, editable: true },
  { field: 'subject', headerName: 'Subject', flex: .4, editable: true },
  { field: 'request', headerName: 'More Information', flex: .4, editable: true },
  { field: 'status', headerName: 'Status',  flex: .1, editable: true , type: "singleSelect",  valueOptions: [{ value: 0, label: 'Pending' },{ value: 1, label: 'Approved' },{ value: 2, label: 'Rejected' }]},
  { field: 'manager_id', headerName: 'Manager ID', flex: .1, editable: true },
  { field: 'manager_comment', headerName: 'Manager Comment',flex: .4, editable: true },
];

async function fetchReimbursementRequests(): Promise<ReimbursementRequest[]> {
  const response = await authAppClient.get<ReimbursementRequest[]>('http://localhost:3000/reimbursement');
  return response.data;
}

async function postReimbursementRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
  const response = await authAppClient.post<ReimbursementRequest>(`http://localhost:3000/reimbursement`, request);
  return response.data;
}

export default function Reimbursements(props: IReimbursementProps) {
  const [rows, setRows] = useState<ReimbursementRequest[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);


  useEffect(() => {
    async function fetchData() {
      const data = await fetchReimbursementRequests();
      setRows(data);
    }

    fetchData();
  }, []);

  const handleSelectionModelChange = (selectionModel: any) => {
    setSelectedId(selectionModel["id"]);
  };

  const handleDeleteClick = () => {
    authAppClient.delete(`http://localhost:3000/reimbursement/${selectedId}`)
      .then(res => {
        setRows(rows.filter(row => row.id !== selectedId));
      })
  };

  const onRowEditStop = (params: GridRowParams) => {
    console.log(params.row)
    const updatedRows = rows.map((row) => {
      if (row.id === params.id) {
        return { ...row, ...params.row };
      }
      return row;
    });
    setRows(updatedRows);
  };

  function handleUpdateClick(){
    props.setReimbursementID(selectedId!);
  }
  // const handleUpdateClick = () => {
  //   if (selectedId){
  //   updateReimbursementRequest(rows.filter(row => row.id === selectedId)[0])
  //     .then(res => {
  //       setRows(rows.filter(row => row.id !== selectedId).concat(res));
  //     })
  //   }
  // };

  const handleSubmitClick = () => {
    if (selectedId){
      postReimbursementRequest(rows.filter(row => row.id === selectedId)[0])
      .then(res => {
        setRows(rows.filter(row => row.id !== selectedId).concat(res));
      })
    }
  };
  
  const handleCreateRow = () => {
    console.log("this is the first problem")
    const newId = -1; 
    const newRow: ReimbursementRequest = {
      id: newId,
      personnel_id: props.currentUser!.user_id,
      request_amount: '0',
      subject: '',
      request: '',
      status: 0,
      manager_id: 0,
      manager_comment: ''
    };
    if (rows?.length)
      setRows([...rows, newRow]);
    else
      setRows([newRow]); 
  };

  function createNewReimbursement() {
    const new_reimbursement: ReimbursementRequest = {
      id: -1,
      personnel_id: props.currentUser!.user_id,
      request_amount: '0',
      subject: 'Update Subject',
      request: 'Update Information',
      status: 0,
      manager_id: 0,
      manager_comment: ''
    }
  }

  const clearClick = () => {
    setSelectedId(null)
  };

  return (
    props.currentUser ?
      <>
        <div style={{ height: 750 , width: '90%', padding: 20}}>

          {(props.currentUser!.user_title === "0") ?
            <>
              <p>{props.currentUser!.name}'s Reimbursements.</p>
              <Button variant="contained" color="primary" onClick={handleCreateRow}>Create Row</Button></>
            :
              <p>Reimbursements managed by {props.currentUser!.name}'s</p>
           }

          <DataGrid rows={rows} editMode='row' columns={columns} onRowEditStop ={onRowEditStop} disableColumnMenu  onRowClick = {handleSelectionModelChange} sortModel={[{field: 'id',sort: 'asc',}]} />
          <div>

            <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={handleSubmitClick}>Submit</Button>
            {selectedId ? <>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={handleDeleteClick}>Delete Reimbursement</Button>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={clearClick}>Clear Selection</Button>
              <Button style={{marginRight: "20px"}} variant="contained" color="primary" onClick={handleUpdateClick} component={Link} to="/editreimbursement" >Update</Button> </>
              : <>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Delete Reimbursement</Button>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Clear Selection</Button>
              <Button variant="contained" style={{backgroundColor: "#808080", marginRight: "20px"}}>Update</Button>  </>
            }
          </div>
        </div>
      </>
      :
      <>
        <Navigate to="/login"/>
      </>
  );
}
