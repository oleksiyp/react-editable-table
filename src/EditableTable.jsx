import React, {Component} from 'react';

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.switchSort = this.switchSort.bind(this)
        this.selectRow = this.selectRow.bind(this)
        this.startSelection = this.startSelection.bind(this)
        this.endSelection = this.endSelection.bind(this)
        this.dragSelection = this.dragSelection.bind(this)
        this.state = {
            sortField: undefined,
            sortDirection: 'none',
            selected: {},
            startSelection: {}
        }
    }

    render() {
        return (
            <table width="100%">
                <thead>
                <tr>
                    {
                        this.props.header.map((item, idx) => {
                            return <th key={"h" + idx}
                                       onClick={(e) => this.switchSort(e, item)}
                                       width={(100 / this.props.header.length).toFixed(0) + "%"}
                            >{item.name}{this.renderSort(item)}</th>
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.props.data.map((row, idx) => this.renderRow(row, idx))
                }
                </tbody>
            </table>
        );
    }

    selectRow(rowId) {
        this.setState((state) => {
            state.selected = {}
            state.selected[rowId] = true
            return state
        })
    }

    startSelection(rowId, ctrlKey) {
        this.setState((state) => {
            if (!ctrlKey) {
                state.selected = {}
                state.startSelection = {}
            } else {
                state.startSelection = EditableTable.cloneHash(state.selected)
            }
            state.selectEnable = !state.selected[rowId]
            state.selected[rowId] = state.selectEnable
            state.selectionStart = rowId
            return state
        })
    }

    dragSelection(rowId) {
        if (!this.state.selectionStart) {
            return
        }
        this.setState((state) => {
            state.selected = EditableTable.cloneHash(state.startSelection)
            this.selectionRange(state.selectionStart, rowId, state.selected, state.selectEnable)
            return state
        })
    }

    endSelection(rowId) {
        if (!this.state.selectionStart) {
            return
        }
        this.setState((state) => {
            state.selected = EditableTable.cloneHash(state.startSelection)
            this.selectionRange(state.selectionStart, rowId, state.selected, state.selectEnable)
            state.selectionStart = undefined
            return state
        })
    }

    selectionRange(rowId1, rowId2, selection, enable) {
        var cnt = 0;
        if (rowId2 === rowId1) {
            selection[rowId1] = enable
            return
        }
        for (const i in this.props.data) {
            const row = this.props.data[i];
            let id = row.id;
            if (id === rowId1 || id === rowId2) {
                cnt++;
                if (cnt === 2) {
                    selection[id] = enable;
                    break
                }
            }
            if (cnt === 1) {
                selection[id] = enable;
            }
        }
        return
    }

    renderRow(row, vIdx) {
        const selected = this.state.selected
        const trAttributes = {}

        if (selected[row.id]) {
            trAttributes.className = "selected"
        }
        if (this.props.multiline) {
            trAttributes['onMouseDown'] = (e) => this.startSelection(row.id, e.ctrlKey)
            trAttributes['onMouseOver'] = (e) => this.dragSelection(row.id)
            trAttributes['onMouseUp'] = (e) => this.endSelection(row.id)
        } else {
            trAttributes['onClick'] = (e) => this.selectRow(row.id)
        }

        return <tr
            key={"r" + vIdx} {...trAttributes}>{this.props.header.map((item, hIdx) => this.renderItem(row, item, vIdx, hIdx))}</tr>;
    }

    renderItem(row, header, vIdx, hIdx) {
        const value = row[header.field];
        const transform = header.view || ((data) => data)
        const key = "c" + vIdx + "_" + hIdx;
        switch (header.edit) {
            case 'checkbox':
                return <td key={key}>
                    <input type="checkbox" checked={value}
                           onChange={(e) => this.props.onEditRow(row, header, e.target.checked)}/>
                </td>
            case 'text':
                return <td key={key}>
                    <input type="text" value={value}
                           onChange={(e) => this.props.onEditRow(row, header, e.target.value)}/>
                </td>
            default:
                return <td key={key}>{transform(value)}</td>
        }
    }

    renderSort(item) {
        if (item.field === this.state.sortField) {
            switch (this.state.sortDirection) {
                case 'asc':
                    return <span> ⬇</span>
                case 'desc':
                    return <span> ⬆</span>
                default:
                    return <span> &nbsp;</span>
            }
        }
    }

    switchSort(event, item) {
        let sortParams = {
            sortField: item.field,
            sortDirection: item.field !== this.state.sortField ? "asc" : this.nextDirection(this.state.sortDirection)
        };
        this.setState(sortParams)
        this.props.onSortChanged(sortParams)
    }

    nextDirection(sortDirection) {
        switch (this.state.sortDirection) {
            case 'asc':
                return 'desc'
            case 'desc':
                return 'none'
            default:
                return 'asc'
        }
    }

    static cloneHash(obj) {
        const result = {};
        for (const i in obj) {
            result[i] = obj[i];
        }
        return result;
    }
}

export default EditableTable;
