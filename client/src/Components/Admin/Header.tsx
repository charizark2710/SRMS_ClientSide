import React, { ChangeEvent, Component } from 'react';
import message from '../../model/Message';
import moment from 'moment';
import { NavLink, RouteComponentProps, Router, Route } from 'react-router-dom';
import firebase from 'firebase'
import { db, client } from './../../FireBase/config'

interface Props {
  messagesToAdmin: message[],
  match: any,
}

interface State {
  messages: message[]
}

class Header extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      messages: []
    }
  }
  componentDidMount() {
    fetch('http://localhost:5000', {
      credentials: 'include',
    }).then(res => {
      if (res.ok) {
        client.auth().onAuthStateChanged((user: any) => {
          if (user) {
            this.notificationManagement(user);
          }
        });
      }
    }).catch(e => {
      throw new Error(e);
    })
  }

  // UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
  //     // await this.setState({
  //     //     messages: nextProps.messagesToAdmin
  //     // })
  //     // console.log(this.state.messages);


  // }

  notificationManagement = (user: firebase.User) => {
    this.setState({ messages: [] });
    const userEmail = user.email?.split('@')[0] || ' ';
    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_added', (snap: any) => {
      console.log("child-add-on");
      const mail: message = snap.val();
      if (mail) {
        this.setState({ messages: [... this.state.messages, mail] })
      }
    });
    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_added', (snap: any) => {
      console.log("child-add-off");

      const mail: message = snap.val();
      if (mail) {
        this.setState({ messages: [... this.state.messages, mail] })
      }
    });
    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_changed', (snap: any) => {
      const mail: message = snap.val();
      console.log("child-change-on");
      if (mail.isRead) {//đánh dấu ĐÃ ĐỌC
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
        arr[changingIndex].isRead = true,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          this.setState({ messages: arr })
      }else{
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
        arr[changingIndex].isRead = false,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          this.setState({ messages: arr })
      }
    });
    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_changed', (snap: any) => {
      const mail: message = snap.val();
      console.log("child-change-on");
      if (mail.isRead) {//đánh dấu ĐÃ ĐỌC
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
        arr[changingIndex].isRead = true,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          this.setState({ messages: arr })
      }else{
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
        arr[changingIndex].isRead = false,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          this.setState({ messages: arr })
      }
    });

    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_removed', (snap: any) => {
      const mail: message = snap.val();
      console.log("child-remove-on");
      if (mail) {
        const arr = this.state.messages;
        const newArr = arr.filter(mess => {
          return mess.id !== mail.id;
        })
        console.log(newArr);

        this.setState({ messages: newArr })
      }
    });

    db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_removed', (snap: any) => {
      const mail: message = snap.val();
      console.log("child-remove-off");
      if (mail) {
        const arr = this.state.messages;
        const newArr = arr.filter(mess => {
          return mess.id !== mail.id;
        })
        this.setState({ messages: newArr })
      }
    });

  }


  render() {
    var { messages } = this.state;
    var { match } = this.props;
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
              <li>
                <a href="#pablo" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">dashboard</i>
                  <p className="hidden-lg hidden-md">Dashboard</p>
                </a>
              </li>
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">notifications</i>
                  <span className="notification">5</span>
                  <p className="hidden-lg hidden-md">
                    Notifications
                            <b className="caret"></b>
                  </p>
                </a>
                <ul className="dropdown-menu">
                  <div className="noti">Notifications</div>
                  {messages && messages.map((message, index) => {
                    return <li key={index}>
                      <NavLink to={match.url+'/'+message.typeRequest+'/'+message.id}>
                        <table className="tbl-width">
                          <tbody>
                            <tr>
                              <td><img className="noti-img"
                                src="https://cdn.psychologytoday.com/sites/default/files/styles/article-inline-half-caption/public/field_blog_entry_images/2020-06/angry_chihuahua.png?itok=TWxYDbOT"
                                alt="" />
                              </td>

                              <td>
                                <span className="noti-info"><strong>{message.sender}</strong>{message.message}</span>
                                <p className="noti-time"><small>{moment(message.sendAt).calendar()}</small></p>
                              </td>
                              <td>
                                <div className={!message.isRead ? "unread" : ""}></div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </NavLink>
                    </li>
                  })}

                  <div className="noti-seemore"><a href="moreNotification.html">See more <i
                    className="material-icons">navigate_next</i> </a> </div>
                </ul>
              </li>
              <li>
                <a href="#pablo" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">person</i>
                  <p className="hidden-lg hidden-md">Profile</p>
                </a>
              </li>
              <li className="separator hidden-lg hidden-md"></li>
            </ul>


            <form className="navbar-form navbar-right" role="search">
              <div className="form-group form-search is-empty">
                <input type="text" className="form-control" placeholder=" Search " />
                <span className="material-input"></span>
              </div>
              <button type="submit" className="btn btn-white btn-round btn-just-icon">
                <i className="material-icons">search</i>
                <div className="ripple-container"></div>
              </button>
            </form>
          </div>
        </div>
      </nav>
    )

  }
}
export default Header;
