import React, { ChangeEvent, Component } from 'react';
import bannedList from "./../../model/BannedList";

interface Props {

}

interface State {
    bannedList: bannedList[]
    unbannedList: string[]
    selectedUserToBan: string[] 
}

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

    createScript() {
        var scripts = [


            //  "js/perfect-scrollbar.jquery.min.js",
            //    "js/moment.min.js", "js/jquery.select-bootstrap.js", "js/jquery.datatables.js",
            //    "js/fullcalendar.min.js",
            // "/js/jquery.select-bootstrap.js", 
            // "/js/jquery.tagsinput.js",
            "/customJS/loadLongTable.js"];

        for (var index = 0; index < scripts.length; ++index) {
            var script = document.createElement('script');
            script.src = scripts[index];
            // script.async = true;
            // script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }

   
    getBannedList = () => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/blackList/banned', {
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
                            this.createScript();

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
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/blackList/unbanned', {
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
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/blackList/banUser', {
            credentials: "include",
            method: 'PATCH',
            body:JSON.stringify(this.state.selectedUserToBan)
        }).then(async res => {
            try {
                if (res.ok) {
                    res.json().then(result => {
                        
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
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/blackList/unbanUser', {
            credentials: "include",
            method: 'PATCH',
            body: email
        }).then(async res => {
            try {
                if (res.ok) {
                    res.json().then(result => {
                        console.log(result);

                        const arr = this.state.bannedList;
                        const newArr = arr.filter(user => {
                            return user.email !== result
                        })

                        this.setState({
                            bannedList: newArr
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
        console.log(this.state.bannedList);

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
                                        <table id="longDatatables" className="table table-striped table-no-bordered table-hover" width="100%">
                                            <thead>
                                                <tr>
                                                    <th className="banned-width-40">Account</th>
                                                    <th className="banned-width-20">Role</th>
                                                    <th className="banned-width-30">Banned date</th>
                                                    <th className="banned-width-10 text-center">Unban</th>
                                                </tr>
                                            </thead>
                                            <tfoot>
                                                <tr>
                                                    <th className="banned-width-40">Account</th>
                                                    <th className="banned-width-20">Role</th>
                                                    <th className="banned-width-30">Banned date</th>
                                                    <th className="banned-width-10 text-center">Unban</th>
                                                </tr>
                                            </tfoot>
                                            <tbody>
                                                {this.state.bannedList.map((u, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{u.email}</td>
                                                            <td>{u.role}</td>
                                                            <td>{u.bannedAt}</td>
                                                            <td className="td-actions text-center">
                                                                <button type="button" className="btn btn-danger" data-original-title="" title="Unban" onClick={() => this.unbanUser(u.email)}>
                                                                    <i className="material-icons">close</i></button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}


                                            </tbody>
                                        </table>
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
                                                     this.state.unbannedList.map((email, i) =>
                                                     (<option key={i} value={email}>{email}</option>))
                                                }
                                            </select>
                                            
                                          
                                            

                                        </div>

                                    </div>
                                    <div className="footer text-center banned-pb-5">
                                        <a href="#pablo" className="btn btn-primary btn-round" onClick={()=>this.banUser()}>Ban</a>
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
