import React, { ChangeEvent, Component } from 'react';
import firebase from 'firebase'
import { client, db } from '../../FireBase/config';
import './UserHomePage.css';
import message from '../../model/Message';
import moment from 'moment';
import MaterialTable from 'material-table';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDateTime, formatTime, formatDate } from "../Common/formatDateTime";
import { logout } from "../Common/logOut"
import FullCalendarIO from '../Common/FullCalendarIO';
import "react-datepicker/dist/react-datepicker.css";

interface Props {
    // propsFromLoginToUser: any
    history: any
}

interface State {
    countMessage: number,

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
    txtReasonToBook: string
    isDisableLoadEmptyRoomBtn: boolean
    isDisableBookingBtn: boolean
    availableRooms: any[],
    selectedRoom: string,
    isStartTimeValid: boolean,
    isEndtimeValid: boolean,
    ExceedMidNight: boolean,

    //notification for user
    messageToUser: message[]

    //history request
    historyRequest: any[]

    //report error
    cbbDeviceToReport: string[]
    cbbRoomToReport: string
    txtDescriptionToReport: string
    allRooms: string[]

    //change room
    currentRoomPermission?: string,
    currentDatePermission?: string,
    currentStartTimePermission?: string,
    currentEndTimePermission?: string,
    txtReasonChangeRoom: string,
    isDisableChangeRoomBtn: boolean,
    isDisableSubmitChangeRoomBtn: boolean,
    currentCalendarId?: string,
}

class UserHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            countMessage: 0,
            currentUser: {},
            lightOn: false,
            fanOn: false,
            conditionerOn: false,
            powerPlugOn: false,

            isTurnOnAllDevices: false,

            txtDateToBook: '',
            txtStartTime: '',
            txtEndTime: '',
            txtReasonToBook: '',
            isDisableBookingBtn: true,
            isDisableLoadEmptyRoomBtn: true,

            availableRooms: [],
            selectedRoom: '',
            isStartTimeValid: true,
            isEndtimeValid: true,
            ExceedMidNight: true,

            messageToUser: [],

            historyRequest: [],

            cbbDeviceToReport: [],
            cbbRoomToReport: '',
            txtDescriptionToReport: '',
            allRooms: [],

            currentRoomPermission: undefined,
            currentDatePermission: undefined,
            currentStartTimePermission: undefined,
            currentEndTimePermission: undefined,
            txtReasonChangeRoom: '',
            isDisableChangeRoomBtn: true,
            isDisableSubmitChangeRoomBtn: true,
            currentCalendarId: undefined
        }

    }

    notification: message[] = [];

    createScript() {
        const scripts = ["js/jquery.tagsinput.js", "/js/material-dashboard.js?v=1.2.1", "customJS/loadBackground.js"]//,"customJS/loadTable.js"

        for (let index = 0; index < scripts.length; ++index) {
            const script = document.createElement('script');
            script.src = scripts[index];
            script.async = true;
            script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }


    componentDidMount() {
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
                // this.getHistoryRequest(currentUser.employeeId)
                this.createScript();
                this.getCurrentRoom();
                const currentDate = new Date().toISOString().split("T")[0];
                document.getElementById("dateToBook")?.setAttribute("min", currentDate);
            }
        });
    }

    notiReady: boolean = false;

    getHistoryRequest = (currentUser: string) => {
        fetch(`http://localhost:5000/requestList/${currentUser}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    this.setState({
                        historyRequest: result
                    })
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    notificationManagement = (user: firebase.User) => {
        this.setState({ messageToUser: [] });
        const userEmail = user.email?.split("@")[0] || '';
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').limitToLast(30).on('child_added', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                if (mail.isRead)
                    this.setState({ messageToUser: [... this.state.messageToUser, mail] })
                else
                    this.setState({ messageToUser: [... this.state.messageToUser, mail], countMessage: ++count })
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').limitToLast(30).off('child_added', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                if (mail.isRead)
                    this.setState({ messageToUser: [... this.state.messageToUser, mail] })
                else
                    this.setState({ messageToUser: [... this.state.messageToUser, mail], countMessage: ++count })
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_changed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                if (!mail.isRead) {
                    const arr = this.state.messageToUser;
                    const changingIndex = arr.findIndex((x: any) => x.id === mail.id);
                    arr[changingIndex].isRead = true;
                    arr[changingIndex].message = mail.message;
                    arr[changingIndex].sender = mail.sender;
                    arr[changingIndex].sendAt = mail.sendAt;
                    arr[changingIndex].url = mail.url;
                    this.setState({ messageToUser: arr, countMessage: ++count });
                } else {
                    this.setState({ countMessage: count < 0 ? 0 : --count });
                }
            } else {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messageToUser: newArr, countMessage: count < 0 ? 0 : --count });
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_changed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                if (!mail.isRead) {
                    const arr = this.state.messageToUser;
                    const changingIndex = arr.findIndex((x: any) => x.id === mail.id);
                    arr[changingIndex].isRead = true;
                    arr[changingIndex].message = mail.message;
                    arr[changingIndex].sender = mail.sender;
                    arr[changingIndex].sendAt = mail.sendAt;
                    arr[changingIndex].url = mail.url;
                    this.setState({ messageToUser: arr, countMessage: ++count });
                } else {
                    this.setState({ countMessage: count < 0 ? 0 : --count });
                }
            } else {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messageToUser: newArr, countMessage: count < 0 ? 0 : --count });
            }
        });

        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_removed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messageToUser: newArr, countMessage: count < 0 ? 0 : --count })
            }
        });

        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_removed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messageToUser: newArr, countMessage: count < 0 ? 0 : --count })
            }
        });
    }

    //control devices
    onControlDevices = () => {
        const roomName = {
            roomName: this.state.currentRoomPermission
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
                return res.json().then(result => { console.log(result.error) });
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
                const lightUpdating = {
                    roomName: this.state.currentRoomPermission,
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
                const fanUpdating = {
                    roomName: this.state.currentRoomPermission,
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
                const conditionerUpdating = {
                    roomName: this.state.currentRoomPermission,
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
                const powerPlugUpdating = {
                    roomName: this.state.currentRoomPermission,
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
                return res.json().then(result => { console.log(result.error) });
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
        const data = {
            roomName: this.state.currentRoomPermission,
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
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    //booking room: dùng chung cho update và insert 
    onHandleChangeBookingForm = async (event: any) => {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);

        //validate button Booking
        const { txtDateToBook, txtStartTime, txtEndTime, txtReasonToBook, selectedRoom } = this.state;

        if (txtDateToBook && txtStartTime && txtEndTime && txtReasonToBook) {
            let currentDate = new Date();
            let hh = currentDate.getHours();
            let mm = currentDate.getMinutes();
            const hours = hh.toString().length === 2 ? hh.toString() : '0' + hh.toString();
            const minute = mm.toString().length === 2 ? mm.toString() : '0' + mm.toString();
            let currentTime = hours + ":" + minute;
            console.log(currentTime);
            const today = new Date().toISOString().split("T")[0];
            if (txtEndTime.split(':')[0] === '00' && txtStartTime.split(':')[0] !== '00') {
                if (parseInt(txtEndTime.split(':')[1]) > 0) {
                    this.setState({
                        ExceedMidNight: false
                    })
                }
            } else if (today === txtDateToBook) {
                if (currentTime > txtStartTime) {

                    this.setState({
                        isStartTimeValid: false,
                        isDisableLoadEmptyRoomBtn: false,
                    })
                } else if (currentTime < txtStartTime) {
                    this.setState({
                        isStartTimeValid: true
                    })
                    if (txtStartTime < txtEndTime) {
                        await this.setState({
                            isDisableLoadEmptyRoomBtn: false,
                            isStartTimeValid: true,
                            isEndtimeValid: true
                        })
                        if (selectedRoom) {
                            await this.setState({
                                isDisableBookingBtn: false,
                            })
                        }
                    } else {
                        this.setState({
                            isEndtimeValid: false
                        })
                    }
                }

            } else if (today < txtDateToBook) {
                if (txtStartTime < txtEndTime) {
                    await this.setState({
                        isDisableLoadEmptyRoomBtn: false,
                        isStartTimeValid: true,
                        isEndtimeValid: true
                    })
                    if (selectedRoom) {
                        await this.setState({
                            isDisableBookingBtn: false,
                        })
                    }

                } else {
                    this.setState({
                        isEndtimeValid: false
                    })
                }
            }
        } else {
            await this.setState({
                isDisableBookingBtn: true,
                isDisableLoadEmptyRoomBtn: true,
            })
        }
    }


    loadAvailableRoom = () => {
        this.setState({
            selectedRoom: ''
        })
        const { txtDateToBook, txtStartTime, txtEndTime } = this.state;
        fetch(`http://localhost:5000/bookRoom/getAvailableRooms?date=${txtDateToBook}&startTime=${txtStartTime}&endTime=${txtEndTime}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => {
                    this.setState({
                        availableRooms: result
                    })
                    if (!this.state.selectedRoom) {
                        this.setState({
                            availableRooms: result
                        })
                        if (!this.state.selectedRoom) {
                            this.setState({
                                isDisableBookingBtn: true,
                            })
                        }
                    }
                }
                )
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    getSelectedRoom = async (room: string) => {
        await this.setState({
            selectedRoom: room
        })
        //validate button Booking
        const { txtDateToBook, txtStartTime, txtEndTime, selectedRoom, txtReasonToBook } = this.state;
        if (txtDateToBook && txtStartTime && txtEndTime && selectedRoom && txtReasonToBook) {
            this.setState({
                isDisableBookingBtn: false
            })
        } else {
            this.setState({
                isDisableBookingBtn: true
            })
        }
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
                    selectedRoom: '',
                    txtReasonToBook: '',
                    isDisableBookingBtn: true,
                    isDisableLoadEmptyRoomBtn: true,
                    availableRooms: [],
                })

                //đóng form
                document.getElementById('closeBookRoomModal')?.click();
                // document.getElementById("bookRoomModal")?.setAttribute("style", "display:none");

                //thông báo đặt phòng thành công
                this.notifyBookingRoomSuccess();

            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    //book room: dùng chhung cho update và insert
    onSubmitBookingForm = (event: any) => {
        event.preventDefault();
        const date = new Date();
        const bookRoom = {
            roomName: this.state.selectedRoom,
            date: this.state.txtDateToBook,
            startTime: this.state.txtStartTime,
            endTime: this.state.txtEndTime,
            reason: this.state.txtReasonToBook,
            userId: this.state.currentUser.employeeId,
            id: '',
        }
        this.createBookingRoom(bookRoom);
    }

    deleteBookingRequest = (idBooking: string, message: string, status: string) => {
        fetch(`http://localhost:5000/bookRoom/delete/${idBooking}/?message=${message}&status=${status}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
        }).then(res => {
            if (res.status === 200) {
                toast.success("Delete booking successfully!")
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    deleteReportErrorRequest = (idReport: string, message: string) => {
        fetch(`http://localhost:5000/reportError/delete/${idReport}?message=${message}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PATCH',
        }).then(res => {
            if (res.status === 200) {
                toast.success("Delete report error request successfully!")
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    onDeleteRequest = (status: string, id: string, message: string) => {
        if (status === "changing") {
            const result = window.confirm('Are you sure to cancel changing ' + message + ' ?')
            if (result) {
                this.deleteBookingRequest(id, message, status);
                //update state
                let arr = this.state.historyRequest;
                const changingIndex = arr.findIndex((x: any) => x.id === id);
                arr[changingIndex].status = "accepted",
                    this.setState({ messageToUser: arr })
            }
        }
        if (status === "accepted" || status === "pending") {
            const result = window.confirm('Are you sure to cancel ' + message + ' ?')
            if (result) {
                this.deleteBookingRequest(id, message, status);
                //update state
                const newArr = this.state.historyRequest.filter(mess => {
                    return mess.id !== id;
                })
                this.setState({ historyRequest: newArr })
            }
        }
    }

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
                //make form empty
                this.setState({
                    cbbDeviceToReport: [],
                    cbbRoomToReport: "",
                    txtDescriptionToReport: "",
                })
                //đóng form
                document.getElementById('closeReportErrorModal')?.click();
                //thông báo gửi thành công
                this.notifyReportErrorSuccess();
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onHandleChangeReportErrorForm = async (event: any) => {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'select-multiple' ? Array.from(target.selectedOptions, (option: any) => option.value) : target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);
    }

    onSubmitReportErrorForm = (event: any) => {
        event.preventDefault();
        const errorReport = {
            roomName: this.state.cbbRoomToReport,
            deviceNames: this.state.cbbDeviceToReport,
            description: this.state.txtDescriptionToReport,
            userId: this.state.currentUser.employeeId,
            id: '',
        }
        //insert
        this.sendReportError(errorReport);
    }

    getCurrentRoom = () => {
        fetch(`http://localhost:5000/changeRoom/getCurrentRoom`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => {
                    if (result) {
                        this.setState({
                            currentRoomPermission: result.room,
                            currentDatePermission: formatDate(result.date),
                            currentStartTimePermission: formatTime(result.from),
                            currentEndTimePermission: formatTime(result.to),
                            currentCalendarId: result.id,
                        })
                    }
                })
            }
            else {
                this.setState({
                    currentRoomPermission: undefined,
                    currentDatePermission: undefined,
                    currentStartTimePermission: undefined,
                    currentEndTimePermission: undefined,
                    currentCalendarId: undefined,
                })
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    onHandleChangeChangeRoomForm = async (event: any) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);
    }

    onSubmitChangeRoomForm = (event: any) => {
        event.preventDefault();
        const changeRoomReq = {
            room: this.state.currentRoomPermission,
            calendarId: this.state.currentCalendarId,
            userId: this.state.currentUser.employeeId,
            date: this.state.currentDatePermission,
            reasonToChange: this.state.txtReasonChangeRoom,

        }
        this.sendChangeRoomRequest(changeRoomReq);
    }
    sendChangeRoomRequest = (changeRoomReq: any) => {
        fetch(`http://localhost:5000/changeRoom/sendChangeRoomRequest`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(changeRoomReq)
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => {
                    toast.success("Send request to change room successfully.")
                    document.getElementById('closeChangeRoomModal')?.click();
                    this.setState({
                        txtReasonChangeRoom: ''
                    })
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    getAllRooms = () => {
        fetch(`http://localhost:5000/room/getAllRooms`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => {
                    if (result) {
                        this.setState({
                            allRooms: result
                        })
                        console.log(this.state.allRooms);
                    }
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    notifyBookingRoomSuccess = () => toast.success("Sent booking room request successfully!");
    notifyReportErrorSuccess = () => toast.success("Sent report error request successfully!");

    onGetFullMessage=(fullMessage:string)=>{
        const message = document.getElementById("full-notification-message");
        if(message) {
            message.innerHTML = fullMessage;
        }
    }

    render() {
        const { currentDatePermission, currentEndTimePermission, currentRoomPermission, currentStartTimePermission, availableRooms, messageToUser, lightOn, fanOn, conditionerOn, powerPlugOn, currentUser, isDisableBookingBtn, isDisableLoadEmptyRoomBtn } = this.state;
        return (
            <div>
                <ToastContainer />
                <nav className="navbar navbar-primary navbar-transparent navbar-absolute">

                    <div className="container off-canvas-sidebar">
                        <div className="navbar-header menu-user-homepage-header">
                            <h4><strong>Smart Room Management System</strong></h4>
                        </div>
                        <div className="collapse navbar-collapse menu-user-homepage">
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <a href="" className="userLoginName">
                                        <i className="material-icons">assignment_ind</i> {currentUser.name}
                                    </a>
                                </li>
                                <li>
                                    <a href="" data-toggle="modal" data-target="#calendarModal">
                                        <i className="material-icons">event_available</i> Calendar
                                    </a>
                                </li>
                                <li>
                                    <a href="" data-toggle="modal" data-target="#historyRequestModal" onClick={() => this.getHistoryRequest(currentUser.employeeId)}>
                                        <i className="material-icons">history</i> History request
                                    </a>
                                </li>

                                <li id='notification' onClick={() => this.setState({ countMessage: 0 })} className="dropdown">
                                    <a href="" className=" dropdown-toggle" data-toggle="dropdown">
                                        <i className="material-icons">notifications</i>Notification
                                    <span className="notification notiNumber">{this.state.countMessage}</span>
                                        <p className="hidden-lg hidden-md">
                                            Notifications
                                        <b className="caret"></b>
                                        </p>
                                    </a>
                                    <ul className="dropdown-menu menu-user-height">
                                        {
                                            messageToUser && messageToUser.map((message: message, index) => {
                                                return <li key={index}>
                                                    <a data-toggle="modal"
                                                        data-target="#notifications" onClick={()=>this.onGetFullMessage(message.message)}>
                                                        <table className="tbl-width">
                                                            <tbody>
                                                                <tr>
                                                                    <td><img className="noti-img"
                                                                        src="https://steamusercontent-a.akamaihd.net/ugc/797620606620125695/1ABBE563C02FFDDFC3200B514FECDBBFCBE7A63B/"
                                                                        alt="" />
                                                                    </td>

                                                                    <td>
                                                                        <span className="noti-info-user">{message.message}</span>
                                                                        <p className="noti-time"><small>{moment(formatDateTime(message.sendAt)).calendar()}</small></p>
                                                                    </td>
                                                                    <td>
                                                                        <div className={!message.isRead ? "unread" : ""}></div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </a>
                                                </li>
                                            })
                                        }

                                    </ul>
                                </li>

                                <li>
                                    <a href="" onClick={() => logout(this.props.history)}>
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
                                    <div className="col-md-12 app-name-position text-center">
                                        <h2 className="title title-fontfamily">Do what you need - Need what you do</h2>
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
                                                <button className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#controlDevicesModal" onClick={this.onControlDevices} disabled={!currentRoomPermission ? true : false}>Control now</button>
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
                                                <button onClick={this.getAllRooms} className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#reportErrorModal">Report now</button>
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
                                                <button disabled={!currentRoomPermission ? true : false} className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#changeRoomModal">Change now</button>
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
                                <h4 className="modal-title">Room {currentRoomPermission} - Control devices</h4>
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


                                    <div className="col-md-12">

                                        <form className="form" method="" action="" onSubmit={this.onSubmitBookingForm}>

                                            <div className="card-content">

                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <div className="form-group is-empty">
                                                            <label className="control-label">Date</label>
                                                            <input type="date" id="dateToBook" className="form-control" name="txtDateToBook" value={this.state.txtDateToBook} onChange={this.onHandleChangeBookingForm} />
                                                            {/* <input type="" className="form-control datepicker" name="txtDateToBook"  value={this.state.txtDateToBook} onSelect={()=>this.onHandleChangeBookingForm1("a")} /> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group is-empty">
                                                            <label className="control-label">Start Time <span className="text-warning">{this.state.isStartTimeValid ? "" : "*Start time must be greater than current time*"}</span></label>
                                                            <input type="time" className="form-control" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm} />
                                                            {/* <input  className="form-control timepicker" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm1} ></input> */}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group is-empty">
                                                            <label className="control-label">End Time<span className="text-warning">
                                                                {
                                                                    this.state.isEndtimeValid && this.state.ExceedMidNight ? "" : !this.state.ExceedMidNight ? "*End time must not exceed 12h am" : "*End time must be greater than start time*"
                                                                }
                                                            </span>
                                                            </label>
                                                            <input type="time" className="form-control" name="txtEndTime" value={this.state.txtEndTime} onChange={this.onHandleChangeBookingForm} />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group is-empty">
                                                    <label className="control-label">Reason</label>
                                                    <input className="form-control" value={this.state.txtReasonToBook} name="txtReasonToBook" onChange={this.onHandleChangeBookingForm}></input>
                                                    <span className="material-input"></span>
                                                </div>





                                                <div className="form-group is-empty">
                                                    <button className="btn btn-warning" type="button" disabled={isDisableLoadEmptyRoomBtn} onClick={this.loadAvailableRoom}>
                                                        <i className="material-icons">autorenew</i> Find available room
                                                    </button>
                                                    <div className="select-room-height">
                                                        {
                                                            availableRooms && availableRooms.map((room, index) => {
                                                                return (
                                                                    <button key={index} type="button" className={this.state.selectedRoom === room ? "btn btn-warning" : "btn btn-success"} onClick={() => this.getSelectedRoom(room)}>{room}</button>
                                                                )
                                                            })
                                                        }
                                                    </div>

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

                <div id="reportErrorModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog reportError-dialogWidth">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button id="closeReportErrorModal" type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Report Error</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">

                                    <div className="col-md-12">

                                        <form className="form" method="" action="" onSubmit={this.onSubmitReportErrorForm}>

                                            <div className="card-content">

                                                <div className="form-group">
                                                    <label className="label-control">Room Name</label>
                                                    <select className="form-control" name="cbbRoomToReport" title="Choose Room"
                                                        value={this.state.cbbRoomToReport} onChange={this.onHandleChangeReportErrorForm}>
                                                        {
                                                            this.state.allRooms && this.state.allRooms.map((room, index) => {
                                                                return <option key={index} value={room}>Room {room} </option>

                                                            })
                                                        }

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
                    <div className="modal-dialog changeroom-dialogWidth">


                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" id="closeChangeRoomModal" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Change room</h2>
                            </div>
                            <div className="modal-body">
                                <div className="row">

                                    <div className="col-md-12">

                                        <form className="form" onSubmit={this.onSubmitChangeRoomForm}>

                                            <div className="card-content">
                                                <div className="form-group">
                                                    <div className="alert alert-success alert-bg">You have permisstion to control devices in room <b>{currentRoomPermission}</b> on <b>{currentDatePermission} {currentStartTimePermission}-{currentEndTimePermission}</b></div>
                                                </div>

                                                <div className="form-group label-floating is-empty">
                                                    <label className="control-label">Why do you want to change to another room?</label>
                                                    <textarea className="form-control" name="txtReasonChangeRoom" value={this.state.txtReasonChangeRoom} onChange={this.onHandleChangeChangeRoomForm}></textarea>
                                                    <span className="material-input"></span>
                                                </div>
                                            </div>
                                            <div className="footer text-center pdBottom">
                                                <button type="submit" className="btn btn-primary btn-round">Submit</button>
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
                                            <MaterialTable
                                                columns={
                                                    [
                                                        { title: "ID", field: "id", hidden: true },
                                                        { title: "Title", field: "title" },
                                                        {
                                                            title: "Request Type", field: "requestType",
                                                            render: (rowData: any) => {
                                                                return rowData.requestType === "bookRoomRequest" ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
                                                                    rowData.requestType === "reportErrorRequest" ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
                                                                        <p style={{ color: "#B0B700", fontWeight: "bold" }}>Change Room Request</p>
                                                            }
                                                        },
                                                        {
                                                            title: "Request Time", field: "requestTime",
                                                            render: (rowData: any) => {


                                                                return <small>{moment(formatDateTime(rowData.requestTime?.split("-")[1] + "-" + rowData.requestTime?.split("-")[2])).calendar()}</small>
                                                            }
                                                        },
                                                        {
                                                            title: "Status", field: "status",
                                                            render: (rowData: any) => {
                                                                return rowData.status === "accepted" ? <span className="label label-success" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                    rowData.status === "pending" ? <span className="label label-warning" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                        rowData.status === "changing" ? <span className="label label-info" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                            rowData.status === "confirmed" ? <span className="label label-rose" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                                <span className="label label-default" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span>
                                                            }
                                                        },
                                                        {
                                                            title: "Actions", render: (rowData: any) => {
                                                                const bookingDate = formatDate(rowData.date) + "T" + formatTime(rowData.endTime);
                                                                const today = new Date();
                                                                const dd = String(today.getDate()).padStart(2, '0');
                                                                const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                                                const yyyy = today.getFullYear();

                                                                const date = yyyy + '-' + mm + '-' + dd;
                                                                const time = today.getHours() + ':' + today.getMinutes();
                                                                const fullDate = date + "T" + time;

                                                                return (rowData.requestType === "bookRoomRequest" && rowData.status === "changing" && bookingDate > fullDate) || (rowData.requestType === "bookRoomRequest" && rowData.status === "accepted" && bookingDate > fullDate) || (rowData.requestType === "bookRoomRequest" && rowData.status === "pending" && bookingDate > fullDate)
                                                                    ?
                                                                    <div className="btn-action-container-flex">
                                                                        <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit" type="button" onClick={(e) => this.onDeleteRequest(rowData.status, rowData.id, rowData.title)}>
                                                                            <span className="MuiIconButton-label">
                                                                                <span className="material-icons MuiIcon-root btn-delete-color" aria-hidden="true">delete</span>
                                                                            </span>
                                                                            <span className="MuiTouchRipple-root"></span>
                                                                        </button>
                                                                    </div>
                                                                    :
                                                                    <div className="btn-action-container-flex">
                                                                        <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit" type="button" disabled>
                                                                            <span className="MuiIconButton-label">
                                                                                <span className="material-icons MuiIcon-root btn-delete-color-disable" aria-hidden="true">delete</span>
                                                                            </span>
                                                                            <span className="MuiTouchRipple-root"></span>
                                                                        </button>
                                                                    </div>
                                                            }
                                                        },

                                                    ]
                                                }
                                                data={this.state.historyRequest}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Calendar modal --> */}
                <div id="calendarModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog calendar-dialog-width">
                        {/* <!-- Modal content--> */}
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-10 col-md-offset-1">
                                            <div className="card card-calendar">
                                                <div className="card-content ps-child">
                                                    <FullCalendarIO />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* notification message */}
                <div id="notifications" className="modal fade blur" role="dialog">
                    <div className="modal-dialog">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Full Message</h2>
                            </div>
                            <div className="modal-body">
                                
                            <p id="full-notification-message">one two three one two three one two three one two threeone two three one two three one two three one two threeone two three one two three one two three one two threeone two three one two three one two three one two three</p>
                                      
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        )
    }
}

export default UserHomePage