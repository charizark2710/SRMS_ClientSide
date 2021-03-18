import React, { ChangeEvent, Component } from 'react';
import './AdminCustomStyle.css';
import Footer from '../Admin/Footer';
import Header from '../Admin/Header';
import Sidebar from '../Admin/Sidebar';
import { client, db } from '../../FireBase/config';
import Calendar from './Calendar';
import BannedList from './BannedList';
import RoomAndDevices from './RoomAndDevices';
import message from '../../model/Message';
import BookRoomDetail from './BookRoomDetails';
import ReportErrorDetail from './ReportErrorDetail';
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Link,
    RouteComponentProps
  } from "react-router-dom";


interface Props {
    match: any
}

interface State {
    messages: message[]
}

class AdminHomePage extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            messages: []
        }
    }
    UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
        await this.setState({
            messages: nextProps.messagesToAdmin
        })
    }

    createScript() {
        var scripts = [

        
                    //  "js/perfect-scrollbar.jquery.min.js",
                    //    "js/moment.min.js", "js/jquery.select-bootstrap.js", "js/jquery.datatables.js",
                    //    "js/fullcalendar.min.js", 
                       "/js/material-dashboard.js?v=1.2.1"];

        for (var index = 0; index < scripts.length; ++index) {
            var script = document.createElement('script');
            script.src = scripts[index];
            // script.async = true;
            // script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }
    componentDidMount(){
        this.createScript();
    }

    render() {
        return (
            <div className="wrapper">
                <Sidebar match={this.props.match}/>
                <div className="main-panel">
                    
                    <Header messagesToAdmin={this.state.messages} match={this.props.match} />
                    {/* <Calendar/> */}
                    {/* <BookRoom/> */}
                    <Route path='/adminHomePage' exact component={RoomAndDevices}></Route>
                    <Route path='/adminHomePage/bookRoomRequest/:id' match={this.props.match} component={BookRoomDetail}></Route>
                    <Route path='/adminHomePage/reportErrorRequest/:id' match={this.props.match} component={ReportErrorDetail}></Route>
                    <Route path='/adminHomePage/calendar' component={Calendar}></Route>
                    <Route path='/adminHomePage/bannedList' component={BannedList}></Route>
                </div>
            </div >
        )

    }
}

// const mapStateToProps = (state: any) => {
//     console.log(state)
//     return {
//         bookingRoom: state.loggedInUser
//     }
// }

// export default connect(mapStateToProps, null)(AdminHomePage);
export default AdminHomePage;
