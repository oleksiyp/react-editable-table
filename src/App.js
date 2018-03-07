import React, {Component} from 'react';
import './App.css';
import EditableTable from "./EditableTable";
import ScrollableLoader from "./ScrollableLoader";
import initialData from "./initialData"
import Popup from "./Popup";

class App extends Component {
    constructor(props) {
        super(props)
        this.loadData = this.loadData.bind(this)
        this.qChanged = this.qChanged.bind(this)
        this.editRow = this.editRow.bind(this)
        this.sortChanged = this.sortChanged.bind(this)
        this.filterChanged = this.filterChanged.bind(this)
        this.selectionChanged = this.selectionChanged.bind(this)

        this.state = {
            initialData: initialData,
            data: initialData,
            qParams: {
                filter: "",
                sort: {
                    sortField: undefined,
                    sortDirection: 'none'
                }
            },
            editPopup: undefined,
            selection: {}
        }
    }

    static mapSize(sz) {
        if (sz <= 1024) {
            return sz
        } else if (sz <= 1024 * 1024) {
            return (sz / 1024).toFixed(2) + "KB"
        } else if (sz <= 1024 * 1024 * 1024) {
            return (sz / (1024 * 1024)).toFixed(2) + "MB"
        } else {
            return (sz / (1024 * 1024 * 1024)).toFixed(2) + "GB"
        }
    }

    loadData(offset, limit, callback) {
        callback(this.state.data.slice(offset, offset + limit))
    }

    sortChanged(crit) {
        this.qChanged(crit, this.state.qParams.filter)
    }

    filterChanged(e) {
        this.qChanged(this.state.qParams.sort, e.target.value)
    }

    qChanged(crit, filter) {
        function cmpField(a, b, direction) {
            if (a < b) {
                return direction === 'asc' ? 1 : -1
            } else if (a > b) {
                return direction === 'asc' ? -1 : 1
            } else {
                return 0
            }
        }

        function cmp(a, b) {
            const x = a[crit.sortField]
            const y = b[crit.sortField]
            return cmpField(x, y, crit.sortDirection)
        }


        this.setState((oldState) => {
            oldState.qParams.sort = crit
            oldState.qParams.filter = filter
            let data = oldState.initialData
            if (!(crit.sortField === undefined
                    || crit.sortDirection === 'none')) {
                data = data.slice()
                data.sort(cmp)
            }
            if (filter !== "") {
                const newData = []
                for (const idx in data) {
                    if (data[idx].name.indexOf(filter) !== -1) {
                        newData.push(data[idx])
                    }
                }
                data = newData
            }
            oldState.data = data
            return oldState
        })
    }


    editRow(row, header, newValue) {
        this.setState((oldState) => {
            oldState.data = App.applyEdit(oldState.data, row.id, header.field, newValue)
            oldState.initialData = App.applyEdit(oldState.initialData, row.id, header.field, newValue)
            return oldState
        })
    }

    selectionChanged(pos, selection) {
        const el1 = pos.el1, el2 = pos.el2
        this.setState((state) => {
            if (Object.keys(selection).length === 0) {
                state.editPopup = undefined
            } else {
                state.editPopup = {
                    top: (el1.top + el2.top) / 2,
                    left: (el1.left + el2.left) / 2,
                }
            }
            state.selection = selection
            return state
        })
    }

    render() {
        return (
            <div className="App" style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Popup coords={this.state.editPopup}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <label>
                                Included: <input type="checkbox"/>
                            </label>
                            <label>
                                Note: <input type="text"/>
                            </label>
                        </div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <div style={{flex: 100}} />
                            <button className="btn">Set</button>
                        </div>
                    </div>
                </Popup>
                <input type="text" placeholder="Search" value={this.state.qParams.filter}
                       onChange={this.filterChanged}/>
                <ScrollableLoader loadData={this.loadData} dataKey={this.state.qParams}>
                    <EditableTable multiline={true} header={[
                        {name: "Included", field: "included", edit: "checkbox"},
                        {name: "Name", field: "name"},
                        {name: "Size", field: "size", view: App.mapSize},
                        {name: "Note", field: "note", edit: "text"},
                    ]} onSortChanged={this.sortChanged}
                                   onEditRow={this.editRow}
                                   onSelectionChanged={this.selectionChanged}/>
                </ScrollableLoader>
            </div>
        );
    }

    static applyEdit(data, id, field, newValue) {
        for (const idx in data) {
            if (data[idx].id === id) {
                data[idx][field] = newValue
            }
        }
        return data
    }

}

export default App;
