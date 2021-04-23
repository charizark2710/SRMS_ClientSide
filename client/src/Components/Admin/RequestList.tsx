import { Component } from 'react';
import MaterialTable from 'material-table';
import moment from 'moment';
import { formatDateTime } from "../Common/formatDateTime";

interface Props {

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
            return rowData.url.includes("/bookRoomRequest/") ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
                rowData.url.includes("/reportErrorRequest/") ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
                    <p style={{ color: "#B0B700", fontWeight: "bold" }}>Change Room Request</p>
        }
    },
    { title: "Content", field: "message" },
    {
        title: "Request Time", field: "sendAt",
        render: (rowData: any) => {
            console.log(rowData.sendAt?.split("-")[1]);

            return <small>{moment(formatDateTime(rowData.sendAt)).format('MMMM Do YYYY, h:mm:ss a')}</small>
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
                        console.log(newRequestList);

                    })
                }
                else {
                    return res.json().then(result => { console.log(result.error) });
                }
            }).catch(e => {
                console.log(e);
            });

        }
    }

    render() {
        return (

            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <div className="card-content">

                                    <div className="material-datatables">
                                        <MaterialTable
                                            title="Notifications"
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
