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
                        <a href="http://www.creative-tim.com"> Creative Tim </a>, made with love for a better web
                    </p>
                </div>
            </footer>
        )

    }
}
export default Footer;
