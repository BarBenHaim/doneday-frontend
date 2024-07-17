import React from 'react'
import { createBoards } from '../services/util.service'
import GroupPreview from './GroupPreview.jsx'

function loadBoard() {
    const boards = createBoards()
    return boards[0]
}

export function GroupList() {
    const board = loadBoard()
    return (
        <div className='group-list'>
            {board.groups.map(group => (
                <GroupPreview key={group.id} group={group} members={board.members} labels={board.labels} />
            ))}
        </div>
    )
}

export default GroupList
