import React, { ChangeEvent, Component } from 'react';
import message from '../../model/Message';
import moment from 'moment';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { title } from 'process';
import { formatDate, formatTime } from '../Common/formatDateTime'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
    match: any,
    history:any
}

interface State {
    title: string,
    fromUser: string,
    date: string,
    startTime: string,
    endTime: string,
    reason: string,
    currentRoon: string,
    newRoom: string,
    isDisableAcceptBtn: boolean,
    availableRooms: any[],
    calendarId: string,
}

//let bookingRoomData = new Map();

class ChangeRoomDetail extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            title: '',
            fromUser: '',
            date: '',
            startTime: '',
            endTime: '',
            reason: '',
            currentRoon: '',
            newRoom: '',
            isDisableAcceptBtn: true,
            availableRooms: [],
            calendarId: ''
        }
    }

    componentDidMount =async()=> {
        // if (!this.state.isLoad) {

        let date = this.props.match.params.id?.split('~')[0];
        let id = this.props.match.params.id?.split('~')[1];
        await this.setState({
            calendarId: id,
            date: date
        })
        this.viewDetailCalendar(this.state.calendarId)
        // }

    }

    UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
        let date = nextProps.match.params.id?.split('~')[0];
        let id = nextProps.match.params.id?.split('~')[1];
        await this.setState({
            calendarId: id,
            date: date
        })
        this.viewDetailCalendar(this.state.calendarId)

    }

    viewDetailCalendar = (id: string) => {
        // bookingRoomData.clear();
        fetch(`http://localhost:5000/calendar/${id}?date=${this.state.date}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {

                res.json().then((result) => {
                    //this.traverse(result)
                    console.log(result);
                    
                    this.setState({
                        title: 'Request to change room ' + result.room,
                        date: formatDate(result.date),
                        currentRoon: result.room,
                        startTime: formatTime(result.from),
                        endTime: formatTime(result.to),
                        fromUser: result.userId,
                        reason: result.reason
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

    // acceptOrRejectBooking = (status: string) => {
    //     console.log(this.state.id);

    //     var roomBooking = {
    //         id: this.state.id,
    //         status: status,
    //         roomName: this.state.roomName,
    //         date: this.state.date,
    //         time: this.state.time,
    //         userId:this.state.fromUser
    //     }
    //     fetch('http://localhost:5000/bookRoom/acceptOrRejectBooking', {
    //         credentials: 'include',
    //         headers: {
    //             'content-type': 'application/json',
    //         },
    //         method: 'PATCH',
    //         body: JSON.stringify(roomBooking)
    //     }).then(res => {
    //         if (res.status === 200) {
    //         toast.success(status+" successfully!");
    //         }
    //         else {
    //             return res.json().then(result => { throw Error(result.error) });
    //         }
    //     }).catch(e => {
    //         console.log(e);
    //     });
    // }

    // onHandleBooking = (status: string) => {
    //     this.acceptOrRejectBooking(status);
    // }
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
    loadAvailableRoom = () => {
        this.setState({
            newRoom: ''
        })
        var { date, startTime, endTime } = this.state;
        fetch(`http://localhost:5000/bookRoom/getAvailableRooms?date=${date}&startTime=${startTime}&endTime=${endTime}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.ok) {
                return res.json().then(result =>
                    this.setState({
                        availableRooms: result
                    })
                )
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }
    onSelectNewRoom = async(newRoom: string) => {
        await this.setState({
            newRoom: newRoom
        })
        //validate button Booking
        var {  title, fromUser, date, startTime, endTime, reason, currentRoon, newRoom} = this.state;
        if (title && fromUser && date && startTime && endTime && reason && currentRoon && newRoom) {
            this.setState({
                isDisableAcceptBtn: false
            })
        } else {
            this.setState({
                isDisableAcceptBtn: true
            })
        }

    }

    onAcceptChangeRoom=()=>{
        let changeRoom={
            userId:this.state.fromUser,
            from:this.state.startTime,
            to:this.state.endTime,
            date:this.state.date,
            newRoom:this.state.newRoom,
            room:this.state.currentRoon,
            calendarId:this.state.calendarId,
        }
        fetch('http://localhost:5000/changeRoom/acceptChangeRoomRequest', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(changeRoom)
        }).then(res => {
            if (res.status === 200) {
               
                //thông báo đặt phòng thành công
                toast.success('Accept change room request successfully.');
                this.props.history.back();

            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }
    render() {
        var { title, fromUser, date, startTime, endTime, reason, currentRoon, newRoom, isDisableAcceptBtn, availableRooms } = this.state;
        return (
            <div className="content">
                <ToastContainer />
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="form-horizontal">
                                    <div className="card-header card-header-text" data-background-color="orange">
                                        <h4 className="card-title">Change Room Request</h4>
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
                                            <label className="col-sm-2 label-on-left">Current Room</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={currentRoon} readOnly />
                                                    <span className="material-input"></span></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Time</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label"></label>
                                                    <input type="text" className="form-control" value={date + ' ' + startTime + '-' + endTime} readOnly />
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
                                        <div className="row">
                                            <label className="col-sm-2 label-on-left">Find available room</label>
                                            <div className="col-sm-10">
                                                <div className="form-group label-floating is-empty">
                                                    <button className="btn btn-warning" type="button" onClick={this.loadAvailableRoom}>
                                                        <i className="material-icons">autorenew</i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <label className="col-sm-2 label-on-left"></label>
                                            <div className="col-sm-10">
                                                <div className="select-changeroom-height">
                                                    {
                                                        availableRooms && availableRooms.map((room, index) => {
                                                            return (
                                                                <button key={index} type="button" className={this.state.newRoom === room ? "btn btn-warning" : "btn btn-success"} onClick={() => this.onSelectNewRoom(room)}>{room}</button>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-footer text-center">
                                        <button type="button" className="btn btn-warning btn-fill" disabled={isDisableAcceptBtn} onClick={this.onAcceptChangeRoom}>Accept</button>
                                        <button type="button" className="btn btn-default btn-fill" disabled={isDisableAcceptBtn} >Deny</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div >




        )

    }
}
export default ChangeRoomDetail;
