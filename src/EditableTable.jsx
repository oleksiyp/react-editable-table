import React, {Component} from 'react';

class EditableTable extends Component {
    constructor(props) {
        super(props);
        this.switchSort = this.switchSort.bind(this)
        this.state = {sortField: undefined, sortDirection: 'none'}
    }

    render() {
        return (
            <table width="100%">
                <thead>
                <tr>
                    {
                        this.props.header.map((item,idx) => {
                            return <th key={"h"+idx}
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

    renderRow(row, vIdx) {
        return <tr key={"r"+vIdx}>{this.props.header.map((item, hIdx) => this.renderItem(row, item, vIdx, hIdx))}</tr>;
    }

    renderItem(row, header, vIdx, hIdx) {
        const value = row[header.field];
        const transform = header.view || ((data) => data)
        const key = "c" + vIdx + "_" + hIdx;
        switch (header.edit) {
            case 'checkbox':
                return <td key={key}>
                    <input type="checkbox" checked={value} onChange={(e) => this.props.onEditRow(row, header, e.target.checked)}/>
                </td>
            case 'text':
                return <td key={key}>
                    <input type="text" value={value} onChange={(e) => this.props.onEditRow(row, header, e.target.value)}/>
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
}

export default EditableTable;
