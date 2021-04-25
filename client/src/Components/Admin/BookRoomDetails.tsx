import { Component } from 'react';
import { formatDate, formatTime } from '../Common/formatDateTime'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    match: any,
    history: any
}

interface State {
    title: string,
    fromUser: string,
    roomName: string,
    date: string,
    startTime: string,
    endTime: string,
    reason: string,
    status: string,
    id: string,
    isLoad: boolean
}

//let bookingRoomData = new Map();

class BookRoomDetail extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            title: '',
            fromUser: '',
            roomName: '',
            date: '',
            startTime: '',
            endTime: '',
            reason: '',
            status: '',
            id: this.props.match.params.id,
            isLoad: false
        }
    }

    // UNSAFE_componentWillReceiveProps(nextProps: any) {
    //     this.setState({
    //         id: nextProps.match.params.id
    //     })
    // }

    componentDidMount() {
        // if (!this.state.isLoad) {
        this.viewDetailBookingRoom(this.state.id, location.search)
        // }
    }

    UNSAFE_componentWillReceiveProps(nextProps: any) {
        this.setState({
            id: nextProps.match.params.id
        })

        this.viewDetailBookingRoom(nextProps.match.params.id, nextProps.location.search)
    }

    viewDetailBookingRoom = (id: string, notiId: string) => {
        // bookingRoomData.clear();
        fetch(`http://localhost:5000/bookRoom/${id}${notiId}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {

                res.json().then((result) => {
                    //this.traverse(result)
                    // if(bookingRoomData){
                    this.setState({
                        title: 'Request to book room ' + result.roomName,
                        date: result.date,
                        roomName: result.roomName,
                        startTime: result.startTime,
                        endTime: result.endTime,
                        fromUser: result.userId,
                        reason: result.reason,
                        status: result.status,
                        isLoad: true
                    })
                    // }
                })
            }
            else {
                return res.json().then(result => {
                    console.log(result);
                });
            }
        }).catch(e => {
            console.log(e);

        });
    }

    acceptOrRejectBooking = (status: string) => {
        console.log(this.state.id);

        const now = new Date();
        const tempH = now.getHours().toString();
        const tempMin = (now.getMinutes() + 1) === 60 ? '0' : (now.getMinutes() + 1).toString();
        const hours = tempH.length === 2 ? tempH : '0' + tempH;
        const min = tempMin.length === 2 ? tempMin : '0' + tempMin;
        const tempM = (now.getMonth() + 1).toString();
        const tempD = now.getDate().toString();
        const year = now.getFullYear().toString();
        const month = tempM.length === 2 ? tempM : '0' + tempM;
        const date = tempD.length === 2 ? tempD : '0' + tempD;
        const time = hours.concat(min, '00', '000');
        const fullDate = year.concat(month, date);

        let roomBooking = {
            id: this.state.id,
            status: status,
            room: this.state.roomName,
            date: this.state.date,
            from: this.state.startTime,
            to: this.state.endTime,
            reason: this.state.reason,
            userId: this.state.fromUser
        }

        if (parseInt(fullDate) <= parseInt(this.state.date)) {
            if (parseInt(fullDate) === parseInt(this.state.date)) {
                if (parseInt(this.state.endTime) < parseInt(time)) {
                    toast.warning('Check your time');
                    return;
                }
                if (parseInt(this.state.startTime) < parseInt(time)) {
                    roomBooking.from = time;
                }
                fetch('http://localhost:5000/calendar/add', {
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(roomBooking)
                }).then(res => {
                    if (res.status === 200) {
                        toast.success(status + " successfully!");
                        this.props.history.push("/");
                    }
                    else {
                        return res.json().then(result => {
                            toast.warning(result);
                        })
                    }
                }).catch(e => {
                    toast.error(e);
                    console.log(e);
                });
            } else {
                fetch('http://localhost:5000/calendar/add', {
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(roomBooking)
                }).then(res => {
                    if (res.status === 200) {
                        toast.success(status + " successfully!");
                        this.props.history.push("/");
                    }
                    else {
                        return res.json().then(result => {
                            toast.warning(result);
                        })
                    }
                }).catch(e => {
                    toast.error(e);
                    console.log(e);
                });
            }
        } else {
            toast.warning('Check your time');
        }
    }

    onHandleBooking = (status: string) => {
        this.acceptOrRejectBooking(status);
    }
    // traverse(jsonObj: any) {
    //     if (jsonObj !== null && typeof jsonObj === "object") {
    //         Object.entries(jsonObj).forEach(([key, value]) => {
    //             // key is either an array index or object key
    //             bookingRoomData.set(key, value);
    //             this.traverse(value);

    //         });
    //     }
    //     else {
    //         // jsonObj is a number or string
    //     }
    // }


    render() {
        const { date, reason, fromUser, startTime, endTime, roomName, status, title } = this.state;
        return (
            <div className="content">
                <ToastContainer />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <form className="form-horizontal">
                                    <div className="card-header card-header-text" data-background-color="orange">
                                        <h4 className="card-title">Book Room Request</h4>
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
                                            <label className="col-sm-2 label-on-left">Time</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={formatDate(date) + ' ' + formatTime(startTime) + "-" + formatTime(endTime)} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Status</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" readOnly value={status} />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Reason</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={reason} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <button type="button" disabled={(status === "accepted" || status === "rejected" || status === "deleted") ? true : false} onClick={() => this.onHandleBooking('accepted')} className="btn btn-warning btn-fill">Accept</button>
                                        <button type="button" disabled={(status === "accepted" || status === "rejected" || status === "deleted") ? true : false} onClick={() => this.onHandleBooking('rejected')} className="btn btn-defalt btn-fill">Reject</button>
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
export default BookRoomDetail;
