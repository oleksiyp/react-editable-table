import React, {Component} from "react"

class Tree extends Component {
    constructor(props) {
        super(props)
        this.state = {selection: -1}
    }

    render() {
        if (!this.props['tree']) {
            return ""
        }
        const self = this

        return <div className="tree">
            {this.props.tree.map((item, idx) => (
                <div key={idx} style={{marginLeft: Tree.level(item) * 15}} className={Tree.selectedCls(self.state, idx)} onClick={(e) => this.setState({selection: idx})}>
                    {item}
                </div>
                )
            )}
        </div>
    }

    static selectedCls(state, idx) {
        let selection = state['selection'];
        if (selection && idx === selection) {
            return "selected"
        } else {
            return ""
        }
    }

    static level(item) {
        return item.lastIndexOf(' ') + 1
    }
}

export default Tree