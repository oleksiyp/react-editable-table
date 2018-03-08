import React, {Component} from 'react';

class Popup extends Component {
    render() {
        const coords = this.props.coords
        if (!coords) {
            return ""
        }


        return (
            <div className="popup" style={{position: "absolute", top: coords.top, left: coords.left}}>
                {this.props.children}
            </div>
        )
    }
}

export default Popup;
