import React, { ChangeEvent, Component } from 'react';
import * as XLSX from "xlsx";


interface Props {
    match: any
}

interface State {
    
}

//let bookingRoomData = new Map();

class ImportData extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            
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



    readExcel = (e:any) => {
        const file = e.target.files[0];
        const promise = new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsArrayBuffer(file);
    
          fileReader.onload = (e:any) => {
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
    
        promise.then((d) => {
          //setstate
          console.log(d);
          
        });
      };
    


    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">

                                <input
                                    type="file"
                                    onChange={this.readExcel}
                                />


                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )

    }
}
export default ImportData;
