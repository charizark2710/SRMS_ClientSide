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
    calendars: any,
    isError: any
}

class FullCalendarIO extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            calendars: [],
            isError: false
        }
    }

    calendarManagement = () => {
        const calendar: any = [];
        fetch('http://localhost:5000/calendar', {
            method: 'GET',
            credentials: "include",
        }).then(res => {
            res.json().then(result => {
                try {
                    for (let cal of result) {
                        const value = {
                            title: cal.room + '-' + cal.userId,
                            start: formatDate(cal.date) + 'T' + formatTime(cal.from),
                            end: formatDate(cal.date) + 'T' + formatTime(cal.to),
                            id: cal.id
                        }
                        calendar.push(value);
                    }
                    this.setState({ calendars: calendar, isError: false });
                } catch (error) {
                    this.setState({isError: true});
                    window.history.pushState('', '', '/');
                    location.reload();
                    throw new Error(error);
                }
            });
        }).catch(e => {
            console.log(e);
        });
    }
    componentDidMount() {
        this.calendarManagement();
    }

    render() {
        if (!this.state.isError) {
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
        } else {
            return null;
        }

    }
}
export default FullCalendarIO;
