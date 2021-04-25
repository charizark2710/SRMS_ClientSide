import React, { ChangeEvent, Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface Props {
    match: any,
    history:any
}

interface State {
    title: string,
    fromUser: string,
    roomName: string,
    description: string,
    deviceNames: string[],
    status: string,
    id: string,
}

//let bookingRoomData = new Map();

class ReportErrorDetail extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            title: '',
            fromUser: '',
            roomName: '',
            description: '',
            deviceNames: [],
            status: '',
            id: this.props.match.params.id,
        }
    }


    componentDidMount() {
        // if (!this.state.isLoad) {
        this.viewReportErrorDetail(this.state.id)
        // }
    }

    UNSAFE_componentWillReceiveProps(nextProps: any) {
        this.viewReportErrorDetail(nextProps.match.params.id)
    }

    reloadScript() {
        const loadTable = "/js/material-dashboard.js?v=1.2.1"
        const script = document.createElement('script');
        script.src = loadTable
        script.async = true;
        script.type = 'text/javascript';
        document.getElementsByTagName("body")[0].appendChild(script);
    }


    viewReportErrorDetail = (id: string) => {
        fetch(`http://localhost:5000/reportError/${id}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {

                res.json().then((result) => {
                    let deviceNames=result.deviceNames.split(" ");
                    this.setState({
                        roomName: result.roomName,
                        fromUser: result.userId,
                        description: result.description,
                        deviceNames: deviceNames,
                        status: result.status,
                        title: "Report devices'error at room " + result.roomName,
                    })
                    // }
                })
                console.log(this.state);


            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e)
        });
    }

    acceptOrRejectReportError = (status: string) => {
        const reportErr = {
            id: this.state.id,
            status: status,
            roomName: this.state.roomName,
            userId: this.state.fromUser,
        }
        fetch('http://localhost:5000/reportError/acceptOrRejectReportError', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(reportErr)
        }).then(res => {
            if (res.status === 200) {
                toast.success('Confirm report error request successfully.');
                this.props.history.push('/');
            }
            else {
                toast.error("Failed to Confirm report error request.")
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onHandleReportError = (status: string) => {
        this.acceptOrRejectReportError(status);
    }





    render() {
        const { title, fromUser, roomName, description, deviceNames, status } = this.state;
        return (
            <div className="content">
                 <ToastContainer />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <form method="get" action="/" className="form-horizontal">
                                    <div className="card-header card-header-text" data-background-color="orange">
                                        <h4 className="card-title">Report Error</h4>
                                    </div>
                                    <div className="card-content">
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Title</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={title} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">From</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={fromUser} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Room</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={roomName} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Status</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={status} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Description</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={description} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Devices</label>
                                            <div className="col-sm-10 reportErr-mt-20">
                                                <div className="checkbox checkbox-inline">
                                                    {deviceNames.map((device, index) => {
                                                        return (
                                                            <span key={index}>
                                                                <span  className="label label-danger reportDevice-pd">{device}</span>
                                                                &nbsp;&nbsp;
                                                            </span>
                                                        )
                                                    })}
                                                </div>

                                            </div>

                                        </div>
                                        <div className="card-footer text-center">
                                            <button type="button" disabled={status ==="confirmed"? true:false} className="btn btn-warning btn-fill" onClick={() => this.onHandleReportError('confirmed')}>Confirm</button>
                                        </div>

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
export default ReportErrorDetail;
