export default interface message {
    sender: string,
    receiver: string,
    message: string,
    sendAt: Date,
    isRead: boolean
}