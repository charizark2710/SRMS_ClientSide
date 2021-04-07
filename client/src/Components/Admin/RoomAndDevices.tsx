import React, { ChangeEvent, Component } from 'react';


interface Props {

}

interface State {
    onConditioner: string
    onFan: string
    onPowerPlug: string
    onLight: string
    totalConditioner: string
    totalFan: string
    totalPowerPlug: string
    totalLight: string


    //devices status
    lightOn: boolean,
    fanOn: boolean,
    conditionerOn: boolean,
    powerPlugOn: boolean,

    //checkbox turn on/off all devices
    isTurnOnAllDevices: boolean
    //room đang được điều khiển
    controllingRoom:string
}

class RoomAndDevices extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            //dash board
            onConditioner: '',
            onFan: '',
            onPowerPlug: '',
            onLight: '',
            totalConditioner: '',
            totalFan: '',
            totalPowerPlug: '',
            totalLight: '',

            //
            lightOn: false,
            fanOn: false,
            conditionerOn: false,
            powerPlugOn: false,

            isTurnOnAllDevices: false,

            controllingRoom:"",

        }
    }

    createScript() {
        const scripts = ["js/jquery.tagsinput.js"]//,"customJS/loadTable.js"

        for (let index = 0; index < scripts.length; ++index) {
            const script = document.createElement('script');
            script.src = scripts[index];
            script.async = true;
            script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }

    componentDidMount() {
        this.getNumberOfDevices();
        this.createScript();
    }

    getNumberOfDevices = () => {
        fetch('http://localhost:5000/room/countNumberTurnOnDevices', {
            credentials: "include",
            method: 'GET',
        }).then(async res => {
            try {
                if (res.ok) {
                    //set state   
                    await res.json().then(result => {
                        this.setState({
                            onConditioner: result.onConditioner,
                            onFan: result.onFan,
                            onPowerPlug: result.onPowerPlug,
                            onLight: result.onLight,
                            totalConditioner: result.totalConditioner,
                            totalFan: result.totalFan,
                            totalPowerPlug: result.totalPowerPlug,
                            totalLight: result.totalLight
                        })
                        console.log(this.state);

                    });

                } else {
                    res.json().then(result => {
                        throw Error(result);
                    });
                }
            } catch (error) {
                throw Error(error);
            }
        }).catch(e => {
            throw Error(e);
        });
    }




    onControlDevices = (room: string) => {
        this.setState({
            controllingRoom:room
        })
        var roomName = {
            roomName: room
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
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }
    toggleDeviceStatus = (device: string) => {
        switch (device) {
            case "light":
                this.setState({
                    lightOn: !this.state.lightOn
                })
                var lightUpdating = {
                    roomName: this.state.controllingRoom,
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
                    roomName: this.state.controllingRoom,
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
                    roomName: this.state.controllingRoom,
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
                    roomName: this.state.controllingRoom,
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
                return res.json().then(result => { console.log(result) })
            }
            else {
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    //turn on/off all devices
    onChange = async (event: any) => {
        await this.setState({
            isTurnOnAllDevices: event.target.checked
        })
        var isTurnOn = this.state.isTurnOnAllDevices ? 1 : 0
        var data = {
            roomName: this.state.controllingRoom,
            devices: {
                light: isTurnOn,
                powerPlug: isTurnOn,
                fan: isTurnOn,
                conditioner: isTurnOn,
            }
        }
        this.UpdateAllDevicesStatus(data);
    }

    UpdateAllDevicesStatus = (data: any) => {
        fetch('http://localhost:5000/room/switchAllDevicesStatus', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(data),
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
                return res.json().then(result => { throw Error(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    render() {
        onConditioner: 2
        onFan: 1
        onPowerPlug: 2
        onLight: 1
        totalConditioner: 3
        totalFan: 3
        totalPowerPlug: 3
        totalLight: 3
        var { onConditioner, onConditioner, onFan, onPowerPlug, onLight, totalConditioner, totalFan, totalPowerPlug, totalLight, lightOn, fanOn, conditionerOn, powerPlugOn } = this.state;

        return (
            <div className="content">
                <div className="container-fluid">
                    <h3 className="text-align-right-for-link">Turning on devices status</h3>
                    <br />
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="purple">
                                    <i className="material-icons">online_prediction</i>
                                </div>
                                <div className="card-content">
                                    <p className="category">Light</p>
                                    <h3 className="card-title">{onLight}/{totalLight}</h3>
                                </div>
                                <div className="card-footer">
                                    <div className="stats">
                                        <i className="material-icons text-danger">warning</i>
                                        <a href="#pablo">Get More Space...</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="rose">
                                    <i className="material-icons">ac_unit</i>
                                </div>
                                <div className="card-content">
                                    <p className="category">Air-conditioner</p>
                                    <h3 className="card-title">{onConditioner}/{totalConditioner}</h3>
                                </div>
                                <div className="card-footer">
                                    <div className="stats">
                                        <i className="material-icons">local_offer</i> Tracked from Google Analytics
                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="green">
                                    <i className="material-icons">settings_input_antenna</i>
                                </div>
                                <div className="card-content">
                                    <p className="category">Fan</p>
                                    <h3 className="card-title">{onFan}/{totalFan}</h3>
                                </div>
                                <div className="card-footer">
                                    <div className="stats">
                                        <i className="material-icons">date_range</i> Last 24 Hours
                </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="card card-stats">
                                <div className="card-header" data-background-color="blue">
                                    <i className="material-icons">settings_input_svideo</i>
                                </div>
                                <div className="card-content">
                                    <p className="category">Power Plug</p>
                                    <h3 className="card-title">{onPowerPlug}/{totalPowerPlug}</h3>
                                </div>
                                <div className="card-footer">
                                    <div className="stats">
                                        <i className="material-icons">update</i> Just Updated
                            </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-align-right-for-link">Rooms and Devices'status</h3>
                    <br />
                    <div className="row ml-10">
                        <div className="col-md-12">
                            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                                <div className="panel panel-default">
                                    <div className="panel-heading" role="tab" id="headingOne">
                                        <h4 className="panel-title">
                                            <a className="text-align-right-for-link" role="button" data-toggle="collapse" data-parent="#accordion"
                                                href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Floor 1
                        </a>
                                        </h4>
                                    </div>
                                    <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel"
                                        aria-labelledby="headingOne">
                                        <div className="panel-body bg-panelbody">
                                            <table className="margin-auto" cell-spacing="1">
                                                <tbody>
                                                    <tr>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('218') }}>218</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-default btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('219') }}>219</button></td>
                                                        <td><button className="btn btn-default btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('201') }}>201</button></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('203') }}>203</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('204') }}>204</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('217') }}>217
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('220') }}>220
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-default btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('202') }}>202
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('205') }}>205
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('216') }}>216</button></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-default btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('WC') }}>WC</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="td-height"><img className="height-img-70" src="/img/stair.png"
                                                        /></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"><img src="/img/stair.png"
                                                            className="height-img-70" /></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn btn-default btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('215') }}>215</button></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('WC') }}>WC</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                        <td className="td-height"></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('214') }}>214</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('211') }}>211</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('209') }}>209</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('206') }}>206</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('213') }}>213
                                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('212') }}>212
                                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('210') }}>210
                                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('208') }}>208
                                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg" data-toggle="modal"
                                                            data-target="#controlDevicesModal" onClick={() => { this.onControlDevices('207') }}>207
                                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading" role="tab" id="headingTwo">
                                        <h4 className="panel-title">
                                            <a className="collapsed text-align-right-for-link" role="button" data-toggle="collapse"
                                                data-parent="#accordion" href="#collapseTwo" aria-expanded="false"
                                                aria-controls="collapseTwo">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Floor 2
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseTwo" className="panel-collapse collapse" role="tabpanel"
                                        aria-labelledby="headingTwo">
                                        <div className="panel-body">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ac
                                            leo vel rutrum. Integer varius tristique magna vel dictum. Vestibulum augue
                                            magna, convallis id velit a, porttitor fermentum sem.
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading" role="tab" id="headingThree">
                                        <h4 className="panel-title">
                                            <a className="collapsed text-align-right-for-link" role="button" data-toggle="collapse"
                                                data-parent="#accordion" href="#collapseThree" aria-expanded="false"
                                                aria-controls="collapseThree">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Floor 3
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseThree" className="panel-collapse collapse" role="tabpanel"
                                        aria-labelledby="headingThree">
                                        <div className="panel-body">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ac
                                            leo vel rutrum. Integer varius tristique magna vel dictum. Vestibulum augue
                                            magna, convallis id velit a, porttitor fermentum sem.
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading" role="tab" id="headingFour">
                                        <h4 className="panel-title">
                                            <a className="collapsed text-align-right-for-link" role="button" data-toggle="collapse"
                                                data-parent="#accordion" href="#collapseFour" aria-expanded="false"
                                                aria-controls="collapseFour">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Floor 4
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseFour" className="panel-collapse collapse" role="tabpanel"
                                        aria-labelledby="headingFour">
                                        <div className="panel-body">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ac
                                            leo vel rutrum. Integer varius tristique magna vel dictum. Vestibulum augue
                                            magna, convallis id velit a, porttitor fermentum sem.
                                        </div>
                                    </div>
                                </div>
                                <div className="panel panel-default">
                                    <div className="panel-heading" role="tab" id="headingFive">
                                        <h4 className="panel-title">
                                            <a className="collapsed text-align-right-for-link" role="button" data-toggle="collapse"
                                                data-parent="#accordion" href="#collapseFive" aria-expanded="false"
                                                aria-controls="collapseFive">
                                                <i className="fa fa-chevron-right" aria-hidden="true"></i> Floor 5
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="collapseFive" className="panel-collapse collapse" role="tabpanel"
                                        aria-labelledby="headingFive">
                                        <div className="panel-body">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas mattis ac
                                            leo vel rutrum. Integer varius tristique magna vel dictum. Vestibulum augue
                                            magna, convallis id velit a, porttitor fermentum sem.
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
                                <h4 className="modal-title">Room 218 - Control devices</h4>
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
                                                        <input type="checkbox" checked={this.state.isTurnOnAllDevices} onChange={this.onChange} /> Turn on all devices {this.state.isTurnOnAllDevices ? "ok" : "no"}
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



            </div>


        )

    }
}
export default RoomAndDevices;
