import firebase from 'firebase'

export const logout = (history: any) => {
    fetch('http://localhost:5000/logout', {
        credentials: "include",
        method: 'POST',
        cache: 'reload',
    }).then(async res => {
        try {
            if (res.ok) {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
                firebase.auth().signOut();
                history.push('/');
                location.reload();
                // this.props.history.go(1);
            } else {
                res.json().then(result => {
                    console.log(result);
                    throw Error(result);
                });
            }
        } catch (error) {
            console.log(JSON.stringify(error));
            throw Error(error);
        }
    }).catch(e => {
        console.log(JSON.stringify(e));
        throw Error(e);
    });
}