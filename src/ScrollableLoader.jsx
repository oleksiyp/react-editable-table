import React, {Component} from 'react';

class ScrollableLoader extends Component {
    constructor(props) {
        super(props);
        this.scroll = this.scroll.bind(this)
        this.loadDataS = this.loadDataS.bind(this)
        this.state = {
            items: 40,
            scrollPos: 0,
            data: [],
            dataKey: JSON.stringify(props.dataKey)
        }
    }

    componentWillMount() {
        this.loadData()
    }

    componentWillReceiveProps(newProps) {
        let newDk = JSON.stringify(newProps.dataKey);
        if (newDk !== this.state.dataKey) {
            let initialState = {
                items: 40,
                scrollPos: 0,
                data: [],
                dataKey: newDk
            };
            this.setState(initialState)
            this.loadDataS(initialState)
        }
    }

    loadData() {
        this.loadDataS(this.state);
    }

    loadDataS(state) {
        const self = this
        let nHas = state.data.length;
        let nRequired = state.items;
        if (nRequired > nHas) {
            this.props.loadData(
                nHas,
                nRequired - nHas,
                (newData) => {
                    const newState = state
                    newState.data = newState.data.concat(newData)
                    self.setState(newState)
                }
            )
        }
    }

    scroll(event) {
        const self = this
        const scrollTop = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        const pos = scrollTop + event.target.clientHeight + 100;
        if (pos > scrollHeight) {
            if (pos > this.state.scrollPos) {
                const state = this.state
                state.scrollPos = pos
                state.items += 20
                self.setState(state)
                this.loadDataS(state)
            }
        }
    }

    render() {
        return <div style={{overflowY: "auto", flex: "100%"}} onScroll={this.scroll}>
            {React.cloneElement(this.props.children, {data: this.state.data})}
        </div>
    }
}

export default ScrollableLoader