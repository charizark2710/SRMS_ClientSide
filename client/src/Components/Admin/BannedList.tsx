import React, { ChangeEvent, Component } from 'react';


interface Props {

}

interface State {
}

class BannedList extends Component<Props, State> {
    createScript() {
        var scripts = [

        
                    //  "js/perfect-scrollbar.jquery.min.js",
                    //    "js/moment.min.js", "js/jquery.select-bootstrap.js", "js/jquery.datatables.js",
                    //    "js/fullcalendar.min.js", 
                       "/customJS/loadLongTable.js"];

        for (var index = 0; index < scripts.length; ++index) {
            var script = document.createElement('script');
            script.src = scripts[index];
            // script.async = true;
            // script.type = 'text/javascript';
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    }
    componentDidMount(){
        this.createScript();
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
                        <h4 className="card-title">DataTables.net</h4>
                        <div className="toolbar">
                        </div>
                        <div className="material-datatables">
                            <table id="longDatatables" className="table table-striped table-no-bordered table-hover" width="100%">
                                <thead>
                                    <tr>
                                        <th className="banned-width-40">Account</th>
                                        <th className="banned-width-20">Role</th>
                                        <th className="banned-width-30">Banned date</th>
                                        <th className="banned-width-10 text-center">Unban</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th className="banned-width-40">Account</th>
                                        <th className="banned-width-20">Role</th>
                                        <th className="banned-width-30">Banned date</th>
                                        <th className="banned-width-10 text-center">Unban</th>
                                    </tr>
                                </tfoot>
                                <tbody>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>NguyenNTK@fpt.edu.vn</td>
                                        <td>Lecture</td>
                                        <td>2021-10-01 8:00</td>
                                        <td className="td-actions text-center">
                                            <button type="button" className="btn btn-danger" data-original-title="" title="">
                                            <i className="material-icons">close</i></button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
