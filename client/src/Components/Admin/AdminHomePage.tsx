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
import {
    Route
} from "react-router-dom";



interface Props {
    match: any,
    history: any
}

interface State {

}

class AdminHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    createScript() {
        var scripts = ["/js/material-dashboard.js?v=1.2.1"];

        for (var index = 0; index < scripts.length; ++index) {
            var script = document.createElement('script');
            script.src = scripts[index];
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }

    render() {
        return (
            <div className="wrapper">
                <Sidebar match={this.props.match} />
                <div className="main-panel">
                    <Header match={this.props.match} history={this.props.history} />
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

    }
}
export default AdminHomePage;
