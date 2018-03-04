import React, {Component} from 'react';
import './App.css';
import EditableTable from "./EditableTable";
import ScrollableLoader from "./ScrollableLoader";
import initialData from "./initialData"

class App extends Component {
    constructor(props) {
        super(props)
        this.loadData = this.loadData.bind(this)
        this.qChanged = this.qChanged.bind(this)
        this.editRow = this.editRow.bind(this)
        this.sortChanged = this.sortChanged.bind(this)
        this.filterChanged = this.filterChanged.bind(this)

        this.state = {
            initialData: initialData,
            data: initialData,
            qParams: {
                filter: "",
                sort: {
                    sortField: undefined,
                    sortDirection: 'none'
                }
            }
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

    render() {
        return (
            <div className="App" style={{display: "flex", flexDirection: "column", height: "100%"}}>
                <input type="text" placeholder="Search" value={this.state.qParams.filter} onChange={this.filterChanged}/>
                <ScrollableLoader loadData={this.loadData} dataKey={this.state.qParams}>
                    <EditableTable header={[
                        {name: "Included", field: "included", edit: "checkbox"},
                        {name: "Name", field: "name"},
                        {name: "Size", field: "size", view: App.mapSize},
                        {name: "Note", field: "note", edit: "text"},
                    ]} onSortChanged={this.sortChanged} onEditRow={this.editRow}/>
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
