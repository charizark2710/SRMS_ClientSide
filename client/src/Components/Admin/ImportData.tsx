import React, { ChangeEvent, Component } from 'react';
import * as XLSX from "xlsx";


interface Props {
    match: any
}

interface State {
    fileUploaded: boolean,
    fileName:string,
    fileSize:string,
}

//let bookingRoomData = new Map();

class ImportData extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            fileUploaded: false,
            fileName:"",
            fileSize:""
        }
    }



    reloadScript() {
        const loadTable = "/js/material-dashboard.js?v=1.2.1"
        const script = document.createElement('script');
        script.src = loadTable
        script.async = true;
        script.type = 'text/javascript';
        document.getElementsByTagName("body")[0].appendChild(script);
    }



    readExcel = (e: any) => {
        const file = e.target.files[0];
        var filename = file.name;
        
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

        promise.then((data:any) => {
            //setstate
            this.setState({
                fileUploaded: true,
                fileName:filename,
            })
            this.importRoom(data);
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
                return res.json().then(result=>{
                    this.setState({
                        fileSize:result
                    })
                })
            }
            else {
                return res.json().then(result => { console.log(result.error) });
            }
        }).catch(e => {
            console.log(e);
        });

    }

    render() {
        return (

            <div className="content">
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
                                        <p>{this.state.fileUploaded ? "File imported ("+this.state.fileSize+" rooms): "+this.state.fileName : "Drag ROOM excel file here or click in this area."}</p>
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
                                        <input type="file" />
                                        <p>Drag CALENDAR excel file here or click in this area.</p>
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
