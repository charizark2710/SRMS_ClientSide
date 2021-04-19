import firebase from 'firebase'

export const logout = (history:any) => {
    fetch('http://localhost:5000/logout', {
        credentials: "include",
        method: 'POST',
        cache: 'reload',
    }).then(async res => {
        try {
            if (res.ok) {
                await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
                localStorage.clear();
                firebase.auth().signOut();
                history.push('/');
                location.reload();
                // this.props.history.go(1);
            } else {
                res.json().then(result => {
                    throw Error(result);
                });
            }
        } catch (error) {
            throw Error(error);
        }
    }).catch(e => {
        throw Error(e);
    });
}