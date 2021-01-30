import React, { ChangeEvent, Component } from 'react';

import firebase from 'firebase'

interface Props {
}

interface State {
    uid: string,
    idToken: string,
    name: string,
    isLoaded: boolean,
    employeeId: string
}

class Logout extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        fetch('http://localhost:5000/booming-pride-283013/us-central1/app/logout', {
            credentials: "include",
            method: 'POST',
        }).then(res => {
            try {
                if (res.ok) {
                    firebase.auth().signOut();
                    console.log('Tra ve trang dang nhap');
                } else {
                    res.json().then(result => {
                        throw Error(result);
                    });
                }
            } catch (error) {
                throw Error(error);
            }

        })
    }
}