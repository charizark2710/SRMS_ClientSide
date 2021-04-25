import { Component } from 'react';
import './AdminCustomStyle.css';
import Header from '../Admin/Header';
import Sidebar from '../Admin/Sidebar';
import Calendar from './Calendar';
import BannedList from './BannedList';
import RoomAndDevices from './RoomAndDevices';
import BookRoomDetail from './BookRoomDetails';
import ReportErrorDetail from './ReportErrorDetail';
import RequestList from './RequestList';
import ImportData from './ImportData';
import MonitorReport from './MonitorReport';
import ChangeRoomDetail from './ChangeRoomDetail';
import { db, client } from './../../FireBase/config';
import message from '../../model/Message';

import {
    Route
} from "react-router-dom";



interface Props {
    match: any,
    history: any,

}

interface State {
    messages: message[],
    countMessage: number,
    currentAdmin?: string,
    isLoaded: boolean
}

class AdminHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            messages: [],
            countMessage: 0,
            currentAdmin: undefined,
            isLoaded: false
        }
    }

    createScript() {
        const scripts = ["/js/material-dashboard.js?v=1.2.1"];

        for (let index = 0; index < scripts.length; ++index) {
            const script = document.createElement('script');
            script.src = scripts[index];
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }
    componentDidMount() {
        fetch('http://localhost:5000', {
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                client.auth().onAuthStateChanged((user: any) => {
                    if (user) {
                        this.notificationManagement().then(() => {
                            this.setState({ currentAdmin: user.displayName, isLoaded: true });
                        });
                        this.createScript();
                    }
                });
            }
        }).catch(e => {
            console.log(e);
        })
    }

    notificationManagement = async () => {
        this.setState({ messages: [] });
        const userEmail = "admin";
        const tempMessage: any[] = [];
        db.ref('notification'.concat('/', userEmail)).limitToLast(30).on('child_added', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                tempMessage.unshift(mail);
                if (mail.isRead)
                    this.setState({ messages: tempMessage })
                else
                    this.setState({ messages: tempMessage, countMessage: ++count })
            }
        });
        db.ref('notification'.concat('/', userEmail)).limitToLast(30).off('child_added', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                tempMessage.unshift(mail);
                if (mail.isRead)
                    this.setState({ messages: tempMessage })
                else
                    this.setState({ messages: tempMessage, countMessage: ++count })
            }
        });
        db.ref('notification'.concat('/', userEmail)).limitToLast(30).on('child_changed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                const arr = this.state.messages;
                const changingIndex = arr.findIndex((x: any) => x.id === mail.id);
                arr[changingIndex].isRead = mail.isRead;
                arr[changingIndex].message = mail.message;
                arr[changingIndex].sender = mail.sender;
                arr[changingIndex].sendAt = mail.sendAt;
                arr[changingIndex].url = mail.url;
                if (!mail.isRead) {
                    this.setState({ messages: arr, countMessage: ++count });
                } else {
                    this.setState({ countMessage: count < 0 ? 0 : --count });
                }
            } else {
                const arr = this.state.messages;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messages: newArr, countMessage: count < 0 ? 0 : --count });
            }
        });
        db.ref('notification'.concat('/', userEmail)).limitToLast(30).off('child_changed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail.url) {
                const arr = this.state.messages;
                const changingIndex = arr.findIndex((x: any) => x.id === mail.id);
                arr[changingIndex].isRead = mail.isRead;
                arr[changingIndex].message = mail.message;
                arr[changingIndex].sender = mail.sender;
                arr[changingIndex].sendAt = mail.sendAt;
                arr[changingIndex].url = mail.url;
                if (!mail.isRead) {
                    this.setState({ messages: arr, countMessage: ++count });
                } else {
                    console.log(mail);
                    this.setState({ countMessage: count < 0 ? 0 : --count });
                }
            } else {
                const arr = this.state.messages;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messages: newArr, countMessage: count < 0 ? 0 : --count });
            }
        });

        db.ref('notification'.concat('/', userEmail)).limitToLast(30).on('child_removed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail) {
                const arr = this.state.messages;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messages: newArr, countMessage: count < 0 ? 0 : --count })
            }
        });

        db.ref('notification'.concat('/', userEmail)).limitToLast(30).off('child_removed', (snap: any) => {
            const mail: message = snap.val();
            let count = this.state.countMessage;
            if (mail) {
                const arr = this.state.messages;
                const newArr = arr.filter(mess => {
                    if (mess.id !== mail.id) --count;
                    return mess.id !== mail.id;
                })
                this.setState({ messages: newArr, countMessage: count < 0 ? 0 : --count })
            }
        });
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div className="wrapper">
                    <Sidebar currentAdmin={this.state.currentAdmin as string} match={this.props.match} />
                    <div className="main-panel">
                        <Header messages={this.state.messages} countMessage={this.state.countMessage} match={this.props.match} history={this.props.history} />
                        <Route path='/' exact component={RoomAndDevices}></Route>
                        <Route path='/bookRoomRequest/:id' match={this.props.match} component={BookRoomDetail}></Route>
                        <Route path='/reportErrorRequest/:id' match={this.props.match} component={ReportErrorDetail}></Route>
                        <Route path='/changeRoomRequest/:id' match={this.props.match} component={ChangeRoomDetail}></Route>
                        <Route path='/calendar' component={Calendar}></Route>
                        <Route path='/bannedList' component={BannedList}></Route>
                        <Route path='/requests' component={RequestList}></Route>
                        <Route path='/importData' component={ImportData}></Route>
                        <Route path='/report' component={MonitorReport}></Route>
                    </div>
                </div >
            )
        } else {
            return null
        }

    }
}
export default AdminHomePage;
