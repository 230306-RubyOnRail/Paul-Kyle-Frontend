export interface ReimbursementRequest {
    id: number;
    personnel_id: number;
    request_amount: number;
    subject: string;
    request: string;
    status: number;
    manager_id: number;
    manager_comment: string;
}