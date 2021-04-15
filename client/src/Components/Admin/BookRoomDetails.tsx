import React, { ChangeEvent, Component } from 'react';
import message from '../../model/Message';
import moment from 'moment';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { title } from 'process';
import {formatDate, formatTime} from '../Common/formatDateTime'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    match: any
}

interface State {
    title: string,
    fromUser: string,
    roomName: string,
    date: string,
    time: string,
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
            time: '',
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

    componentDidMount(){
        // if (!this.state.isLoad) {
            this.viewDetailBookingRoom(this.state.id)
        // }
        
    }

    UNSAFE_componentWillReceiveProps(nextProps:any){
        this.setState({
            id:nextProps.match.params.id
        })
        this.viewDetailBookingRoom(nextProps.match.params.id)

    }

    viewDetailBookingRoom = (id: string) => {
        // bookingRoomData.clear();
        fetch(`http://localhost:5000/bookRoom/${id}`, {
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
                        title:'Request to book room ' + result.roomName,
                        date: formatDate(result.date),
                        roomName: result.roomName,
                        time: formatTime(result.startTime) + ' - ' + formatTime(result.endTime),
                        fromUser: result.userId,
                        reason: result.reason,
                        status: result.status,
                        isLoad: true
                    })
                    // }
                })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            throw Error(e)
        });
    }

    acceptOrRejectBooking = (status: string) => {
        console.log(this.state.id);
        
        var roomBooking = {
            id: this.state.id,
            status: status,
            roomName: this.state.roomName,
            date: this.state.date,
            time: this.state.time,
            userId:this.state.fromUser
        }
        fetch('http://localhost:5000/bookRoom/acceptOrRejectBooking', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(roomBooking)
        }).then(res => {
            if (res.status === 200) {
            toast.success(status+" successfully!");
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onHandleBooking = (status: string) => {
        this.acceptOrRejectBooking(status);
    }
    // traverse(jsonObj: any) {
    //     if (jsonObj !== null && typeof jsonObj == "object") {
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
        var { date, reason, fromUser, time, roomName, status, title } = this.state;
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
                                                <input type="text" className="form-control" value={title} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">From</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label"></label>
                                                <input type="text" className="form-control" value={fromUser} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">Room</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label"></label>
                                                <input type="text" className="form-control" value={roomName} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">Time</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label"></label>
                                                <input type="text" className="form-control" value={date + ' ' + time} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">Status</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label"></label>
                                                <input type="text" className="form-control" value={status} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <label className="col-sm-2 label-on-left">Reason</label>
                                        <div className="col-sm-10">
                                            <div className="form-group label-floating is-empty">
                                                <label className="control-label"></label>
                                                <input type="text" className="form-control" value={reason} disabled/>
                                                <span className="material-input"></span></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <button type="button" onClick={() => this.onHandleBooking('accepted')} className="btn btn-warning btn-fill">Accept</button>
                                    <button type="button" onClick={() => this.onHandleBooking('rejected')} className="btn btn-defalt btn-fill">Reject</button>
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
