import React, { ChangeEvent, Component } from 'react';
import { formatDate, formatTime } from "../Common/formatDateTime";
import FullCalendarIO from '../Common/FullCalendarIO';

interface Props {

}

interface State {
    calendars: any
}

class Calendar extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
    }

    render() {
        return (
            <div className="content">
                <div className="container-fluid">
                    <div className="header text-center">
                        <h4><a>Teaching</a> &  <a>Booking</a> calendar</h4>
                    </div>
                    <div className="row">
                        <div className="col-md-10 col-md-offset-1">
                            <div className="card card-calendar">
                                <div className="card-content ps-child">
                                    <FullCalendarIO />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )

    }
}
export default Calendar;
