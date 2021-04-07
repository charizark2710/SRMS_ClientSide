import React, { ChangeEvent, Component } from 'react';
import { client, messaging } from './../../FireBase/config'
import { NavLink, RouteComponentProps, Router, Route } from 'react-router-dom';


interface Props {
    match: any,
}

interface State {
    currentAdmin: any
}

class AdminHomePage extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            currentAdmin: {}
        }
    }
    componentDidMount() {
        fetch('http://localhost:5000', {
            credentials: 'include',
        }).then(res => {
            if (res.ok) {
                client.auth().onAuthStateChanged(user => {
                    if (user) {
                        var currentUser = {
                            name: user.displayName,
                            employeeId: user.email?.split('@')[0] || ' '
                        }

                        //this.notificationManagement(user);
                        this.setState({
                            currentAdmin: currentUser
                        })
                    }
                });
            }
        }).catch(e => {
            throw new Error(e);
        })
        console.log('sidebar');

    }



    render() {
        var { match } = this.props;

        return (
            <div className="sidebar" data-active-color="orange" data-background-color="white" data-image="/img/sidebar-1.jpg">
                <div className="logo">
                    <a href="http://www.creative-tim.com" className="simple-text logo-mini text-align-right-for-link">
                        FU
                    </a>
                    <a href="http://www.creative-tim.com" className="simple-text logo-normal text-align-right-for-link">
                        SRSM System
                    </a>
                </div>
                <div className="sidebar-wrapper">
                    <div className="user">
                        <div className="photo">
                            <img src="/img/faces/avatar.jpg" />
                        </div>
                        <div className="info">
                            <a data-toggle="collapse" href="#collapseExample" className="collapsed text-align-right-for-link">
                                <span>
                                    {this.state.currentAdmin.name}
                                </span>
                            </a>
                        </div>
                    </div>
                    <ul className="nav">
                        <li className="active text-align-right-for-link">
                            <NavLink to={match.url}>
                                <i className="material-icons">dashboard</i>
                                <p> Rooms & Devices </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={match.url + '/calendar'}>
                                <i className="material-icons">date_range</i>
                                <p> Calendar </p>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={match.url + '/bannedList'}>
                                <i className="material-icons">subtitles_off</i>
                                <p> Banned List </p>
                            </NavLink>
                        </li>
                        <li>
                            <a href="./uploadData.html" className="text-align-right-for-link">
                                <i className="material-icons">publish</i>
                                <p> Import Data </p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        )

    }
}
export default AdminHomePage;
