import { DataGrid, GridColDef, GridRowParams} from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';

import { User } from "../models/user";

interface ReimbursementRequest {
  id: number;
  personnel_id: number;
  request_amount: number;
  subject: string;
  request: string;
  status: number;
  manager_id?: number;
  manager_comment?: string;
}

interface IReimbursementProps{
  currentUser: User | undefined
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: .1 , editable: false },
  { field: 'personnel_id', headerName: 'User ID', flex: .1, editable: false },
  { field: 'request_amount', headerName: 'Amount', flex: .1, editable: true },
  { field: 'subject', headerName: 'Subject', flex: .4, editable: true },
  { field: 'request', headerName: 'Request', flex: .4, editable: true },
  { field: 'status', headerName: 'Status',  flex: .1, editable: false  },
  { field: 'manager_id', headerName: 'Manager ID', flex: .1, editable: true },
  { field: 'manager_comment', headerName: 'Manager Comment',flex: .4, editable: true },
];

async function fetchReimbursementRequests(): Promise<ReimbursementRequest[]> {
  const response = await axios.get<ReimbursementRequest[]>('http://localhost:3000/reimbursement');
  return response.data;
}

async function updateReimbursementRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
  const response = await axios.put<ReimbursementRequest>(`http://localhost:3000/reimbursement/${request.id}`, request);
  return response.data;
}

async function postReimbursementRequest(request: ReimbursementRequest): Promise<ReimbursementRequest> {
  const response = await axios.post<ReimbursementRequest>(`http://localhost:3000/reimbursement`, request);
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
    axios.delete(`http://localhost:3000/reimbursement/${selectedId}`)
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


  const handleUpdateClick = () => {
    if (selectedId){
    updateReimbursementRequest(rows.filter(row => row.id === selectedId)[0])
      .then(res => {
        setRows(rows.filter(row => row.id !== selectedId).concat(res));
      })
    }
  };

  const handleSubmitClick = () => {
    if (selectedId){
      postReimbursementRequest(rows.filter(row => row.id === selectedId)[0])
      .then(res => {
        setRows(rows.filter(row => row.id !== selectedId).concat(res));
      })
    }
  };
  
  const handleCreateRow = () => {
    const newId = -1; 
    const newRow: ReimbursementRequest = {
      id: newId,
      personnel_id: 0,
      request_amount: 0,
      subject: '',
      request: '',
      status: 0,
      manager_id: 0,
      manager_comment: ''
    };
    setRows([...rows, newRow]); 
  };

  const clearClick = () => {
    setSelectedId(null)
  };



  return (
    <div style={{ height: 900 , width: '90%', padding: 100}}>
      <Button variant="contained" color="primary" onClick={handleCreateRow}>Create Row</Button>
      <DataGrid rows={rows} editMode='row' columns={columns} onRowEditStop ={onRowEditStop} disableColumnMenu  onRowClick = {handleSelectionModelChange} sortModel={[{field: 'id',sort: 'asc',}]} />
      <div>
        <Button variant="contained" color="primary" onClick={handleDeleteClick}>Delete</Button>
        <Button variant="contained" color="primary" onClick={handleUpdateClick}>Update</Button>
        <Button variant="contained" color="primary" onClick={handleSubmitClick}>Submit</Button>
        <Button variant="contained" color="primary" onClick={clearClick}>Clear</Button>
      </div>
    </div>
  );
}
