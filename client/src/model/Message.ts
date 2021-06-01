export default interface message {
    id:string,
    sender: string,
    receiver: string,
    message: string,
    sendAt: string,
    isRead: boolean,
    status:string,
    typeRequest:string,
    url?:string,
    isValid?:boolean,
    userId?:string
}