import React, { ChangeEvent, Component } from 'react';



interface Props {
    match: any
}

interface State {
    title: string,
    fromUser: string,
    roomName: string,
    description: string,
    deviceNames: string[],
    // status: string,
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
            // status: '',
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
                    this.setState({
                        roomName: result.roomName,
                        fromUser: result.userId,
                        description: result.description,
                        deviceNames: result.deviceNames,
                        // status: result.status,
                        title: "Report devices'error at room " + result.roomName,
                    })
                    // }
                })
                console.log(this.state);


            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            throw Error(e)
        });
    }

    acceptOrRejectReportError = (status: string) => {
        var roomBooking = {
            id: this.state.id,
            status: status,
            roomName: this.state.roomName,
            description: this.state.description,
            deviceNames: this.state.deviceNames,
        }
        fetch('http://localhost:5000/reportError/acceptOrRejectReportError', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(roomBooking)
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => { console.log(result) })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onHandleReportError = (status: string) => {
        this.acceptOrRejectReportError(status);
    }





    render() {
        var { title, fromUser, roomName, description, deviceNames } = this.state;
        return (
            <div className="content">
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
                                                    <input type="text" className="form-control" value={title} disabled />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">From</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={fromUser} disabled />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Room</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={roomName} disabled />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Description</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={description} disabled />
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
                                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                            </span>
                                                        )
                                                    })}
                                                </div>

                                            </div>

                                        </div>
                                        <div className="card-footer text-center">
                                            <button type="button" className="btn btn-warning btn-fill" onClick={() => this.onHandleReportError('accepted')}>Accept</button>
                                            <button type="button" className="btn btn-defalt btn-fill" onClick={() => this.onHandleReportError('rejected')}>Reject</button>
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
