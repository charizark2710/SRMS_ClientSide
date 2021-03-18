import React, { ChangeEvent, Component } from 'react';


interface Props {

}

interface State {
    onConditioner: string
    onFan: string
    onGround: string
    onLight: string
    totalConditioner: string
    totalFan: string
    totalGround: string
    totalLight: string
}

class RoomAndDevices extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            onConditioner: '',
            onFan: '',
            onGround: '',
            onLight: '',
            totalConditioner: '',
            totalFan: '',
            totalGround: '',
            totalLight: '',
        }
    }
    componentDidMount() {
        this.getNumberOfDevices();
    }

    getNumberOfDevices = () => {
        fetch('http://localhost:5000/capstone-srms-thanhnt/us-central1/app/room/countNumberTurnOnDevices', {
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
                            onGround: result.onGround,
                            onLight: result.onLight,
                            totalConditioner: result.totalConditioner,
                            totalFan: result.totalFan,
                            totalGround: result.totalGround,
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


    render() {
        onConditioner: 2
        onFan: 1
        onGround: 2
        onLight: 1
        totalConditioner: 3
        totalFan: 3
        totalGround: 3
        totalLight: 3
        var { onConditioner,onConditioner, onFan,onGround,onLight,totalConditioner, totalFan,totalGround,totalLight} = this.state;
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
                                    <p className="category">Power Socket</p>
                                    <h3 className="card-title">{onGround}/{totalGround}</h3>
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
                                                            data-target="#myModal">218</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-default btn-lg">219</button></td>
                                                        <td><button className="btn btn-default btn-lg">201</button></td>
                                                        <td><button className="btn btn-success btn-lg">203</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg">204</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">217
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">220
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-default btn-lg">202
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">205
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
                                                        <td><button className="btn btn-success btn-lg">216</button></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-default btn-lg">WC</button></td>
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
                                                        <td><button className="btn btn-default btn-lg">215</button></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg">WC</button></td>
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
                                                        <td><button className="btn btn-success btn-lg">214</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg">211</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg">209</button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn btn-success btn-lg">206</button></td>
                                                    </tr>
                                                    <tr>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">213
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">212
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">210
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">208
                                            <div className="ripple-container"></div>
                                                        </button></td>
                                                        <td className="td-width"></td>
                                                        <td><button className="btn-margin-top btn btn-success btn-lg">207
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
            </div>


        )

    }
}
export default RoomAndDevices;
