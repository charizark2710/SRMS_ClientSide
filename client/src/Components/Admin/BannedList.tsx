import React, { ChangeEvent, Component } from 'react';
import bannedList from "./../../model/BannedList";
import MaterialTable from 'material-table';
import Checkbox from '@material-ui/core/Checkbox';


interface Props {

}

interface State {
    bannedList: bannedList[]
    unbannedList: string[]
    selectedUserToBan: any[]
}
var columns = [
    // { title: "Avatar", render: rowData => <Avataratar maxInitials={1} size={40} round={true} name={rowData === undefined ? " " : rowData.first_name} /> },
    { title: "Account", field: "email" },
    { title: "Role", field: "role" },
    { title: "Banned Date", field: "bannedAt" },
]
class BannedList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            bannedList: [],
            unbannedList: [],
            selectedUserToBan: [],
        }
    }

    componentDidMount() {
        this.getUnbannedList();
        this.getBannedList();

    }


    getBannedList = () => {
        fetch('http://localhost:5000/users/banned', {
            credentials: "include",
            method: 'GET',
        }).then(async res => {
            try {
                if (res.ok) {
                    //set state   
                    await res.json().then(result => {
                        this.setState({
                            bannedList: result
                        })
                        if (this.state.bannedList) {
                            // this.createScript();

                        }
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


    getUnbannedList = () => {
        fetch('http://localhost:5000/users/unbanned', {
            credentials: "include",
            method: 'GET',
        }).then(res => {
            try {
                if (res.ok) {
                    //set state   
                    res.json().then(result => {
                        this.setState({
                            unbannedList: result
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

    banUser = () => {
        console.log(this.state.selectedUserToBan);
        fetch('http://localhost:5000/users/banUser', {
            credentials: "include",
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.selectedUserToBan)
        }).then(async res => {
            try {
                if (res.ok) {
                    res.json().then((result: bannedList[]) => {//nhung thang bi ban
                        let newBannedList = [...this.state.bannedList];
                        newBannedList.push(...result)

                        let unbanArr = this.state.unbannedList;


                        var newUbanArr = unbanArr.filter(function (unban_el) {
                            return result.filter(function (anotherOne_el) {
                                return anotherOne_el.email == unban_el;
                            }).length == 0
                        });

                        this.setState({
                            bannedList: newBannedList,
                            unbannedList: newUbanArr
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


    unbanUser = (email: string) => {
        if (!email) console.log('ddmmm');
        else
            fetch(`http://localhost:5000/users/unbanUser?id=${email}`, {
                credentials: "include",
                method: 'PATCH',
            }).then(async res => {
                try {
                    if (res.ok) {
                        res.json().then((result: string) => {
                            let arr = this.state.bannedList;
                            let newArr = arr.filter(user => {
                                return user.email !== result
                            })

                            let arrUnban = this.state.unbannedList;
                            arrUnban.push(result)

                            this.setState({
                                bannedList: newArr,
                                unbannedList: arrUnban
                            })

                            console.log(this.state);

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


    onHandleChangeBannedList = (event: any) => {
        var target = event.target;
        var name = target.name;
        var value = target.type == 'select-multiple' ? Array.from(target.selectedOptions, (option: any) => option.value) : target.value;
        this.setState({
            [name]: value
        } as Pick<State, keyof State>);

        console.log(this.state);
    }


    render() {
        console.log(this.state);

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
                                            data={this.state.bannedList}
                                            actions={[
                                                // {
                                                //     icon:'edit',
                                                //     tooltip:'Edit',
                                                //     onClick:(event, rowData)=>alert((rowData as bannedList).id)
                                                // },
                                                {
                                                    icon: 'delete',
                                                    tooltip: 'Unban',
                                                    onClick: (event, rowData) => this.unbanUser((rowData as bannedList).email)
                                                }
                                            ]}
                                        />

                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>



                {/* <!-- Add ban account Modal --> */}
                <div id="addBanModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h3 className="modal-title text-center">Ban account</h3>
                            </div>
                            <div className="modal-body">
                                <form className="form" method="" action="">

                                    <div className="card-content">

                                        <div className="form-group">
                                            {/* <select id="selectBannedList" className="selectpicker" data-style="select-with-transition" multiple title="Select account" data-size="7" onChange={this.onHandleChangeBannedList} value={this.state.selectedUserToBan}>
                                                <option disabled> Select account</option>
                                                {
                                                    // this.state.unbannedList.forEach((u) => {
                                                    //     const el = document.createElement("option");
                                                    //     el.text = u.email;
                                                    //     el.value = u.email;
                                                    //     document.getElementById("selectBannedList")?.appendChild(el);

                                                    // })

                                                    
                                                    this.state.unbannedList.map((h, i) =>
                                                        (<option key={i} value={h}>{h}</option>))

                                                }
                                            </select> */}

                                            <select className="form-control" multiple onChange={this.onHandleChangeBannedList} name="selectedUserToBan">
                                                {
                                                    this.state.unbannedList && this.state.unbannedList.map((mail, i) => {
                                                        var value = {
                                                            email: mail
                                                        }
                                                        return <option key={i} value={JSON.stringify(value)}>{mail}</option>
                                                    })

                                                }
                                            </select>




                                        </div>

                                    </div>
                                    <div className="footer text-center banned-pb-5">
                                        <a href="#pablo" className="btn btn-primary btn-round" onClick={() => this.banUser()}>Ban</a>
                                    </div>
                                </form>

                            </div>

                        </div>

                    </div>
                </div>

            </div>

        )

    }
}
export default BannedList;
