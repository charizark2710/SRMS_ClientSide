import React, { ChangeEvent, Component } from 'react';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";




interface Props {

}

interface State {
    txtFromDate: string
    txtToDate: string,
    isDisableMornitorBtn: boolean,
    report: any[],

    
    fanTime:number, 
    conditionerTime:number, 
    lightTime:number, 
    powerPlugTime:number,
    fanCost:number, 
    conditionerCost:number, 
    lightCost:number, 
    powerPlugCost:number, 
    totalCost:number 
}

// const [containerRef, { width: containerWidth }] = useMeasure();
// The chart ref that we want to download the PNG for.
// const [png, ref] = useRechartToPng();

// const handleDownload = React.useCallback(async () => {
//     // Use FileSaver to download the PNG
//     FileSaver.saveAs(png, "test.png");
// }, [png]);
// const data = [
//     { name: "Page A", fan: 4000, AC: 2400, powerPlug: 2400, light: 1000 },
//     { name: "Page B", fan: 3000, AC: 1398, powerPlug: 2210, light: 4000 },
//     { name: "Page C", fan: 2000, AC: 9800, powerPlug: 2290, light: 5000 },
//     { name: "Page D", fan: 2780, AC: 3908, powerPlug: 2000, light: 3000 },
//     { name: "Page E", fan: 1890, AC: 4800, powerPlug: 2181, light: 6000 },
//     { name: "Page F", fan: 2390, AC: 3800, powerPlug: 2500, light: 2000 },
//     { name: "Page G", fan: 3490, AC: 4300, powerPlug: 2100, light: 2300 }
// ];

class BannedList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            txtFromDate: '',
            txtToDate: '',
            isDisableMornitorBtn: true,
            report: [],

            fanTime:0, 
            conditionerTime:0, 
            lightTime:0, 
            powerPlugTime:0,
            fanCost:0, 
            conditionerCost:0, 
            lightCost:0, 
            powerPlugCost:0, 
            totalCost:0 

        }
    }

    componentDidMount = async () => {
        var d = new Date();
        await this.setState({
            txtToDate: d.toISOString().slice(0, 10)
        })
        d.setDate(d.getDate() - 7);
        await this.setState({
            txtFromDate: d.toISOString().slice(0, 10)
        })
        console.log(this.state);
        this.getReport();

    }

    onHandleChangeDate = async (event: any) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        await this.setState({
            [name]: value
        } as Pick<State, keyof State>);
        console.log(this.state);

        //validate button Booking
        var { txtFromDate, txtToDate } = this.state;
        if (txtFromDate && txtToDate) {
            this.setState({
                isDisableMornitorBtn: false,
            })
        } else {
            this.setState({
                isDisableMornitorBtn: true,
            })
        }

    }
    getReport = () => {
        this.setState({
            report: []
        })
        var { txtFromDate, txtToDate } = this.state;
        fetch(`http://localhost:5000/report?fromDate=${txtFromDate}&toDate=${txtToDate}`, {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'GET',
        }).then(res => {
            if (res.ok) {
                return res.json().then(result => {
                    this.setState({
                        report: result
                    })
                    console.log(this.state.report);
                    
                    if(this.state.report){
                        this.estimateCost();
                    }

                }

                )
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    estimateCost=()=>{
        let {
            fanTime, 
            conditionerTime, 
            lightTime, 
            powerPlugTime,
            fanCost, 
            conditionerCost, 
            lightCost, 
            powerPlugCost, 
            totalCost }=this.state;

        for (let i = 0; i < this.state.report.length; i++) {
            const el = this.state.report[i];
            fanTime += el.fan;
            conditionerTime += el.conditioner;
            lightTime += el.light;
            powerPlugTime += el.powerPlug;
        }

        conditionerCost=Math.floor(conditionerTime*0.8*2536);
        fanCost=Math.floor(fanTime*0.055*2536);
        lightCost=Math.floor(lightTime*0.036*2536);
        powerPlugCost=Math.floor(powerPlugTime*0.36*2536);
        totalCost=conditionerCost+lightCost+fanCost+powerPlugCost;
        this.setState({
            fanTime:fanTime, 
            conditionerTime:conditionerTime, 
            lightTime:lightTime, 
            powerPlugTime:powerPlugTime,
            fanCost:fanCost, 
            conditionerCost:conditionerCost, 
            lightCost:lightCost, 
            powerPlugCost:powerPlugCost, 
            totalCost:totalCost,
        })        

    }
    render() {
        let {
            fanTime, 
            conditionerTime, 
            lightTime, 
            powerPlugTime,
            fanCost, 
            conditionerCost, 
            lightCost, 
            powerPlugCost, 
            totalCost }=this.state;

        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-content">
                                    <h2>Energy consumption time (hour)</h2>

                                    <div className="row report-center">

                                        <div className="col-md-3">
                                            <div className="form-group is-empty">
                                                <label className="control-label">From Date</label>
                                                <input type="date" className="form-control" name="txtFromDate" value={this.state.txtFromDate} onChange={this.onHandleChangeDate} />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group is-empty">
                                                <label className="control-label">To Date</label>
                                                <input type="date" className="form-control" name="txtToDate" value={this.state.txtToDate} onChange={this.onHandleChangeDate} />
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <button type="button" className="btn btn-warning btn-search-report" disabled={this.state.isDisableMornitorBtn} onClick={this.getReport}>Monitor</button>
                                        </div>

                                    </div>
                                    <div id="container">

                                        <br />
                                        <LineChart
                                            // ref={ref} // Save the ref of the chart
                                            data={this.state.report}
                                            height={400}
                                            width={1100}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                                        >
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip />
                                            <Legend wrapperStyle={{ bottom: 5 }} />
                                            <Line
                                                type="monotone"
                                                dataKey="conditioner"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                            />
                                            <Line type="monotone" dataKey="fan" stroke="#82ca9d" />
                                            <Line type="monotone" dataKey="light" stroke="#ffa726" />
                                            <Line type="monotone" dataKey="powerPlug" stroke="#FF00FB" />
                                        </LineChart>
                                        <span style={{ float: "left" }}>
                                            <br></br>
                                            <div className="form-group">
                                                <div className="alert alert-success alert-bg text-center"><b>Time usage and cost estimation</b></div>
                                            </div>

                                            <table className="table table-striped table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Device</th>
                                                        <th>Time Usage (hour)</th>
                                                        <th>Wattage</th>
                                                        <th>Cost(VND)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>Light</td>
                                                        <td>{lightTime}</td>
                                                        <td>36W</td>
                                                        <td>{lightCost}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Fan</td>
                                                        <td>{fanTime}</td>
                                                        <td>55W</td>
                                                        <td>{fanCost}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Conditioner</td>
                                                        <td>{conditionerTime}</td>
                                                        <td>800W</td>
                                                        <td>{conditionerCost}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Power Plug</td>
                                                        <td>{powerPlugTime}</td>
                                                        <td>36W</td>
                                                        <td>{powerPlugCost}</td>
                                                    </tr>

                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <td className="total-colspan-2" colSpan={3} style={{ textAlign: 'right' }}><b>Total Cost:</b></td>
                                                        <td className="total-colspan-2"><b>{totalCost}</b></td>
                                                    </tr>
                                                </tfoot>
                                            </table>

                                        </span>


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
export default BannedList;
