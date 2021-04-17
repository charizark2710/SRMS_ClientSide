import React, { ChangeEvent, Component } from 'react';
//Fullcalendar and Realted Plugins
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"; // needed
import listPlugin from '@fullcalendar/list'; //For List View
import firebase from 'firebase'
import { db, client } from '../../FireBase/config'
import message from '../../model/Message';
import { formatDate, formatTime } from "./formatDateTime";

interface Props {

}

interface State {
    calendars: any
}

class FullCalendarIO extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            calendars: []
        }
    }

    calendarManagement = () => {
        this.setState({ calendars: [] });
        db.ref('calendar').on('child_added', snap => {
            const data: any = snap.val();
            if (data) {
                Object.values(data).forEach((calen: any) => {
                    var calendar: any = {
                        title: calen.room + '-' + calen.userId,
                        start: formatDate(calen.date) + 'T' + formatTime(calen.from),
                        end: formatDate(calen.date) + 'T' + formatTime(calen.to),
                        id: calen.id
                    }
                    this.setState({ calendars: [... this.state.calendars, calendar] })
                })
            }
        });
        db.ref('calendar').off('child_added', snap => {
            const data: any = snap.val();
            if (data) {
                Object.values(data).forEach((calen: any) => {
                    var calendar: any = {
                        title: calen.room + '-' + calen.userId,
                        start: formatDate(calen.date) + 'T' + formatTime(calen.from),
                        end: formatDate(calen.date) + 'T' + formatTime(calen.to),
                        id: calen.id
                    }
                    this.setState({ calendars: [... this.state.calendars, calendar] })
                })
            }
        });
        db.ref('calendar').on('child_changed', snap => {
            const data: any = snap.val();
            if (data) {
                var calendar: any = {
                    id: data.id,
                    title: data.roomName + '-' + data.userId,
                    start: formatDate(data.date) + 'T' + formatTime(data.from),
                    end: formatDate(data.date) + 'T' + formatTime(data.to),
                }
                this.setState({ calendars: [... this.state.calendars, calendar] })
            }
        });
        db.ref('calendar').off('child_changed', snap => {
            const data: any = snap.val();
            if (data) {
                var calendar: any = {
                    title: data.roomName + '-' + data.userId,
                    start: formatDate(data.date) + 'T' + formatTime(data.from),
                    end: formatDate(data.date) + 'T' + formatTime(data.to),
                }
                this.setState({ calendars: [... this.state.calendars, calendar] })
            }
        });

        db.ref('calendar').on('child_removed', snap => {
            const data: any = snap.val();
            if (data) {
                const arr = this.state.calendars;
                const newArr = arr.filter((noti: any) => {
                    return noti.id !== data.id;
                })
                this.setState({ calendars: newArr })
            }
        });

        db.ref('calendar').off('child_removed', snap => {
            const data: any = snap.val();
            if (data) {
                const arr = this.state.calendars;
                const newArr = arr.filter((noti: any) => {
                    return noti.id !== data.id;
                })
                this.setState({ calendars: newArr })
            }
        });
    }
    componentDidMount() {
        this.calendarManagement();
    }



    render() {
        console.log(this.state.calendars);

        return (

            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek,dayGridDay,listWeek'
                }}
                dayMaxEvents
                events={this.state.calendars}
            />

        )

    }
}
export default FullCalendarIO;
