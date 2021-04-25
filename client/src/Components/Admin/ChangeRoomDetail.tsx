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
    date: string,
    startTime: string,
    endTime: string,
    reason: string,
    currentRoon: string,
    newRoom: string,
    isDisableAcceptBtn: boolean,
    availableRooms: any[],
    calendarId: string,
    status?: string,
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
            calendarId: '',
            status: undefined,
        }
    }

    componentDidMount = async () => {
        // if (!this.state.isLoad) {

        const date = this.props.match.params.id?.split('~')[0];
        const id = this.props.match.params.id?.split('~')[1];
        const notiId = this.props.match.params.id?.split('~')[2];
        await this.setState({
            calendarId: id,
            date: date
        })
        this.viewDetailCalendar(this.state.calendarId, notiId)
        // }

    }

    UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
        let date = nextProps.match.params.id?.split('~')[0];
        let id = nextProps.match.params.id?.split('~')[1];
        const notiId = this.props.match.params.id?.split('~')[2];
        await this.setState({
            calendarId: id,
            date: date
        })
        this.viewDetailCalendar(this.state.calendarId, notiId)
    }

    viewDetailCalendar = (id: string, notiId: string) => {
        // bookingRoomData.clear();
        fetch(`http://localhost:5000/calendar/${id}?date=${this.state.date}&notiId=${notiId}`, {
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
                        date: result.date,
                        currentRoon: result.room,
                        startTime: result.from,
                        endTime: result.to,
                        fromUser: result.userId,
                        reason: result.reason,
                        status: result.status
                    })
                    // }
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e)
        });
    }

    loadAvailableRoom = () => {
        this.setState({
            newRoom: ''
        })
        const { date, startTime, endTime } = this.state;
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
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }
    onSelectNewRoom = async (newR: string) => {
        await this.setState({
            newRoom: newR
        })
        //validate button Booking
        const { title, fromUser, date, startTime, endTime, reason, currentRoon, newRoom } = this.state;
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

    onAcceptChangeRoom = () => {
        let changeRoom = {
            userId: this.state.fromUser,
            from: this.state.startTime,
            to: this.state.endTime,
            date: this.state.date,
            newRoom: this.state.newRoom,
            room: this.state.currentRoon,
            calendarId: this.state.calendarId,
        }
        fetch('http://localhost:5000/changeRoom/sendChangeRoomRequest', {
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
                this.props.history.push('/');
            }
            else {
                toast.error("Failed to accept change room")
            }
        }).catch(e => {
            console.log(e);
        });
    }
    render() {
        const { title, fromUser, date, startTime, endTime, reason, currentRoon, newRoom, isDisableAcceptBtn, availableRooms } = this.state;
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
                                                    <input type="text" className="form-control" value={formatDate(date) + ' ' + formatTime(startTime) + '-' + formatTime(endTime)} readOnly />
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
