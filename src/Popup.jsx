import React, {Component} from 'react';

class Popup extends Component {
    render() {
        const coords = this.props.coords
        if (!coords) {
            return ""
        }

        const c = {top: Math.max(coords.top - 30, 0), left: Math.max(coords.left - 100, 0)}

        return (
            <div className="popup" style={{position: "absolute", top: c.top, left: c.left}}>
                {this.props.children}
            </div>
        )
    }
}

export default Popup;
