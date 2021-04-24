import React, { Component } from 'react';
import message from '../../model/Message';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { formatDateTime } from "../Common/formatDateTime";
import { logout } from "../Common/logOut";

// import history from "../Common/history";

interface Props {
  match: any,
  history: any,
  messages: message[],
  countMessage: number
}

interface State {
}

class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: [],
      countMessage: 0
    }
  }
  render() {
    const { messages } = this.props;
    const { match } = this.props;
    console.log(match);

    return (
      <nav className="navbar navbar-transparent navbar-absolute">
        <div className="container-fluid">
          <div className="navbar-minimize">
            <button id="minimizeSidebar" className="btn btn-round btn-white btn-fill btn-just-icon">
              <i className="material-icons visible-on-sidebar-regular">more_vert</i>
              <i className="material-icons visible-on-sidebar-mini">view_list</i>
            </button>
          </div>
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="#"> Dashboard </a>
          </div>
          <div className="collapse navbar-collapse">
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">notifications</i>
                  <span className="notification">{this.props.countMessage}</span>
                  <p className="hidden-lg hidden-md">
                    Notifications
                            <b className="caret"></b>
                  </p>
                </a>
                <ul className="dropdown-menu admin-menu-height">
                  <div className="noti">Notifications</div>
                  {messages && messages.map((message, index) => {
                    return <li key={index}>
                      {message.url ? <NavLink to={message.url as string} className={message.message ? "invalid-noti-bg" : ""}>
                        <table className="tbl-width">
                          <tbody>
                            <tr>
                              <td><img className="noti-img"
                                src="https://i.guim.co.uk/img/media/20098ae982d6b3ba4d70ede3ef9b8f79ab1205ce/0_0_969_1005/master/969.jpg?width=700&quality=85&auto=format&fit=max&s=470657ebd2a0e704df88997d393aea15"
                                alt="" />
                              </td>

                              <td>
                                <span className="noti-info"><strong>{message.sender}</strong>{message.message}</span>
                                <p className="noti-time"><small>{moment(formatDateTime(message.sendAt)).calendar()}</small></p>
                              </td>
                              <td>
                                <div className={!message.isRead ? "unread" : ""}></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </NavLink> : null}
                    </li>
                  })}

                  <div className="noti-seemore"><NavLink to="/requests">See more <i
                    className="material-icons">navigate_next</i> </NavLink> </div>
                </ul>
              </li>
              <li>
                <a href="#pablo" onClick={() => logout(this.props.history)} className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">logout</i>
                  <p className="hidden-lg hidden-md">Logout</p>
                </a>
              </li>
              <li className="separator hidden-lg hidden-md"></li>
            </ul>

          </div>
        </div>
      </nav>
    )

  }
}
export default Header;
