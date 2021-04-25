import { Component } from 'react';
import MaterialTable from 'material-table';
import moment from 'moment';
import { formatDateTime } from "../Common/formatDateTime";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Props {
    history:any
}

interface State {
    requestList: any[]
}

const columns = [
    // { title: "Avatar", render: rowData => <Avataratar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.first_name} /> },
    { title: "Sender", field: "sender" },
    {
        title: "Request Type", field: "requestType",
        render: (rowData: any) => {
            return rowData.url?.includes("/bookRoomRequest/") ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
                rowData.url?.includes("/reportErrorRequest/") ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
                    <p style={{ color: "#B0B700", fontWeight: "bold" }}>Change Room Request</p>
        }
    },
    { title: "Content", field: "message" },
    {
        title: "Request Time", field: "sendAt",
        render: (rowData: any) => {
            return <small>{moment(formatDateTime(rowData.sendAt)).format('MMMM Do YYYY, h:mm:ss a')}</small>
        }
    },
    {
        title: "Read?", field: "isRead",
        render: (rowData: any) => {
            return rowData.isRead ? <span className="label label-default" style={{ padding: "3px 5px 3px 5px" }}>Yes</span> :
             <span className="label label-success" style={{ padding: "3px 5px 3px 5px" }}>no</span> 
               
        }
    },

]
class BannedList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            requestList: []
        }
    }

    componentDidMount() {
        this.getRequestList();
    }

    getRequestList = () => {
        fetch('http://localhost:5000/requestList', {
            credentials: "include",
            method: 'GET',
        }).then(async res => {
            try {
                if (res.ok) {
                    //set state   
                    await res.json().then(result => {
                        this.setState({
                            requestList: result
                        })

                    });

                } else {
                    res.json().then(result => {
                        console.log(result);
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }).catch(e => {
            console.log(e);
        });
    }

    deleteRequests = (data: any) => {
        if (data) {
            let deleteIDs: string = '';
            data.forEach((request: any) => {
                deleteIDs += request.id + ','
            });
            fetch('http://localhost:5000/requestList/delete?ids=' + deleteIDs, {
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                method: 'DELETE',
            }).then(res => {
                if (res.status === 200) {
                    return res.json().then((result: string[]) => {
                        console.log(result);

                        let requestList = this.state.requestList;

                        const newRequestList = requestList.filter(function (requestList) {
                            return result.filter(function (result) {
                                return result === requestList.id;
                            }).length === 0
                        });

                        this.setState({
                            requestList: newRequestList
                        })
                        toast.success("Delete request successfully.")

                    })
                }
                else {
                    toast.error("Failed to delete request.")
                }
            }).catch(e => {
                console.log(e);
            });

        }
    }
    onRedicrectToActionPage=(url:string)=>{
        this.props.history.push(url);
    }

    render() {
        return (

            <div className="content">
                <ToastContainer />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-content">

                                    <div className="material-datatables">
                                        <MaterialTable
                                            title="Notifications"
                                            onRowClick={(event, rowData) => this.onRedicrectToActionPage(rowData.url as string)}
                                            columns={columns}
                                            data={this.state.requestList}
                                            options={
                                                {
                                                    selection: true
                                                }
                                            }

                                            actions={[
                                                {
                                                    icon: 'delete',
                                                    tooltip: 'Delete',
                                                    onClick: (event, rowData) => this.deleteRequests(rowData),
                                                }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

            </div>

        )

    }
}
export default BannedList;
