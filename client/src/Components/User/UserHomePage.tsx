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
import { logout } from "../Common/logOut"
import FullCalendarIO from '../Common/FullCalendarIO';



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
    isDisableLoadEmptyRoomBtn: boolean
    isAgreeRuleBooking: boolean
    isAllowToLoadEmptyRooms: boolean
    isShowValidateLoadEmptyRoom: boolean
    availableRooms: any[],
    selectedRoom: string,
    isDateValid: boolean,
    isStartTimeValid: boolean,
    isEndtimeValid: boolean,
    //tracking update or insert
    isUpdateData: boolean
    updatingIdBooking: string
    updatingIdReport: string
    actionNotiId: string

    //notification for user
    messageToUser: message[]

    //history request
    historyRequest: any[]

    //report error
    cbbDeviceToReport: string[]
    cbbRoomToReport: string
    txtDescriptionToReport: string

    //change room
    currentRoomPermission: string,
    currentDatePermission: string,
    currentStartTimePermission: string,
    currentEndTimePermission: string,
    txtReasonChangeRoom: string,
    isDisableChangeRoomBtn: boolean,
    isDisableSubmitChangeRoomBtn: boolean,
    currentCalendarId: string,


}

class UserHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
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
            isDisableLoadEmptyRoomBtn: true,
            isAgreeRuleBooking: false,
            isShowValidateLoadEmptyRoom: false,
            isAllowToLoadEmptyRooms: true,
            availableRooms: [],
            selectedRoom: '',
            isDateValid: false,
            isStartTimeValid: false,
            isEndtimeValid: false,

            isUpdateData: false,
            updatingIdBooking: '',
            updatingIdReport: '',
            actionNotiId: '',

            messageToUser: [],

            historyRequest: [],

            cbbDeviceToReport: [],
            cbbRoomToReport: '',
            txtDescriptionToReport: '',

            currentRoomPermission: '',
            currentDatePermission: '',
            currentStartTimePermission: '',
            currentEndTimePermission: '',
            txtReasonChangeRoom: '',
            isDisableChangeRoomBtn: true,
            isDisableSubmitChangeRoomBtn: true,
            currentCalendarId: ''
        }

    }

    notification: message[] = [];

    createScript() {
        const scripts = ["js/jquery.tagsinput.js", "/js/material-dashboard.js?v=1.2.1", "customJS/loadBackground.js", "js/bootstrap-datetimepicker.js", "customJS/datetimetest.js"]//,"customJS/loadTable.js"

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
            }
        });
    }

    notiReady: boolean = false;

    // notificationManagement = async (user: firebase.User) => {
    //     this.setState({ messageToUser: [] });
    //     const userEmail = user.email?.split('@')[0] || ' ';
    //     db.ref('notification'.concat('/', userEmail)).limitToLast(100).on('child_added', snap => {
    //         if (this.notiReady) {
    //             const mail: message = snap.val();
    //             if (mail) {
    //                 this.setState({ messageToUser: [... this.state.messageToUser, mail] })
    //             }
    //         }
    //     });
    //     db.ref('notification'.concat('/', userEmail)).limitToLast(100).off('child_added', (snap) => {
    //         if (this.notiReady) {
    //             const mail: message = snap.val();
    //             if (mail) {
    //                 this.setState({ messageToUser: [... this.state.messageToUser, mail] })
    //             }
    //         }
    //     });
    //     db.ref('notification'.concat('/', userEmail)).on('child_changed', snap => {
    //         const mail: message = snap.val();
    //         const arr = this.state.messageToUser;
    //         for (let i = 0; i < arr.length; i++) {
    //             if (arr[i].id === mail.id) {
    //                 arr[i] = JSON.parse(JSON.stringify(mail));
    //             }
    //         }
    //         this.setState({ messageToUser: arr });
    //     });
    //     db.ref('notification'.concat('/', userEmail)).off('child_changed', (snap) => {
    //         const mail: message = snap.val();
    //         const arr = this.state.messageToUser;
    //         for (let i = 0; i < arr.length; i++) {
    //             if (arr[i].id === mail.id) {
    //                 arr[i] = JSON.parse(JSON.stringify(mail));
    //             }
    //         }
    //         this.setState({ messageToUser: arr });
    //     });

    //     db.ref('notification'.concat('/', userEmail)).on('child_removed', snap => {
    //         const mail: message = snap.val();
    //         if (mail) {
    //             const arr = this.state.messageToUser;
    //             const newArr = arr.filter(mess => {
    //                 return mess !== mail;
    //             })
    //             this.setState({ messageToUser: newArr });
    //         }
    //     });

    //     db.ref('notification'.concat('/', userEmail)).off('child_removed', snap => {
    //         const mail: message = snap.val();
    //         if (mail) {
    //             const arr = this.state.messageToUser;
    //             const newArr = arr.filter(mess => {
    //                 return mess !== mail;
    //             })
    //             this.setState({ messageToUser: newArr });
    //         }
    //     });

    //     db.ref('notification'.concat('/', userEmail)).once('value', snap => {
    //         const val = snap.val();
    //         if (val) {
    //             this.setState({ messageToUser: Object.values(val) });
    //             this.notification = Object.values(val);
    //             this.notiReady = true;
    //         }
    //     });
    // }

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
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_added', (snap: any) => {

            const mail: message = snap.val();
            if (mail) {
                this.setState({ messageToUser: [... this.state.messageToUser, mail] })
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_added', (snap: any) => {


            const mail: message = snap.val();
            if (mail) {
                this.setState({ messageToUser: [... this.state.messageToUser, mail] })
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_changed', (snap: any) => {
            const mail: message = snap.val();

            if (mail.isRead) {//đánh dấu ĐÃ ĐỌC
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
                arr[changingIndex].isRead = true,
                    arr[changingIndex].message = mail.message,
                    arr[changingIndex].sender = mail.sender,
                    arr[changingIndex].sendAt = mail.sendAt,
                    this.setState({ messageToUser: arr })
            } else {
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
                arr[changingIndex].isRead = false,
                    arr[changingIndex].message = mail.message,
                    arr[changingIndex].sender = mail.sender,
                    arr[changingIndex].sendAt = mail.sendAt,
                    this.setState({ messageToUser: arr })
            }
        });
        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_changed', (snap: any) => {
            const mail: message = snap.val();

            if (mail.isRead) {//đánh dấu ĐÃ ĐỌC
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
                arr[changingIndex].isRead = true,
                    arr[changingIndex].message = mail.message,
                    arr[changingIndex].sender = mail.sender,
                    arr[changingIndex].sendAt = mail.sendAt,
                    this.setState({ messageToUser: arr })
            } else {
                const arr = this.state.messageToUser;
                var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
                arr[changingIndex].isRead = false,
                    arr[changingIndex].message = mail.message,
                    arr[changingIndex].sender = mail.sender,
                    arr[changingIndex].sendAt = mail.sendAt,
                    this.setState({ messageToUser: arr })
            }
        });

        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_removed', (snap: any) => {
            const mail: message = snap.val();

            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    return mess.id !== mail.id;
                })


                this.setState({ messageToUser: newArr })
            }
        });

        db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_removed', (snap: any) => {
            const mail: message = snap.val();

            if (mail) {
                const arr = this.state.messageToUser;
                const newArr = arr.filter(mess => {
                    return mess.id !== mail.id;
                })
                this.setState({ messageToUser: newArr })
            }
        });

    }




    //control devices
    onControlDevices = () => {
        if (this.state.currentRoomPermission === "") {
            this.getCurrentRoom();//load chỗ ni chuối quá
        }
        var roomName = {
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
                var lightUpdating = {
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
                var fanUpdating = {
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
        var data;
        if (this.isTurnOn)

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
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }


    //booking room: dùng chung cho update và insert 
    onHandleChangeBookingForm = async (event: any) => {
        console.log('change');

        var target = event.target;
        var name = target.name;
        var value = target.type == 'checkbox' ? target.checked : target.value;
        console.log(target.value);

        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);

        //validate button Booking
        var { txtDateToBook, txtStartTime, txtEndTime, txtReasonToBook, selectedRoom } = this.state;

        if (txtDateToBook && txtStartTime && txtEndTime && txtReasonToBook) {
            if (txtDateToBook < new Date().toLocaleString()) {

            }
            await this.setState({
                isDisableLoadEmptyRoomBtn: false,
            })
            if (selectedRoom) {
                await this.setState({
                    isDisableBookingBtn: false,
                })
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
        var { txtDateToBook, txtStartTime, txtEndTime } = this.state;
        let today = new Date();
        let currentTime = today.getHours() + ":" + today.getMinutes();

        if (txtStartTime >= txtEndTime) {
            toast.error("Endtime must be greater than start time!")
        } else if (txtStartTime <= currentTime) {
            toast.error("Starttime must be greater than current time!")
        } else {
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
                                isDisableBookingBtn: true,
                            })
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


    }

    getSelectedRoom = async (room: string) => {
        await this.setState({
            selectedRoom: room
        })
        //validate button Booking
        var { txtDateToBook, txtStartTime, txtEndTime, selectedRoom, txtReasonToBook } = this.state;
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
                    isAgreeRuleBooking: false,
                    isShowValidateLoadEmptyRoom: false,
                    isAllowToLoadEmptyRooms: true,

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
        var bookRoom = {
            roomName: this.state.selectedRoom,
            date: this.state.txtDateToBook,
            startTime: this.state.txtStartTime,
            endTime: this.state.txtEndTime,
            reason: this.state.txtReasonToBook,
            userId: this.state.currentUser.employeeId,
            actionNotiId: this.state.actionNotiId,
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




    deleteBookingRequest = (idBooking: string, message: string, actionNotiId: string) => {
        fetch(`http://localhost:5000/bookRoom/delete/${idBooking}/?message=${message}?actionNotiId=${actionNotiId}`, {
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

    deleteReportErrorRequest = (idReport: string, message: string, actionNotiId: string) => {
        fetch(`http://localhost:5000/reportError/delete/${idReport}?message=${message}?actionNotiId=${actionNotiId}`, {
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

    onDeleteRequest = (typeRquest: string, id: string, message: string, actionNotiId: string) => {
        var result = window.confirm('Are you sure to delete ' + message + ' ?')
        if (result) {
            //delete booking in db
            if (typeRquest === "bookRoomRequest") {
                this.deleteBookingRequest(id, message, actionNotiId);
            }
            //delete reporterror in db
            if (typeRquest === "reportErrorRequest") {
                this.deleteReportErrorRequest(id, message, actionNotiId);
            }
            //update state
            const newArr = this.state.historyRequest.filter(mess => {
                return mess.id !== id;
            })
            this.setState({ historyRequest: newArr })
        }
    }

    onGetValueToUpdateForm = (id: string, requestType: string) => {
        //lấy data từ db->gán vào state
        if (requestType === "bookRoomRequest") {
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
                            updatingIdBooking: id,
                            actionNotiId: result.actionNotiId,
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
        if (requestType === "reportErrorRequest") {
            fetch(`http://localhost:5000/reportError/edit/${id}`, {
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                method: 'GET',
            }).then(res => {
                if (res.status === 200) {
                    return res.json().then(result => {
                        this.setState({
                            cbbDeviceToReport: result.deviceNames,
                            cbbRoomToReport: result.roomName,
                            txtDescriptionToReport: result.description,
                            updatingIdReport: id,
                            actionNotiId: result.actionNotiId,
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
    }

    updateBookingRequest = (booking: any) => {
        //dựa vào id trên state, update thông tin thay đổi trong form
        fetch(`http://localhost:5000/bookRoom/update`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(booking),
        }).then(res => {
            if (res.status === 200) {
                toast.success("Update booking request successfully!");

                //close form
                document.getElementById('closeBookRoomUpdateModal')?.click();
                //update history form
                let arr = this.state.historyRequest;
                let changingIndex = arr.findIndex((x: any) => x.id == this.state.updatingIdBooking);

                arr[changingIndex].title = "request to book room " + booking.roomName + " at " + booking.date + " " + booking.startTime + "-" + booking.endTime;
                this.setState({ historyRequest: arr })

                //make form empty
                this.setState({
                    cbbRoomToBook: "",
                    txtDateToBook: "",
                    txtStartTime: "",
                    txtEndTime: "",
                    txtReasonToBook: "",
                    updatingIdBooking: "",
                    actionNotiId: "",
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
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
        var target = event.target;
        var name = target.name;
        var value = target.type == 'select-multiple' ? Array.from(target.selectedOptions, (option: any) => option.value) : target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);



    }

    onSubmitReportErrorForm = (event: any) => {
        event.preventDefault();
        var errorReport = {
            roomName: this.state.cbbRoomToReport,
            deviceNames: this.state.cbbDeviceToReport,
            description: this.state.txtDescriptionToReport,
            userId: this.state.currentUser.employeeId,
            actionNotiId: this.state.actionNotiId,
            id: '',
        }
        if (this.state.updatingIdReport) {
            //update
            errorReport["id"] = this.state.updatingIdReport
            this.updateReportErrorRequest(errorReport);
        } else {
            //insert
            this.sendReportError(errorReport);

        }


    }


    updateReportErrorRequest = (reportError: any) => {
        //dựa vào id trên state, update thông tin thay đổi trong form
        fetch(`http://localhost:5000/reportError/update`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(reportError),
        }).then(res => {
            if (res.status === 200) {

                //close form
                document.getElementById('closeUpdateReportErrorModal')?.click();
                //update history form
                let arr = this.state.historyRequest;
                let changingIndex = arr.findIndex((x: any) => x.id == this.state.updatingIdReport);
                arr[changingIndex].title = "request to report error at room " + reportError.roomName;
                this.setState({ historyRequest: arr })

                //make form empty
                this.setState({
                    cbbDeviceToReport: [],
                    cbbRoomToReport: "",
                    txtDescriptionToReport: "",
                    updatingIdReport: "",
                    actionNotiId: "",
                })
                toast.success("Update report error request successfully!");

            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
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
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    onHandleChangeChangeRoomForm = async (event: any) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);
    }

    onSubmitChangeRoomForm = (event: any) => {
        event.preventDefault();
        var changeRoomReq = {
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
    notifyBookingRoomSuccess = () => toast.success("Sent booking room request successfully!");
    notifyReportErrorSuccess = () => toast.success("Sent report error request successfully!");
    onHandleChangeBookingForm1 = (date: any) => {

        console.log(date);

    }
    render() {


        var { currentDatePermission, currentEndTimePermission, currentRoomPermission, currentStartTimePermission, availableRooms, messageToUser, lightOn, fanOn, conditionerOn, powerPlugOn, currentUser, isDisableBookingBtn, isDisableLoadEmptyRoomBtn, isShowValidateLoadEmptyRoom } = this.state;
        return (
            <div>
                <ToastContainer />
                <nav className="navbar navbar-primary navbar-transparent navbar-absolute">
                    <div className="container">
                        <div className="navbar-header">
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
                                    <a href="#" data-toggle="modal" data-target="#calendarModal">
                                        <i className="material-icons">event_available</i> Calendar
                                    </a>
                                </li>
                                <li>
                                    <a href="#" data-toggle="modal" data-target="#historyRequestModal" onClick={() => this.getHistoryRequest(currentUser.employeeId)}>
                                        <i className="material-icons">history</i> History request
                                    </a>
                                </li>

                                <li className="dropdown">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                        <i className="material-icons">notifications</i>Notification
                                    <span className="notification notiNumber">1</span>
                                        <p className="hidden-lg hidden-md">
                                            Notifications
                                        <b className="caret"></b>
                                        </p>
                                    </a>
                                    <ul className="dropdown-menu menu-user-height">
                                        {
                                            messageToUser && messageToUser.map((message: message, index) => {
                                                return <li key={index}>
                                                    <a>
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
                                    <a onClick={() => logout(this.props.history)}>
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
                                        <h2 className="title">Do what you need - need what you do</h2>
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
                                                    data-target="#controlDevicesModal" onClick={this.onControlDevices} disabled={currentRoomPermission === "" ? true : false}>Control now</button>
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
                                                <button disabled={currentRoomPermission === "" ? true : false} className="btn btn-warning btn-round" data-toggle="modal"
                                                    data-target="#changeRoomModal" onClick={this.getCurrentRoom}>Change now</button>
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
                                                            {/* <input type="date" className="form-control" name="txtDateToBook"  value={this.state.txtDateToBook} onChange={this.onHandleChangeBookingForm} /> */}
                                                            <input type="" className="form-control datepicker" name="txtDateToBook" value={this.state.txtDateToBook} onSelect={() => this.onHandleChangeBookingForm1("a")} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group is-empty">
                                                            <label className="control-label">Start Time</label>
                                                            {/* <input type="time" className="form-control" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm1} /> */}
                                                            <input className="form-control timepicker" name="txtStartTime" value={this.state.txtStartTime} onChange={this.onHandleChangeBookingForm1} ></input>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="form-group is-empty">
                                                            <label className="control-label">End Time</label>
                                                            <input className="form-control timepicker" name="txtEndTime" value={this.state.txtEndTime} onChange={this.onHandleChangeBookingForm1} />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group is-empty">
                                                    <label className="control-label">Reason</label>
                                                    <input className="form-control" value={this.state.txtReasonToBook} name="txtReasonToBook" onChange={this.onHandleChangeBookingForm}></input>
                                                    <span className="material-input"></span>
                                                </div>



                                                {/* <div className="form-group"> */}
                                                {/* <label className="label-control">Room Name <small className="validate-loadEmptyRoom" hidden={isShowValidateLoadEmptyRoom}>*Please select date and time before choosing room</small> </label> */}
                                                {/* <select className="selectpicker" data-style="select-with-transition" title="Choose Room" data-size="7" name="cbbRoomToBook" */}
                                                {/* value={this.state.cbbRoomToBook} onChange={this.onHandleChangeBookingForm}> */}
                                                {/* <option disabled> Choose room</option>
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
                                                </div> */}




                                                {/* <div className="checkbox">
                                                    <label>
                                                        <input type="checkbox" name="isAgreeRuleBooking" checked={this.state.isAgreeRuleBooking} onChange={this.onHandleChangeBookingForm} /><span
                                                            className="checkbox-material" ></span> I agree to the &nbsp;
                                                        <a href="#something">rules</a>.
                                                    </label>
                                                </div> */}

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



                <div id="updateBookRoomModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">

                        <div className="modal-content">
                            <div className="modal-header">
                                <button id="closeBookRoomUpdateModal" type="button" className="close" data-dismiss="modal">&times;</button>
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
                                                <button type="submit" className="btn btn-primary btn-round">Update now</button>
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

                <div id="updateReportErrorModal" className="modal fade blur" role="dialog">
                    <div className="modal-dialog dialogWidth">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button id="closeUpdateReportErrorModal" type="button" className="close" data-dismiss="modal">&times;</button>
                                <h2 className="modal-title text-center">Update Report Error</h2>
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

                                        <form className="form" onSubmit={this.onSubmitReportErrorForm}>

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

                                                <div className="form-group">
                                                    <label className="control-label">Description</label>
                                                    <input className="form-control" name="txtDescriptionToReport" value={this.state.txtDescriptionToReport} onChange={this.onHandleChangeReportErrorForm}></input>
                                                    <span className="material-input"></span>
                                                </div>

                                            </div>
                                            <div className="footer text-center textGetStarted">
                                                <button type="submit" className="btn btn-primary btn-round">Update</button>
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
                                                        { title: "actionNotiId", field: "actionNotiId", hidden: true },
                                                        { title: "Title", field: "title" },
                                                        {
                                                            title: "Request Type", field: "requestType",
                                                            render: (rowData: any) => {
                                                                return rowData.requestType == "bookRoomRequest" ? <p style={{ color: "#E87722", fontWeight: "bold" }}>Book room request</p> :
                                                                    rowData.requestType == "reportErrorRequest" ? <p style={{ color: "#008240", fontWeight: "bold" }}>Report Error Request</p> :
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
                                                                return rowData.status == "accepted" ? <span className="label label-success" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                    rowData.status == "pending" ? <span className="label label-warning" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span> :
                                                                        <span className="label label-default" style={{ padding: "3px 5px 3px 5px" }}>{rowData.status}</span>
                                                            }
                                                        },
                                                        {
                                                            title: "Actions", render: (rowData: any) => {
                                                                return rowData.requestType == "bookRoomRequest" || rowData.requestType == "changeRoomRequest"
                                                                    ?
                                                                    <div className="btn-action-container-flex">
                                                                        <button className="MuiButtonBase-root MuiIconButton-root MuiIconButton-colorInherit" type="button" onClick={(e) => this.onDeleteRequest(rowData.requestType, rowData.id, rowData.title, rowData.actionNotiId)}>
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
            </div>
        )
    }
}

export default UserHomePage