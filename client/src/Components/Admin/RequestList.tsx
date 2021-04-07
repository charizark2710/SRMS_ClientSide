import React, { ChangeEvent, Component } from 'react';
import message from "../../model/Message";
import MaterialTable from 'material-table';



interface Props {

}

interface State {
    requestList: any[]
}
var columns = [
    // { title: "Avatar", render: rowData => <Avataratar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.first_name} /> },
    { title: "Account", field: "sender" },
    { title: "Type Request", field: "typeRequest" },
    { title: "Content", field: "message" },
    { title: "Sent Time", field: "sendAt" },
    { title: "Solve?", field: "status" },
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
                        throw Error(result);
                    });
                }
            } catch (error) {
                throw Error(error);
            }
        }).catch(e => {
            throw Error(e);
        });
    }

    deleteRequests = (data: any) => {
        if (data) {
            var deleteIDs: string='';
            data.forEach((request: any) => {
                deleteIDs+=request.id+','
            });
            fetch('http://localhost:5000/requestList/delete/'+deleteIDs, {
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                method: 'DELETE',
            }).then(res => {
                if (res.status === 200) {
                    return res.json().then((result:string[]) => 
                    {
                        console.log(result);

                        let requestList=this.state.requestList;

                        var newRequestList  = requestList.filter(function(requestList){
                            return result.filter(function(result){
                               return result === requestList.id;
                            }).length == 0
                         });

                        this.setState({
                            requestList:newRequestList
                        })
                        console.log(newRequestList);
                        
                    })
                }
                else {
                    return res.json().then(result => { throw Error(result.error) });
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
                                <div className="card-header card-header-icon" data-background-color="orange" data-toggle="modal"
                                    data-target="#addBanModal">
                                    <i className="material-icons">library_add</i>
                                </div>
                                <div className="card-content">
                                    <h4 className="card-title">DataTables.net</h4>
                                    <div className="toolbar">
                                    </div>
                                    <div className="material-datatables">
                                        <MaterialTable

                                            columns={columns}
                                            data={this.state.requestList}
                                            options={
                                                {
                                                selection: true
                                                }
                                            }

                                            actions={[
                                                // {
                                                //     icon:'edit',
                                                //     tooltip:'Edit',
                                                //     onClick:(event, rowData)=>alert((rowData as bannedList).id)
                                                // },
                                                {
                                                    icon:'delete',
                                                    tooltip:'Delete',
                                                    onClick:(event, rowData)=>this.deleteRequests(rowData),
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
