import React, { ChangeEvent, Component } from 'react';
import FileSaver from "file-saver";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import { useRechartToPng } from "recharts-to-png";




interface Props {

}

interface State {
    requestList: any[]
}

// const [containerRef, { width: containerWidth }] = useMeasure();
// The chart ref that we want to download the PNG for.
// const [png, ref] = useRechartToPng();

// const handleDownload = React.useCallback(async () => {
//     // Use FileSaver to download the PNG
//     FileSaver.saveAs(png, "test.png");
// }, [png]);
const data = [
    { name: "Page A", fan: 4000, AC: 2400, powerPlug: 2400, light:1000 },
    { name: "Page B", fan: 3000, AC: 1398, powerPlug: 2210, light:4000 },
    { name: "Page C", fan: 2000, AC: 9800, powerPlug: 2290, light:5000 },
    { name: "Page D", fan: 2780, AC: 3908, powerPlug: 2000, light:3000 },
    { name: "Page E", fan: 1890, AC: 4800, powerPlug: 2181, light:6000 },
    { name: "Page F", fan: 2390, AC: 3800, powerPlug: 2500, light:2000 },
    { name: "Page G", fan: 3490, AC: 4300, powerPlug: 2100, light:2300 }
];

class BannedList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            requestList: []
        }
    }

    componentDidMount() {

    }




    render() {
        return (

            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header card-header-icon" data-background-color="orange" data-toggle="modal"
                                    data-target="#addBanModal">
                                    <i className="material-icons">library_add</i>
                                </div>
                                <div className="card-content">

                                    <div id="container">
                                        <h2>useRechartToPng example with FileSaver</h2>
                                        <br />
                                        <LineChart
                                            // ref={ref} // Save the ref of the chart
                                            data={data}
                                            height={400}
                                            width={1000}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                                        >
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <Tooltip />
                                            <Legend wrapperStyle={{ bottom: 5 }} />
                                            <Line
                                                type="monotone"
                                                dataKey="AC"
                                                stroke="#8884d8"
                                                activeDot={{ r: 8 }}
                                            />
                                            <Line type="monotone" dataKey="fan" stroke="#82ca9d" />
                                            <Line type="monotone" dataKey="light" stroke="#ffa726" />
                                            <Line type="monotone" dataKey="powerPlug" stroke="#FF00FB" />
                                        </LineChart>
                                        <span style={{ float: "left" }}>
                                            <button >Download</button>
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
