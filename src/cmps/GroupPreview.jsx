import React from 'react'
import {
    Table,
    TableHeader,
    TableBody,
    TableCell,
    TableRow,
    TableHeaderCell,
    Label,
    Avatar,
    Text,
} from 'monday-ui-react-core'
import 'monday-ui-react-core/dist/main.css'

function GroupPreview({ group, members, labels }) {
    if (!group || !group.tasks) {
        return <div>Loading...</div>
    }

    const columns = [
        { title: 'Task' },
        { title: 'Member' },
        { title: 'Label' },
        { title: 'Status' },
        { title: 'Due Date' },
        { title: 'Priority' },
    ]

    return (
        <div className='group-preview'>
            <h2>{group.title}</h2>
            <div className='table-wrapper'>
                <Table columns={columns}>
                    <TableHeader>
                        {columns.map((headerCell, index) => (
                            <TableHeaderCell
                                key={index}
                                title={headerCell.title}
                                className={index === 0 ? 'sticky-col' : ''}
                            />
                        ))}
                    </TableHeader>
                    <TableBody>
                        {group.tasks.map((task, index) => (
                            <TableRow key={index}>
                                <TableCell className='sticky-col'>
                                    <Text>{task.title}</Text>
                                </TableCell>
                                <TableCell>
                                    <Avatar
                                        text={
                                            members.find(member => member.id === task.memberId)?.fullname || 'Unknown'
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Label text={labels.find(label => label.id === task.labelId)?.name || 'No Label'} />
                                </TableCell>
                                <TableCell>
                                    <Label text={task.status || 'Pending'} color='positive' />
                                </TableCell>
                                <TableCell>
                                    <Text>{task.dueDate || 'No Due Date'}</Text>
                                </TableCell>
                                <TableCell>
                                    <Label text={task.priority || 'Medium'} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default GroupPreview
