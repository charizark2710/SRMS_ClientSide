import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client, db } from '../../FireBase/config';
import './UserHomePage.css';
import message from '../../model/Message';
import moment from 'moment';


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
    groundOn: boolean,

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
}

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
            groundOn: false,

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

            messageToUser: []
        }

    }

    createScript() {
        const scripts = ["js/jquery.tagsinput.js", "js/material-dashboard.js?v=1.2.1", "customJS/loadBackground.js","customJS/loadTable.js"]

        for (let index = 0; index < scripts.length; ++index) {
            const script = document.createElement('script');
            script.src = scripts[index];
            script.async = true;
            script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }

    reloadScriptTable() {
        const loadTable = "customJS/loadTable.js"

        const script = document.createElement('script');
        script.src = loadTable
        script.async = true;
        script.type = 'text/javascript';
        document.getElementsByTagName("body")[0].appendChild(script);
    }

    componentDidUpdate(){
        // this.reloadScriptTable();
    }
    componentDidMount() {
        this.createScript();
        // const script = document.createElement("script");
        // script.src = 'customJS/loadBackground.js';
        // script.async = true;
        // document.body.appendChild(script);

        // const script1 = document.createElement("script");
        // script.src = 'customJS/table.js';
        // script.async = true;
        // document.body.appendChild(script1);

        // var localUser = localStorage.getItem('currentUser');
        // if (localStorage && localUser) {
        //     var currentUser = JSON.parse(localUser);
        //     this.setState({
        //         currentUser: currentUser
        //     })
        // }
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app', {
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                client.auth().onAuthStateChanged(user => {
                    if (user) {
                        const currentUser = {
                            name: user.displayName,
                            employeeId: user.email?.split('@')[0] || ' '
                        }

                        this.notificationManagement(user);
                        this.setState({
                            currentUser: currentUser
                        })
                    }
                });
            }
        }).catch(e => {
            throw new Error(e);
        })
        console.log(this.state.currentUser);

    }

    notificationManagement = (user: firebase.User) => {
        this.setState({ messageToUser: [] });
        const userEmail = user.email?.split('@')[0] || ' ';
        db.ref('notification'.concat('/', userEmail)).on('child_added', snap => {
            console.log("child-add-on");
            const mail: message = snap.val();
            if (mail) {
                this.setState({ messageToUser: [... this.state.messageToUser, mail] })
            }
        });
        db.ref('notification'.concat('/', userEmail)).off('child_added', (snap) => {
            console.log("child-add-off");

            const mail: message = snap.val();
            if (mail) {
                this.setState({ messageToUser: [... this.state.messageToUser, mail] })
            }
        });
        db.ref('notification'.concat('/', userEmail)).on('child_changed', snap => {
            const mail: message = snap.val();
            console.log("child-change-on");
            if (mail) {
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex(x => x.id == mail.id);
                arr[changingIndex].message = mail.message,
                    arr[changingIndex].sendAt = mail.sendAt,
                    arr[changingIndex].status = mail.status,

                    this.setState({ messageToUser: arr })
            }
        });
        db.ref('notification'.concat('/', userEmail)).off('child_changed', (snap) => {
            const mail: message = snap.val();
            console.log("child-change-off");
            if (mail) {
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex(x => x.id == mail.id);
                arr[changingIndex].message = mail.message,
                    arr[changingIndex].sendAt = mail.sendAt,
                    arr[changingIndex].status = mail.status,

                    this.setState({ messageToUser: arr })
            }
        });

        // db.ref('notification'.concat('/', userEmail)).on('child_removed', snap => {
        //   const mail: message = snap.val();
        //   console.log("child-remove-on");
        //   if (mail) {
        //     const arr = this.state.message;
        //     const newArr = arr.filter(mess => {
        //       return mess !== mail;
        //     })
        //     this.setState({ message: newArr })
        //   }
        // });

        // db.ref('notification'.concat('/', userEmail)).off('child_removed', snap => {
        //   const mail: message = snap.val();
        //   console.log("child-remove-off");
        //   if (mail) {
        //     const arr = this.state.message;
        //     const newArr = arr.filter(mess => {
        //       return mess !== mail;
        //     })
        //     this.setState({ message: newArr })
        //   }
        // });
    }

    logout = () => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/logout', {
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
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/room/sendDevicesStatus', {
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
                        groundOn: result.ground === 1 ? true : false,
                        conditionerOn: result.conditioner === 1 ? true : false,
                    })
                    if (this.state.lightOn && this.state.fanOn && this.state.groundOn && this.state.conditionerOn) {
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
            case "ground":
                this.setState({
                    groundOn: !this.state.groundOn
                })
                var groundUpdating = {
                    roomName: '201',
                    device: {
                        ground: (this.state.groundOn) ? 0 : 1,
                    }
                }
                this.updateDeviceStatus(groundUpdating);
                break;

            default:
                break;
        }
    }

    updateDeviceStatus = (updatingDevice: any) => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/room/switchDeviceStatus', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
            body: JSON.stringify(updatingDevice),
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
    //turn on/off all devices
    onChange = async (event: any) => {
        await this.setState({
            isTurnOnAllDevices: event.target.checked
        })
        var isTurnOn = this.state.isTurnOnAllDevices ? 1 : 0
        var data = {
            roomName: '201',
            devices: {
                light: isTurnOn,
                ground: isTurnOn,
                fan: isTurnOn,
                conditioner: isTurnOn,
            }
        }
        this.UpdateAllDevicesStatus(data);
    }

    UpdateAllDevicesStatus = (data: any) => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/room/switchAllDevicesStatus', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(data),
        }).then(res => {
            if (res.ok) {
                if (this.state.isTurnOnAllDevices) {
                    this.setState({
                        lightOn: true,
                        fanOn: true,
                        groundOn: true,
                        conditionerOn: true
                    })
                } else {
                    this.setState({
                        lightOn: false,
                        fanOn: false,
                        groundOn: false,
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
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(bookingRoom)
        }).then(res => {
            if (res.status === 200) {
                // return res.json().then(result => { console.log(result) })
                console.log(res);
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
                // Array.from(document.querySelectorAll("input")).forEach(
                //     input => (input.value = "")
                //   );
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
        }


    }


    //get empty room
    getEmptyRooms = (data: any) => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom/getEmptyRooms', {
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
        fetch(`http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom/delete/${idBooking}`, {
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
        if ((typeRquest = 'bookRoomRequest')) {
            var result = window.confirm('Are you sure to cancel ' + message + ' ?')
            if (result) {
                //delete booking in db
                this.deleteBookingRequest(id);
                //update state
                const newArr = this.state.messageToUser.filter(mess => {
                    return mess.id !== id;
                })
                this.setState({ messageToUser: newArr })
            }
        }
    }

    onGetValueToUpdateForm = (id: string) => {
        //lấy data từ db->gán vào state
        fetch(`http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom/editting/${id}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    this.setState({
                        txtDateToBook: result.date,
                        txtStartTime: result.startTime,
                        txtEndTime: result.endTime,
                        cbbRoomToBook: result.roomName,
                        txtReasonToBook: result.reason,
                        isDisableBookingBtn: false,
                        isAgreeRuleBooking: true,
                        isShowValidateLoadEmptyRoom: true,
                        isAllowToLoadEmptyRooms: false,
                        updatingIdBooking: id
                    })
                    console.log(this.state.cbbRoomToBook);

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
        fetch(`http://localhost:5000/capstone-srms-thanhnt/us-central1/app/bookRoom/updating`, {
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

    render() {

        var { messageToUser, lightOn, fanOn, conditionerOn, groundOn, currentUser, isDisableBookingBtn, isAllowToLoadEmptyRooms, isShowValidateLoadEmptyRoom } = this.state;
        return (
            <div>
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
                                        <li className={groundOn ? "active" : ""} onClick={() => this.toggleDeviceStatus('ground')}>
                                            <a>
                                                <i className="material-icons">settings_input_svideo</i> Power Socket
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
                                                        <input type="checkbox" checked={this.state.isTurnOnAllDevices} onChange={this.onChange} /> Turn on all devices {this.state.isTurnOnAllDevices ? "ok" : "no"}
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
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
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

                                        <form className="form" method="" action="">

                                            <div className="card-content">

                                                <div className="form-group">
                                                    <label className="label-control">Room Name</label>
                                                    <select className="selectpicker" data-style="select-with-transition" multiple
                                                        title="Choose Room" data-size="7">
                                                        <option disabled> Choose room</option>
                                                        {/* <option value="2">Room 201 </option>
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
                                                <div className="form-group">
                                                    <label className="label-control">Device Name</label>
                                                    <select className="selectpicker" data-style="select-with-transition" multiple
                                                        title="Choose Device" data-size="7">
                                                        <option disabled> Choose device</option>
                                                        {/* <option value="2">Light 201 </option>
                                                        <option value="3">Light 202</option>
                                                        <option value="4">Light 203</option>
                                                        <option value="5">Light 204</option>
                                                        <option value="6">Light 205 </option>
                                                        <option value="7">Light 206</option>
                                                        <option value="8">Air Conditioner 207 </option>
                                                        <option value="9">Air Conditioner 208</option>
                                                        <option value="10">Air Conditioner 209</option>
                                                        <option value="11">Air Conditioner 210</option>
                                                        <option value="12">Air Conditioner 211</option>
                                                        <option value="13">Fan 212</option>
                                                        <option value="14">Fan 213 </option>
                                                        <option value="15">Fan 214</option>
                                                        <option value="16">Socket Power 215</option>
                                                        <option value="17">Socket Power 216</option>
                                                        <option value="18">Socket Power 216</option>
                                                        <option value="19">Socket Power 217</option> */}
                                                    </select>
                                                </div>
                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label">Description</label>
                                                    <textarea className="form-control"></textarea>
                                                    <span className="material-input"></span>
                                                </div>

                                            </div>
                                            <div className="footer text-center textGetStarted">
                                                <a href="#pablo" className="btn btn-primary btn-round">Get Started</a>
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

                                        <form className="form" method="" action="">

                                            <div className="card-content">
                                                <div className="form-group">
                                                    <label className="label-control">Datetime</label>
                                                    <input type="text" className="form-control datetimepicker" />{/* value="10/05/2016" */}
                                                </div>
                                                <div className="form-group">
                                                    <label className="label-control">Destination Room</label>
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

                                            <div className="card-content">

                                                <div className="material-datatables">
                                                    <table id="datatables" className="table table-striped table-no-bordered table-hover"
                                                        width="100%">
                                                        <thead>
                                                            <tr>
                                                                <th>Title</th>
                                                                <th>Request Type</th>
                                                                <th>Reply Time</th>
                                                                <th>Status</th>
                                                                <th className="text-center">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tfoot>
                                                            <tr>
                                                                <th>Title</th>
                                                                <th>Request Type</th>
                                                                <th>Reply Time</th>
                                                                <th>Status</th>
                                                                <th className="text-center">Actions</th>
                                                            </tr>

                                                        </tfoot>
                                                        {/* <tbody>
                                                            {messageToUser && messageToUser.map((message) => {
                                                                var typeRequest = ''
                                                                if (message.typeRequest = 'bookRoomRequest') {
                                                                    typeRequest = 'Book Room';
                                                                } else if (message.typeRequest = 'reportErrorRequest') {
                                                                    typeRequest = 'Report Error'
                                                                } else if (message.typeRequest = 'changeRoom') {
                                                                    typeRequest = 'Change Room'
                                                                }

                                                                return <tr className="mainColor" key={message.id}>
                                                                    <td>{message.message}</td>
                                                                    <td>{typeRequest}</td>
                                                                    <td>{moment(message.sendAt).calendar()}</td>
                                                                    <td><span className="label label-warning pdAll"
                                                                    >{message.status}</span></td>
                                                                    <td className="td-actions text-center">
                                                                        <button type="button"
                                                                            className="btn btn-success btn-simple" data-original-title=""
                                                                            title="Update this request" data-toggle="modal"
                                                                            data-dismiss="modal"
                                                                            data-target="#updateBookRoomModal"
                                                                            onClick={() => this.onGetValueToUpdateForm(message.id)}
                                                                        >
                                                                            <i className="material-icons">edit</i>
                                                                            <div className="ripple-container"></div>
                                                                        </button>
                                                                        <button type="button"
                                                                            className="btn btn-danger btn-simple" data-original-title=""
                                                                            title="Delete this request" onClick={
                                                                                () => { this.onDeleteRequest(message.typeRequest, message.id, message.message) }
                                                                            }>
                                                                            <i className="material-icons">close</i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            })}

                                                        </tbody>
                                                     */}

                                                    <tbody></tbody>
                                                    </table>
                                                </div>
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