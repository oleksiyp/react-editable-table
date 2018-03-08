import React, {Component} from 'react';

class RowEditPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            included: false,
            note: ""
        }
    }

    includedChanged(event) {
        const included = event.target.checked;
        this.setState((state) => {
            state.included = included
            return state
        })
    }

    noteChanged(event) {
        const note = event.target.value;
        this.setState((state) => {
            state.note = note
            return state
        })
    }

    setPressed() {
        this.props.onSet(this.state)
    }

    cancelPressed() {
        this.props.onCancel()
    }

    render() {
        return (
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <label>
                        Included: <input type="checkbox" value={this.state.included} onChange={this.includedChanged.bind(this)}/>
                    </label>
                    <label>
                        Note: <input type="text" value={this.state.note} onChange={this.noteChanged.bind(this)}/>
                    </label>
                </div>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div style={{flex: 100}} />
                    <button className="btn btnPrimary" onClick={this.setPressed.bind(this)}>Set</button>
                    <button className="btn" onClick={this.cancelPressed.bind(this)}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default RowEditPanel;
