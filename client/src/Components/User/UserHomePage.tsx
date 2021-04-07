import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client, db } from '../../FireBase/config';
import './UserHomePage.css';
import message from '../../model/Message';
import moment from 'moment';
import MaterialTable from 'material-table';
import Button from "@material-ui/core/Button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDateTime, formatTime, formatDate } from "../Common/formatDateTime";



interface Props {
    // propsFromLoginToUser: any
    history: any
}

interface State {
    //current user info
    currentUser: any

    //devices status
    lightOn: boolean,
    fanOn: boolean,
    conditionerOn: boolean,
    powerPlugOn: boolean,

    //checkbox turn on/off all devices
    isTurnOnAllDevices: boolean

    //form booking schedule
    txtDateToBook: string
    txtStartTime: string
    txtEndTime: string
    cbbRoomToBook: string
    txtReasonToBook: string
    isDisableBookingBtn: boolean
    isAgreeRuleBooking: boolean
    isAllowToLoadEmptyRooms: boolean
    isShowValidateLoadEmptyRoom: boolean
    //tracking update or insert
    isUpdateData: boolean
    updatingIdBooking: string

    //notification for user
    messageToUser: message[]

    //report error
    cbbDeviceToReport: string[]
    cbbRoomToReport: string
    txtDescriptionToReport: string


}


// var columns = [
//     { title: "ID", field: "id", hidden: true },
//     { title: "Title", field: "message" },
//     {
//         title: "Request Type", field: "typeRequest",
//         render: (rowData: message) => {
//             return rowData.typeRequest == "bookRoomRequest" ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
//                 rowData.typeRequest == "reportErrorRequest" ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
//                     <p style={{ color: "#B0B700", fontWeight: "bold" }}>Change Room Request</p>
//         }
//     },
//     {
//         title: "Reply Time", field: "sendAt",
//         render: (rowData: message) => {
//             return <small>{moment(rowData.sendAt).calendar()}</small>
//         }
//     },
//     {
//         title: "Status", field: "status",
//         render: (rowData: message) => {
//             return rowData.status == "accepted" ? <span className="label label-success" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
//                 rowData.status == "pending" ? <span className="label label-warning" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
//                     <span className="label label-default" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span>
//         }
//     },
//     { title: "Action custon", render: (data:message) => <button type="button" className="btn btn-danger" onClick={this.onGetValueToUpdateForm}>button</button>
//      },

// ]
class UserHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            // name: this.props.propsFromLoginToUser.name,
            // employeeId: this.props.propsFromLoginToUser.employeeId,
            currentUser: {},
            lightOn: false,
            fanOn: false,
            conditionerOn: false,
            powerPlugOn: false,

            isTurnOnAllDevices: false,

            txtDateToBook: '',
            txtStartTime: '',
            txtEndTime: '',
            cbbRoomToBook: '',
            txtReasonToBook: '',
            isDisableBookingBtn: true,
            isAgreeRuleBooking: false,
            isShowValidateLoadEmptyRoom: false,
            isAllowToLoadEmptyRooms: true,

            isUpdateData: false,
            updatingIdBooking: '',

            messageToUser: [],

            cbbDeviceToReport: [],
            cbbRoomToReport: '',
            txtDescriptionToReport: '',


        }

    }

    notification: message[] = [];

    createScript() {
        const scripts = ["js/jquery.tagsinput.js", "js/material-dashboard.js?v=1.2.1", "customJS/loadBackground.js"]//,"customJS/loadTable.js"

        for (let index = 0; index < scripts.length; ++index) {
            const script = document.createElement('script');
            script.src = scripts[index];
            script.async = true;
            script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }


    componentDidMount() {
        fetch('http://localhost:5000', {
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                client.auth().onAuthStateChanged(async user => {
                    if (user) {
                        const currentUser = {
                            name: user.displayName,
                            employeeId: user.email?.split('@')[0] || ' '
                        }

                        this.notificationManagement(user);
                        this.setState({
                            currentUser: currentUser
                        })
                        this.createScript();
                    }
                });
            }
        }).catch(e => {
            throw new Error(e);
        })
    }

    notiReady: boolean = false;

    notificationManagement = async (user: firebase.User) => {
        this.setState({ messageToUser: [] });
        const userEmail = user.email?.split('@')[0] || ' ';
        await db.ref('notification'.concat('/', userEmail)).limitToLast(100).on('child_added', snap => {
            if (this.notiReady) {
                const mail: message = snap.val();
                if (mail) {
                    this.setState({ messageToUser: [... this.state.messageToUser, mail] })
                }
            }
        });
        db.ref('notification'.concat('/', userEmail)).limitToLast(100).off('child_added', (snap) => {
            if (this.notiReady) {
                const mail: message = snap.val();
                if (mail) {
                    this.setState({ messageToUser: [... this.state.messageToUser, mail] })
                }
            }
        });
        db.ref('notification'.concat('/', userEmail)).on('child_changed', snap => {
            const mail: message = snap.val();
            const arr = this.state.messageToUser;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === mail.id) {
                    arr[i] = JSON.parse(JSON.stringify(mail));
                }
            }
            this.setState({ messageToUser: arr });
        });
        db.ref('notification'.concat('/', userEmail)).off('child_changed', (snap) => {
            const mail: message = snap.val();
            const arr = this.state.messageToUser;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === mail.id) {
                    arr[i] = JSON.parse(JSON.stringify(mail));
                }
            }
            this.setState({ messageToUser: arr });
        });

        db.ref('notification'.concat('/', userEmail)).on('child_removed', snap => {
            const mail: message = snap.val();
            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    return mess !== mail;
                })
                this.setState({ messageToUser: newArr });
            }
        });

        db.ref('notification'.concat('/', userEmail)).off('child_removed', snap => {
            const mail: message = snap.val();
            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    return mess !== mail;
                })
                this.setState({ messageToUser: newArr });
            }
        });

        db.ref('notification'.concat('/', userEmail)).once('value', snap => {
            const val = snap.val();
            if (val) {
                this.setState({ messageToUser: Object.values(val) });
                this.notification = Object.values(val);
                this.notiReady = true;
            }
        });
    }


    logout = () => {
        fetch('http://localhost:5000/logout', {
            credentials: "include",
            method: 'POST',
        }).then(async res => {
            try {
                if (res.ok) {
                    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
                    localStorage.clear();
                    firebase.auth().signOut();
                    this.props.history.push('/');
                    // this.props.history.go(1);
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

    //control devices
    onControlDevices = () => {
        var roomName = {
            roomName: '201'
        }
        fetch('http://localhost:5000/room/sendDevicesStatus', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(roomName)
        }).then(res => {
            if (res.status === 200) {

                res.json().then((result) => {
                    this.setState({
                        lightOn: result.light === 1 ? true : false,
                        fanOn: result.fan === 1 ? true : false,
                        powerPlugOn: result.powerPlug === 1 ? true : false,
                        conditionerOn: result.conditioner === 1 ? true : false,
                    })
                    if (this.state.lightOn && this.state.fanOn && this.state.powerPlugOn && this.state.conditionerOn) {
                        this.setState({
                            isTurnOnAllDevices: true
                        })
                    } else {
                        this.setState({
                            isTurnOnAllDevices: false
                        })
                    }
                })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }


    //viết hàm dựa vào employId để xem có quyền điều khiển phòng nào->set vào state

    toggleDeviceStatus = (device: string) => {
        switch (device) {
            case "light":
                this.setState({
                    lightOn: !this.state.lightOn
                })
                var lightUpdating = {
                    roomName: '201',
                    device: {
                        light: (this.state.lightOn) ? 0 : 1,
                    }
                }
                this.updateDeviceStatus(lightUpdating);
                break;
            case "fan":
                this.setState({
                    fanOn: !this.state.fanOn
                })
                var fanUpdating = {
                    roomName: '201',
                    device: {
                        fan: (this.state.fanOn) ? 0 : 1,
                    }
                }
                this.updateDeviceStatus(fanUpdating);
                break;
            case "conditioner":
                this.setState({
                    conditionerOn: !this.state.conditionerOn
                })
                var conditionerUpdating = {
                    roomName: '201',
                    device: {
                        conditioner: (this.state.conditionerOn) ? 0 : 1,
                    }
                }
                this.updateDeviceStatus(conditionerUpdating);
                break;
            case "powerPlug":
                this.setState({
                    powerPlugOn: !this.state.powerPlugOn
                })
                var powerPlugUpdating = {
                    roomName: '201',
                    device: {
                        powerPlug: (this.state.powerPlugOn) ? 0 : 1,
                    }
                }
                this.updateDeviceStatus(powerPlugUpdating);
                break;

            default:
                break;
        }
    }

    updateDeviceStatus = (updatingDevice: any) => {
        fetch('http://localhost:5000/room/switchDeviceStatus', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(updatingDevice),
        }).then(res => {
            if (res.ok) {
                if (this.state.lightOn && this.state.fanOn && this.state.powerPlugOn && this.state.conditionerOn) {
                    this.setState({
                        isTurnOnAllDevices: true
                    })
                } else {
                    this.setState({
                        isTurnOnAllDevices: false
                    })
                }
                return res.json().then(result => { console.log(result) })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }



    isTurnOn: number | undefined = undefined;
    //turn on/off all devices
    onChange = async (event: any) => {
        await this.setState({
            isTurnOnAllDevices: event.target.checked
        })
        this.isTurnOn = this.state.isTurnOnAllDevices ? 1 : 0;
        var data;
        if (this.isTurnOn)
            console.log('aaaa');
        data = {
            roomName: '201',
            devices: {
                light: this.isTurnOn,
                powerPlug: this.isTurnOn,
                fan: this.isTurnOn,
                conditioner: this.isTurnOn,
            }
        }
        this.UpdateAllDevicesStatus(data);
    }

    UpdateAllDevicesStatus = (data: any) => {
        const url = 'http://localhost:5000/room/switchAllDevicesStatus/' + data.roomName + '?q=' + this.isTurnOn;
        fetch(url, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
        }).then(res => {
            if (res.ok) {
                if (this.state.isTurnOnAllDevices) {
                    this.setState({
                        lightOn: true,
                        fanOn: true,
                        powerPlugOn: true,
                        conditionerOn: true
                    })
                } else {
                    this.setState({
                        lightOn: false,
                        fanOn: false,
                        powerPlugOn: false,
                        conditionerOn: false
                    })
                }
                return res.json().then(result => { console.log(result) })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }


    //booking room: dùng chung cho update và insert 
    onHandleChangeBookingForm = async (event: any) => {
        var target = event.target;
        var name = target.name;
        var value = target.type == 'checkbox' ? target.checked : target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);
        console.log(this.state.cbbRoomToBook);

        //validate button Booking
        var { txtDateToBook, txtStartTime, txtEndTime, cbbRoomToBook, txtReasonToBook, isAgreeRuleBooking } = this.state;
        if (txtDateToBook && txtStartTime && txtEndTime && cbbRoomToBook && txtReasonToBook && isAgreeRuleBooking) {
            this.setState({
                isDisableBookingBtn: false
            })
        } else {
            this.setState({
                isDisableBookingBtn: true
            })
        }
        //validate combobox
        if (txtDateToBook && txtStartTime && txtEndTime) {
            this.setState({
                isAllowToLoadEmptyRooms: false,
                isShowValidateLoadEmptyRoom: true
            })
        } else {
            this.setState({
                isAllowToLoadEmptyRooms: true,
                isShowValidateLoadEmptyRoom: false
            })
        }

        //load empty room
        // var { txtDateToBook, txtStartTime, txtEndTime } = this.state;
        // if (txtDateToBook && txtStartTime && txtEndTime) {
        //     //load empty room
        //     var { txtDateToBook, txtStartTime, txtEndTime } = this.state;
        //     if (txtDateToBook && txtStartTime && txtEndTime) {
        //         var data = {
        //             dateToBook: txtDateToBook,
        //             startTime: txtStartTime,
        //             endTime: txtEndTime
        //         }
        //         this.getEmptyRooms(data);
        //     }
        // }



    }

    createBookingRoom = (bookingRoom: any) => {
        fetch('http://localhost:5000/bookRoom/add', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(bookingRoom)
        }).then(res => {
            if (res.status === 200) {
                // return res.json().then(result => { console.log(result) })
                //make form empty
                this.setState({
                    txtDateToBook: '',
                    txtStartTime: '',
                    txtEndTime: '',
                    cbbRoomToBook: '',
                    txtReasonToBook: '',
                    isDisableBookingBtn: true,
                    isAgreeRuleBooking: false,
                    isShowValidateLoadEmptyRoom: false,
                    isAllowToLoadEmptyRooms: true,

                })



            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }



    //book room: dùng chhung cho update và insert
    onSubmitBookingForm = (event: any) => {
        event.preventDefault();
        var bookRoom = {
            roomName: this.state.cbbRoomToBook,
            date: this.state.txtDateToBook,
            startTime: this.state.txtStartTime,
            endTime: this.state.txtEndTime,
            reason: this.state.txtReasonToBook,
            status: 'pending',
            userId: this.state.currentUser.employeeId,
            id: '',
        }
        if (this.state.updatingIdBooking) {
            //update
            bookRoom["id"] = this.state.updatingIdBooking
            this.updateBookingRequest(bookRoom);
        } else {
            //insert
            // this.props.(bookRoom);
            this.createBookingRoom(bookRoom);


            //đóng form

            document.getElementById('closeBookRoomModal')?.click();
            // document.getElementById("bookRoomModal")?.setAttribute("style", "display:none");

            //thông báo đặt phòng thành công
            this.notify();
        }


    }


    //get empty room
    getEmptyRooms = (data: any) => {
        fetch('http://localhost:5000/bookRoom/getEmptyRooms', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => { console.log(result) })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    deleteBookingRequest = (idBooking: any) => {
        fetch(`http://localhost:5000/bookRoom/delete/${idBooking}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'DELETE',
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

    deleteReportErrorRequest = (idReport: any) => {
        fetch(`http://localhost:5000/reportError/delete/${idReport}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'DELETE',
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

    onDeleteRequest = (typeRquest: string, id: string, message: string) => {
        var result = window.confirm('Are you sure to delete ' + message + ' ?')
        if (result) {
            //delete booking in db
            if (typeRquest === "bookRoomRequest") {
                this.deleteBookingRequest(id);
            }
            //delete reporterror in db
            if (typeRquest === "reportErrorRequest") {
                this.deleteReportErrorRequest(id);
            }
            //update state
            const newArr = this.state.messageToUser.filter(mess => {
                return mess.id !== id;
            })
            this.setState({ messageToUser: newArr })
        }
    }

    onGetValueToUpdateForm = (id: string) => {
        //lấy data từ db->gán vào state
        fetch(`http://localhost:5000/bookRoom/edit/${id}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    this.setState({
                        txtDateToBook: formatDate(result.date),
                        txtStartTime: formatTime(result.startTime),
                        txtEndTime: formatTime(result.endTime),
                        cbbRoomToBook: result.roomName,
                        txtReasonToBook: result.reason,
                        isDisableBookingBtn: false,
                        isAgreeRuleBooking: true,
                        isShowValidateLoadEmptyRoom: true,
                        isAllowToLoadEmptyRooms: false,
                        updatingIdBooking: id
                    })
                    console.log(result);

                })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    updateBookingRequest = (booking: any) => {
        //dựa vào id trên state, update thông tin thay đổi trong form
        fetch(`http://localhost:5000/bookRoom/updating`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(booking),
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    console.log(result);
                })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    // onSubmitUpdateBookingForm=(event: any)=>{
    //     event.preventDefault();
    // }
    // onHandleChangeUpdateBookingForm=()=>{

    // }

    sendReportError = (reportError: any) => {
        fetch('http://localhost:5000/reportError/sendReportError', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(reportError)
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

    onHandleChangeReportErrorForm = async (event: any) => {
        var target = event.target;
        var name = target.name;
        var value = target.type == 'select-multiple' ? Array.from(target.selectedOptions, (option: any) => option.value) : target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);

        console.log(this.state);

    }

    onSubmitReportErrorForm = (event: any) => {
        event.preventDefault();
        var errorReport = {
            roomName: this.state.cbbRoomToReport,
            deviceNames: this.state.cbbDeviceToReport,
            description: this.state.txtDescriptionToReport,
            status: 'pending',
            userId: this.state.currentUser.employeeId,
            id: '',
        }
        if (this.state.updatingIdBooking) {
            //update
            // errorReport["id"] = this.state.updatingIdBooking
            // this.updateBookingRequest(errorReport);
        } else {
            //insert
            // this.props.(errorReport);
            this.sendReportError(errorReport);
            console.log('rperr');

        }


    }

    notify = () => toast.success("Sent booking room request successfully!");

    render() {
        console.log(this.state.messageToUser);

        var { messageToUser, lightOn, fanOn, conditionerOn, powerPlugOn, currentUser, isDisableBookingBtn, isAllowToLoadEmptyRooms, isShowValidateLoadEmptyRoom } = this.state;
        return (
            <div>
                <ToastContainer />
                <nav className="navbar navbar-primary navbar-transparent navbar-absolute">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                data-target="#navigation-example-2">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <h4><strong>Smart Room Management System</strong></h4>
                        </div>
                        <div className="collapse navbar-collapse">
                            <ul className="nav navbar-nav navbar-right">
                                <li className="">
                                    <a href="#" className="userLoginName">
                                        <i className="material-icons">assignment_ind</i> {currentUser.name}
                                    </a>
                                </li>
                                <li>
                                    <a href="#" data-toggle="modal" data-target="#historyRequestModal">
                                        <i className="material-icons">notifications</i> HIStory request
                            <span className="notification notiNumber">1</span>
                                    </a>
                                </li>

                                <li>
                                    <a href="#" onClick={this.logout}>
                                        <i className="material-icons">input</i> Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="wrapper wrapper-full-page">
                    <div className="full-page pricing-page" data-image="/img/fpt-bg2.png">
                        <div className="content">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6 col-md-offset-3 text-center">
                                        <h2 className="title">Pick the best plan for you</h2>
                                        <h5 className="description">You have Free Unlimited Updates and Premium Support on each
                                        package.
                            </h5>
                                    </div>
                                </div>
                                <div className="row">

                                    <div className="col-md-3">
                                        <div className="card card-pricing card-raised bgCard">
                                            <div className="card-content">
                                                <h6 className="category text-grey">CONTROL DEVICES</h6>
                                                <div className="icon icon-warning">
                                                    <i className="material-icons">brightness_medium</i>
                                                </div>
                                                <h3 className="card-title"></h3>
                                                <p className="card-description">
                                                    If you have permission to turn on/off devices, please click here.
                                    </p>
                                                <a className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#controlDevicesModal" onClick={this.onControlDevices}>Control now</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card card-pricing card-raised bgCard">
                                            <div className="card-content">
                                                <h6 className="category text-grey">BOOKING ROOM</h6>
                                                <div className="icon icon-warning">
                                                    <i className="material-icons">business</i>
                                                </div>
                                                <h3 className="card-title"></h3>
                                                <p className="card-description">
                                                    Booking room for your event, club, seminar..vv..
                                    </p>
                                                <a className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#bookRoomModal">Book now</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-3">
                                        <div className="card card-pricing card-raised bgCard">
                                            <div className="card-content">
                                                <h6 className="category text-grey">REPORT ERROR</h6>
                                                <div className="icon icon-warning">
                                                    <i className="material-icons">feedback</i>
                                                </div>
                                                <h3 className="card-title"></h3>
                                                <p className="card-description">
                                                    Please send report when finding devices' error
                                    </p>
                                                <a href="#pablo" className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#reportErrorModal">Report now</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="card card-pricing card-raised bgCard">
                                            <div className="card-content">
                                                <h6 className="category text-grey">CHANGE ROOM</h6>
                                                <div className="icon icon-warning">
                                                    <i className="material-icons">home_work</i>
                                                </div>
                                                <h3 className="card-title"></h3>
                                                <p className="card-description">
                                                    Click here if you want to change to another room.
                                    </p>
                                                <a href="#pablo" className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#changeRoomModal">Change now</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div id="controlDevicesModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Room 218 - Control devices</h4>
                            </div>
                            <div className="modal-body">
                                <div className="nav-center">
                                    <ul className="nav nav-pills nav-pills-warning nav-pills-icons" role="tablist">
                                        <li className={lightOn ? "active" : ""} onClick={() => this.toggleDeviceStatus('light')}>
                                            <a>
                                                <i className="material-icons">online_prediction</i> Light
                                            </a>
                                        </li>
                                        <li className={conditionerOn ? "active" : ""} onClick={() => this.toggleDeviceStatus('conditioner')}>
                                            <a>
                                                <i className="material-icons">ac_unit</i> Conditioner
                                            </a>
                                        </li>
                                        <li className={fanOn ? "active" : ""} onClick={() => this.toggleDeviceStatus('fan')}>
                                            <a>
                                                <i className="material-icons">settings_input_antenna</i> Fan
                                            </a>
                                        </li>
                                        <li className={powerPlugOn ? "active" : ""} onClick={() => this.toggleDeviceStatus('powerPlug')}>
                                            <a>
                                                <i className="material-icons">settings_input_svideo</i> Power Plug
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                            </div>
                            <div className="pd-left-5">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td className="modal-footer">
                                                <div className="checkbox width-turnOnOff">
                                                    <label>
                                                        <input type="checkbox" checked={this.state.isTurnOnAllDevices} onChange={this.onChange} /> Turn on all devices
                                                    </label>
                                                </div>
                                            </td>
                                            <td className="modal-footer">
                                                {/* <button type="button" className="btn btn-warning btnMarginNegetive"
                                                data-dismiss="modal">Save</button> */}

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>

                <div id="bookRoomModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" id="closeBookRoomModal">&times;</button>
                                <h2 className="modal-title text-center">Book room</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row mgTop3">
                                    <div className="col-md-5 col-md-offset-1">
                                        <div className="card-content">
                                            <div className="info info-horizontal">
                                                <div className="icon icon-rose">
                                                    <i className="material-icons">gavel</i><span className="ruleFormat">Rules</span>
                                                </div>
                                                <div className="description">
                                                    <h4 className="info-title">Date and Time</h4>
                                                    <p className="description">
                                                        You can book room all day in a week from 7:00 - 22:00
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule two</h4>
                                                    <p className="description">
                                                        This is rule two 's content. We've developed the website with HTML5 and CSS3.
                                                        The client has access to the
                                                        code using GitHub.
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule three</h4>
                                                    <p className="description">
                                                        This is rule 3's contents. There is also a Fully Customizable CMS Admin
                                                        Dashboard for this product.
                                        </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5">

                                        <form className="form" method="" action="" onSubmit={this.onSubmitBookingForm}>

                                            <div className="card-content">
                                                <div className="form-group">
                                                    <label className="label-control">Date</label>
                                                    <input type="date" className="form-control" name="txtDateToBook" value={this.state.txtDateToBook} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Start Time</label>
                                                    <input type="time" className="form-control" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">End Time</label>
                                                    <input type="time" className="form-control" name="txtEndTime" value={this.state.txtEndTime} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Room Name <small className="validate-loadEmptyRoom" hidden={isShowValidateLoadEmptyRoom}>*Please select date and time before choosing room</small> </label>
                                                    <select className="selectpicker" data-style="select-with-transition" title="Choose Room" data-size="7" name="cbbRoomToBook"
                                                        value={this.state.cbbRoomToBook} onChange={this.onHandleChangeBookingForm}>
                                                        {/* name="cbbRoomToBook" value={this.state.cbbRoomToBook} onChange={this.onHandleChangeBookingForm} */}
                                                        <option disabled> Choose room</option>
                                                        <option value="201">Room 201 </option>
                                                        <option value="202">Room 202</option>
                                                        <option value="203">Room 203</option>
                                                        <option value="204">Room 204</option>
                                                        <option value="205">Room 205 </option>
                                                        <option value="206">Room 206</option>
                                                        <option value="207">Room 207 </option>
                                                        <option value="208">Room 208</option>
                                                        <option value="209">Room 209</option>
                                                        <option value="210">Room 210</option>
                                                        <option value="211">Room 211</option>
                                                        <option value="212">Room 212</option>
                                                        <option value="213">Room 213 </option>
                                                        <option value="214">Room 214</option>
                                                        <option value="215">Room 215</option>
                                                        <option value="216">Room 216</option>
                                                        <option value="217">Room 217</option>
                                                        <option value="218">Room 218</option>
                                                    </select>
                                                </div>

                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label">Reason</label>
                                                    <textarea className="form-control" value={this.state.txtReasonToBook} name="txtReasonToBook" onChange={this.onHandleChangeBookingForm}></textarea>
                                                    <span className="material-input"></span>
                                                </div>


                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" name="isAgreeRuleBooking" checked={this.state.isAgreeRuleBooking} onChange={this.onHandleChangeBookingForm} /><span
                                                            className="checkbox-material" ></span> I agree to the &nbsp;
                                                        <a href="#something">rules</a>.
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="footer text-center pdBottom5">
                                                <button type="submit" className="btn btn-primary btn-round" disabled={isDisableBookingBtn}>Book now</button>

                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div id="updateBookRoomModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Update booking room</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row mgTop3">
                                    <div className="col-md-5 col-md-offset-1">
                                        <div className="card-content">
                                            <div className="info info-horizontal">
                                                <div className="icon icon-rose">
                                                    <i className="material-icons">gavel</i><span className="ruleFormat">Rules</span>
                                                </div>
                                                <div className="description">
                                                    <h4 className="info-title">Date and Time</h4>
                                                    <p className="description">
                                                        You can book room all day in a week from 7:00 - 22:00
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule two</h4>
                                                    <p className="description">
                                                        This is rule two 's content. We've developed the website with HTML5 and CSS3.
                                                        The client has access to the
                                                        code using GitHub.
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule three</h4>
                                                    <p className="description">
                                                        This is rule 3's contents. There is also a Fully Customizable CMS Admin
                                                        Dashboard for this product.
                                        </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5">

                                        <form className="form" method="" action="" onSubmit={this.onSubmitBookingForm}>

                                            <div className="card-content">
                                                <div className="form-group">
                                                    <label className="label-control">Date</label>
                                                    <input type="date" className="form-control" name="txtDateToBook" value={this.state.txtDateToBook} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Start Time</label>
                                                    <input type="time" className="form-control" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">End Time</label>
                                                    <input type="time" className="form-control" name="txtEndTime" value={this.state.txtEndTime} onChange={this.onHandleChangeBookingForm} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Room Name <small className="validate-loadEmptyRoom" hidden={isShowValidateLoadEmptyRoom}>*Please select date and time before choosing room</small> </label>
                                                    <select className="selectpicker" data-style="select-with-transition" name="cbbRoomToBook"
                                                        value={this.state.cbbRoomToBook} onChange={this.onHandleChangeBookingForm}>
                                                        {/* update */}
                                                        {/* name="cbbRoomToBook" value={this.state.cbbRoomToBook} onChange={this.onHandleChangeUpdateBookingForm} */}
                                                        <option disabled> Choose room</option>
                                                        <option value="201">Room 201 </option>
                                                        <option value="202">Room 202</option>
                                                        <option value="203">Room 203</option>
                                                        <option value="204">Room 204</option>
                                                        <option value="205">Room 205 </option>
                                                        <option value="206">Room 206</option>
                                                        <option value="207">Room 207 </option>
                                                        <option value="208">Room 208</option>
                                                        <option value="209">Room 209</option>
                                                        <option value="210">Room 210</option>
                                                        <option value="211">Room 211</option>
                                                        <option value="212">Room 212</option>
                                                        <option value="213">Room 213 </option>
                                                        <option value="214">Room 214</option>
                                                        <option value="215">Room 215</option>
                                                        <option value="216">Room 216</option>
                                                        <option value="217">Room 217</option>
                                                        <option value="218">Room 218</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label className="control-label">Reason</label>
                                                    <input className="form-control" name="txtReasonToBook" value={this.state.txtReasonToBook} onChange={this.onHandleChangeBookingForm}></input>
                                                    <span className="material-input"></span>
                                                </div>


                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" name="isAgreeRuleBooking" checked={this.state.isAgreeRuleBooking} onChange={this.onHandleChangeBookingForm} /><span
                                                            className="checkbox-material" ></span> I agree to the &nbsp;
                                                        <a href="#something">rules</a>.
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="footer text-center pdBottom5">
                                                <button type="submit" className="btn btn-primary btn-round" disabled={isDisableBookingBtn}>Update now</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                <div id="reportErrorModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">


                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Report Error</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-5 col-md-offset-1">
                                        <div className="card-content">
                                            <div className="info info-horizontal">
                                                <div className="icon icon-rose">
                                                    <i className="material-icons">
                                                        flutter_dash</i><span className="textSpan">Thank you for feedback error</span>
                                                </div>
                                                <div className="description">
                                                    <h4 className="info-title">Date and Time</h4>
                                                    <p className="description">
                                                        You can book room all day in a week from 7:00 - 22:00
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule two</h4>
                                                    <p className="description">
                                                        This is rule two 's content. We've developed the website with HTML5 and CSS3.
                                                        The client has access to the
                                                        code using GitHub.
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule three</h4>
                                                    <p className="description">
                                                        This is rule 3's contents. There is also a Fully Customizable CMS Admin
                                                        Dashboard for this product.
                                        </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-5">

                                        <form className="form" method="" action="" onSubmit={this.onSubmitReportErrorForm}>

                                            <div className="card-content">

                                                <div className="form-group">
                                                    <label className="label-control">Room Name</label>
                                                    <select className="selectpicker" data-style="select-with-transition" name="cbbRoomToReport" title="Choose Room"
                                                        value={this.state.cbbRoomToReport} onChange={this.onHandleChangeReportErrorForm}>
                                                        {/* update */}
                                                        {/* name="cbbRoomToBook" value={this.state.cbbRoomToBook} onChange={this.onHandleChangeUpdateBookingForm} */}
                                                        <option disabled> Choose room</option>
                                                        <option value="201">Room 201 </option>
                                                        <option value="202">Room 202</option>
                                                        <option value="203">Room 203</option>
                                                        <option value="204">Room 204</option>
                                                        <option value="205">Room 205 </option>
                                                        <option value="206">Room 206</option>
                                                        <option value="207">Room 207 </option>
                                                        <option value="208">Room 208</option>
                                                        <option value="209">Room 209</option>
                                                        <option value="210">Room 210</option>
                                                        <option value="211">Room 211</option>
                                                        <option value="212">Room 212</option>
                                                        <option value="213">Room 213 </option>
                                                        <option value="214">Room 214</option>
                                                        <option value="215">Room 215</option>
                                                        <option value="216">Room 216</option>
                                                        <option value="217">Room 217</option>
                                                        <option value="218">Room 218</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Device Name</label>
                                                    <select className="selectpicker" data-style="select-with-transition" multiple title="Choose Device" data-size="7" name="cbbDeviceToReport"
                                                        onChange={this.onHandleChangeReportErrorForm}>
                                                        {/* update */}
                                                        {/* name="cbbRoomToBook" value={this.state.cbbRoomToBook} onChange={this.onHandleChangeUpdateBookingForm} */}
                                                        <option disabled> Choose Device</option>
                                                        <option value="light">Light </option>
                                                        <option value="fan">Fan</option>
                                                        <option value="powerPlug">Power Plug</option>
                                                        <option value="airConditioner">Air-Conditioner</option>
                                                    </select>
                                                </div>
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label">Description</label>
                                                    <textarea className="form-control" name="txtDescriptionToReport" value={this.state.txtDescriptionToReport} onChange={this.onHandleChangeReportErrorForm}></textarea>
                                                    <span className="material-input"></span>
                                                </div>

                                            </div>
                                            <div className="footer text-center textGetStarted">
                                                <button type="submit" className="btn btn-primary btn-round">Report now</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="changeRoomModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">


                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Change room</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <h3 className="mg-20">Your Booked Room(s)</h3>
                                    <div className="col-md-5 col-md-offset-1 scroll-change-room fix-size-change-room-modal">

                                        <div className="card-content">
                                            <div className="info info-horizontal">
                                                <div className="icon icon-rose">
                                                    <i className="material-icons">
                                                        flutter_dash</i><span className="textSpan">Thank you for feedback error</span>
                                                </div>
                                                <div className="description">
                                                    <h4 className="info-title">Date and Time</h4>
                                                    <p className="description">
                                                        You can book room all day in a week from 7:00 - 22:00
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule two</h4>
                                                    <p className="description">
                                                        This is rule two 's content. We've developed the website with HTML5 and CSS3.
                                                        The client has access to the
                                                        code using GitHub.
                                        </p>
                                                </div>
                                            </div>
                                            <div className="info info-horizontal">
                                                <div className="description">
                                                    <h4 className="info-title">Rule three</h4>
                                                    <p className="description">
                                                        This is rule 3's contents. There is also a Fully Customizable CMS Admin
                                                        Dashboard for this product.
                                        </p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-md-5">

                                        <form className="form" method="" action="">

                                            <div className="card-content">
                                                <div className="form-group">
                                                    <label className="label-control">You can change from room 201 to: </label>
                                                    <select className="selectpicker" data-style="select-with-transition" multiple
                                                        title="Choose Room" data-size="7">
                                                        {/* <option disabled> Choose room</option>
                                                        <option value="2">Room 201 </option>
                                                        <option value="3">Room 202</option>
                                                        <option value="4">Room 203</option>
                                                        <option value="5">Room 204</option>
                                                        <option value="6">Room 205 </option>
                                                        <option value="7">Room 206</option>
                                                        <option value="8">Room 207 </option>
                                                        <option value="9">Room 208</option>
                                                        <option value="10">Room 209</option>
                                                        <option value="11">Room 210</option>
                                                        <option value="12">Room 211</option>
                                                        <option value="13">Room 212</option>
                                                        <option value="14">Room 213 </option>
                                                        <option value="15">Room 214</option>
                                                        <option value="16">Room 215</option>
                                                        <option value="17">Room 216</option>
                                                        <option value="18">Room 216</option>
                                                        <option value="19">Room 217</option> */}
                                                    </select>
                                                </div>

                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label">Reason</label>
                                                    <textarea className="form-control"></textarea>
                                                    <span className="material-input"></span>
                                                </div>


                                                <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" name="optionsCheckboxes" /><span
                                                            className="checkbox-material"></span> I agree to the
                                            <a href="#something">rules</a>.
                                        </label>
                                                </div>
                                            </div>
                                            <div className="footer text-center pdBottom">
                                                <a href="#pablo" className="btn btn-primary btn-round">Get Started</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            <br></br>
                        </div>
                    </div>
                </div>

                {/* <!-- history request modal --> */}
                <div id="historyRequestModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth80">

                        {/* <!-- Modal content--> */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">History Request</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row mgTop3">
                                    <div className="col-md-12">
                                        <div className="card">
                                            <MaterialTable
                                                columns={
                                                    [
                                                        { title: "ID", field: "id", hidden: true },
                                                        { title: "Title", field: "message" },
                                                        {
                                                            title: "Request Type", field: "typeRequest",
                                                            render: (rowData: message) => {
                                                                return rowData.typeRequest == "bookRoomRequest" ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
                                                                    rowData.typeRequest == "reportErrorRequest" ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
                                                                        <p style={{ color: "#B0B700", fontWeight: "bold" }}>Change Room Request</p>
                                                            }
                                                        },
                                                        {
                                                            title: "Reply Time", field: "sendAt",
                                                            render: (rowData: message) => {
                                                                console.log(formatDateTime(rowData.sendAt));
                                                                
                                                                return <small>{moment(formatDateTime(rowData.sendAt)).calendar()}</small>
                                                            }
                                                        },
                                                        {
                                                            title: "Status", field: "status",
                                                            render: (rowData: message) => {
                                                                return rowData.status == "accepted" ? <span className="label label-success" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                    rowData.status == "pending" ? <span className="label label-warning" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                        <span className="label label-default" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span>
                                                            }
                                                        },
                                                        {
                                                            title: "Actions", render: (rowData: message) => (
                                                                // <span className="btn-action-container">
                                                                //     <button title="edit" type="button" className="btn btn-warning btn-simple" data-toggle="modal" data-dismiss="modal" data-target="#updateBookRoomModal" onClick={(e) => this.onGetValueToUpdateForm(data.id)}><i className="material-icons">edit</i><div className="ripple-container"></div></button>
                                                                //     <button title="delete" type="button" className="btn btn-danger btn-simple" ><i className="material-icons">delete</i><div className="ripple-container"></div></button>
                                                                // </span>
                                                                <div className="btn-action-container-flex">
                                                                    <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit" type="button" title="Edit" data-toggle="modal" data-dismiss="modal" data-target="#updateBookRoomModal" onClick={(e) => this.onGetValueToUpdateForm(rowData.id)}>
                                                                        <span className="MuiIconButton-label">
                                                                            <span className="material-icons MuiIcon-root btn-edit-color" aria-hidden="true">edit</span>
                                                                        </span>
                                                                        <span className="MuiTouchRipple-root"></span>
                                                                    </button>
                                                                    <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit" type="button"  onClick={(e)=>this.onDeleteRequest((rowData as message).typeRequest.toString(), (rowData as message).id.toString(), (rowData as message).message.toString())}>
                                                                        <span className="MuiIconButton-label">
                                                                            <span className="material-icons MuiIcon-root btn-delete-color" aria-hidden="true">delete</span>
                                                                        </span>
                                                                        <span className="MuiTouchRipple-root"></span>
                                                                    </button>
                                                                </div>

                                                            )
                                                        },

                                                    ]
                                                }
                                                data={this.state.messageToUser}

                                            />


                                        </div>
                                        {/* <!-- end content--> */}
                                    </div>
                                    {/* <!--  end card  --> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
// const mapStateToProps = (state:any) => {
//     console.log(state)
//     return {
//         bookingRoom: state.loggedInUser
//     }
// }

// const mapDispatchToProps=(dispatch:any, props:any)=>{
//     return{
//         :(bookingRoom:any)=>{
//         dispatch((bookingRoom));
//       }
//     }
//   }
// export default connect(mapStateToProps, mapDispatchToProps)(UserHomePage);
export default UserHomePage