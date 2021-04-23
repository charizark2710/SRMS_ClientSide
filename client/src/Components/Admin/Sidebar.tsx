import { Component } from 'react';
import { client } from './../../FireBase/config'
import { NavLink, Route } from 'react-router-dom';

interface Props {
    match: any
}

interface ILinkProp {
    icon: any,
    label: any,
    to: any,
    activeOnlyWhenExact: any
}

interface State {
    currentAdmin: any
}

const CustomNavLink = ({ label, to, activeOnlyWhenExact, icon }: ILinkProp) => {
    return (
        <Route path={to} exact={activeOnlyWhenExact} children={({ match }) => {
            const active = match ? "active" : "";
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
        client.auth().onAuthStateChanged(user => {
            if (user) {
                const currentUser = {
                    name: user.displayName,
                    employeeId: user.email?.split('@')[0] || ' '
                }
                //this.notificationManagement(user);
                this.setState({
                    currentAdmin: currentUser
                })
            }
        });
        console.log('sidebar');

    }



    render() {
        const { match } = this.props;

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
