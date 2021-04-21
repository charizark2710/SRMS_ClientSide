import React, { ChangeEvent, Component } from 'react';
import * as XLSX from "xlsx";
import { ToastContainer, toast } from 'react-toastify';


interface Props {
    match: any
}

interface State {
    fileRoomUploaded: boolean,
    fileCalendarUploaded: boolean,
    fileRoomName: string,
    fileRoomSize: string,
    fileCalendarName: string,
    fileCalendarSize: string,
}

//let bookingRoomData = new Map();

class ImportData extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            fileRoomUploaded: false,
            fileCalendarUploaded: false,
            fileRoomName: "",
            fileRoomSize: "",
            fileCalendarName: "",
            fileCalendarSize: "",
        }
    }




    readExcel = (e: any) => {
        const file = e.target.files[0];
        var fileName = file.name;

        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((data: any) => {
            if (fileName === "rooms.xlsx") {
                this.importRoom(data);
                //setstate
                this.setState({
                    fileRoomName: fileName,
                })
            }else if(fileName==="calendar.xlsx"){
                this.importCalendar(data);
                //setstate
                this.setState({
                    fileCalendarName: fileName,
                })
            }


        });
    };


    importRoom = (rooms: any) => {
        fetch('http://localhost:5000/room', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(rooms)
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    this.setState({
                        fileRoomUploaded: true,
                        fileRoomSize: result
                    })
                })
            }
            else {
                toast.error("Failed to pload sample rooms")
            }
        }).catch(e => {
            console.log(e);
        });

    }

    importCalendar= (calendars: any) => {
        fetch('http://localhost:5000/calendar', {
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(calendars)
        }).then(res => {
            if (res.status === 200) {
                return res.json().then(result => {
                    this.setState({
                        fileCalendarUploaded: true,
                        fileCalendarSize: result
                    })
                })
            }
            else {
                toast.error("Failed to pload sample calendar")
            }
        }).catch(e => {
            console.log(e);
        });

    }


    renderUpLoadcalendar() {
        if (this.state.fileCalendarUploaded) {
            return <p>File imported ({this.state.fileCalendarSize} calendars) {this.state.fileCalendarName} </p>
        } else {
            return (
                <p>Drag <span className="label label-warning">CALENDAR</span> excel file here or click in this area.</p>
            );
        }
    }

    renderUpLoadRoom() {
        if (this.state.fileRoomUploaded) {
            return <p>File imported ({this.state.fileRoomSize} rooms) {this.state.fileRoomName} </p>
        } else {
            return (
                <p>Drag <span className="label label-warning">ROOM</span> excel file here or click in this area.</p>
            );
        }
    }
    render() {
        return (

            <div className="content">
                 <ToastContainer />
                <div className="container-fluid">

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card import-room-height-500">
                                <div className="card-header">
                                    <h4 className="card-title text-warning">Import Room Data -
                            <small>FPTU-DA NANG CAMPUS</small>
                                    </h4>
                                </div>
                                <div className="card-content">
                                    <div className="formUpload">
                                        <input type="file" onChange={this.readExcel} />
                                        {this.renderUpLoadRoom()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card import-room-height-500">
                                <div className="card-header">
                                    <h4 className="card-title text-warning">Import Calendar Data -
                            <small>FPTU-DA NANG CAMPUS</small>
                                    </h4>
                                </div>
                                <div className="card-content">
                                    <div className="formUpload">
                                        <input type="file" onChange={this.readExcel} />
                                        {this.renderUpLoadcalendar()}

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
export default ImportData;
