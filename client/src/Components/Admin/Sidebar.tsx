import React, { ChangeEvent, Component } from 'react';
import { client, messaging } from './../../FireBase/config'
import { NavLink, RouteComponentProps, Router, Route, useRouteMatch } from 'react-router-dom';


interface Props {
    match: any,
    
}

interface ILinkProp{
    icon:any,
    label: any,
    to: any,
    activeOnlyWhenExact: any
}

interface State {
    currentAdmin: any
}

const CustomNavLink = ({ label, to, activeOnlyWhenExact, icon}: ILinkProp) => {
    return (
        <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => {
            var active = match ? "active" : "";
            return (
                <li className={active}>
                    <NavLink to={to}>
                        <i className="material-icons">{icon}</i>
                        <p> {label} </p>
                    </NavLink>
                </li>
            )
        }} />

        
    )
}

// const customNavLink=({ label, to, activeOnlyWhenExact }: Props) =>{
//     let match = useRouteMatch({
//       path: to,
//       exact: activeOnlyWhenExact
//     });

//     return (
//       <li className={match ? "active" : ""}>
//         {match && "> "}
//         <NavLink to={to}>{label}</NavLink>
//       </li>
//     );
//   }

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
            //Quay lại trang đăng nhập
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
                        {/* <li className="active">
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
                            <NavLink to={match.url + '/importData'}>
                                <i className="material-icons">publish</i>
                                <p> Import Data </p>
                            </NavLink>
                        </li> */}

                        <CustomNavLink label="Rooms & Devices" to={'/'} activeOnlyWhenExact={true} icon="dashboard"></CustomNavLink>
                        <CustomNavLink label="Calendar" to={'/calendar'} activeOnlyWhenExact={false} icon="date_range"></CustomNavLink>
                        <CustomNavLink label="Banned List" to={'/bannedList'} activeOnlyWhenExact={false} icon="subtitles_off"></CustomNavLink>
                        <CustomNavLink label="Mornitor Report" to={'/report'} activeOnlyWhenExact={false} icon="stacked_line_chart"></CustomNavLink>
                        <CustomNavLink label="Import Data" to={'/importData'} activeOnlyWhenExact={false} icon="publish"></CustomNavLink>
                    </ul>
                </div>
            </div>
        )

    }
}
export default AdminHomePage;
