import React, { ChangeEvent, Component } from 'react';


interface Props {

}

interface State {
}

class Footer extends Component<Props, State> {
    render() {

        return (
            <footer className="footer">
                <div className="container-fluid">
                    
                    <p className="copyright pull-right">
                        &copy;
                        <script>
                            document.write(new Date().getFullYear())
                        </script>
                    </p>
                </div>
            </footer>
        )

    }
}
export default Footer;
