import React, { ChangeEvent, Component } from 'react';
import message from '../../model/Message';
import moment from 'moment';
import { NavLink, RouteComponentProps, Router, Route } from 'react-router-dom';
import firebase from 'firebase'
import { db, client } from './../../FireBase/config';
import { formatDateTime } from "../Common/formatDateTime";
import { logout } from "../Common/logOut";

// import history from "../Common/history";

interface Props {
  match: any,
  history:any
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
            this.notificationManagement();
          }
        });
      }
    }).then(()=>{
      document.getElementById
    }).catch(e => {
      console.log(e);
    })
  }

  // UNSAFE_componentWillReceiveProps = async (nextProps: any) => {
  //     // await this.setState({
  //     //     messages: nextProps.messagesToAdmin
  //     // })
  //     // console.log(this.state.messages);


  // }

  notificationManagement = () => {
    this.setState({ messages: [] });
    const userEmail = "admin";
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
      }
      if(!mail.isValid){//valid->invalid do cập nhật hoặc xóa
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
          arr[changingIndex].isRead = mail.isRead,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          arr[changingIndex].isValid =false;
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
      }
      
      if(!mail.isValid){//valid->invalid do cập nhật hoặc xóa
        const arr = this.state.messages;
        var changingIndex = arr.findIndex((x: any) => x.id == mail.id);
          arr[changingIndex].isRead = mail.isRead,
          arr[changingIndex].message = mail.message,
          arr[changingIndex].sender = mail.sender,
          arr[changingIndex].sendAt = mail.sendAt,
          arr[changingIndex].isValid =false;
          this.setState({ messages: arr })
      }
    });


  
    // db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').on('child_removed', (snap: any) => {
    //   const mail: message = snap.val();
    //   console.log("child-remove-on");
    //   if (mail) {
    //     const arr = this.state.messages;
    //     const newArr = arr.filter(mess => {
    //       return mess.id !== mail.id;
    //     })
    //     console.log(newArr);

    //     this.setState({ messages: newArr })
    //   }
    // });

    // db.ref('notification'.concat('/', userEmail)).orderByChild('sendAt').off('child_removed', (snap: any) => {
    //   const mail: message = snap.val();
    //   console.log("child-remove-off");
    //   if (mail) {
    //     const arr = this.state.messages;
    //     const newArr = arr.filter(mess => {
    //       return mess.id !== mail.id;
    //     })
    //     this.setState({ messages: newArr })
    //   }
    // });

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
              <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="material-icons">notifications</i>
                  <span className="notification">5</span>
                  <p className="hidden-lg hidden-md">
                    Notifications
                            <b className="caret"></b>
                  </p>
                </a>
                <ul className="dropdown-menu admin-menu-height">
                  <div className="noti">Notifications</div>
                  {messages && messages.map((message, index) => {
                    return <li key={index}>
                      <NavLink to={match.url+message.url} className={message.isValid?"":"invalid-noti-bg"}>
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
                      </NavLink>
                    </li>
                  })}

                  <div className="noti-seemore"><NavLink to="/adminHomePage/requests">See more <i
                    className="material-icons">navigate_next</i> </NavLink> </div>
                </ul>
              </li>
              <li>
                <a href="#pablo" onClick={()=>logout(this.props.history)} className="dropdown-toggle" data-toggle="dropdown">
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
