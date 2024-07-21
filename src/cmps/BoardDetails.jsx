import { useEffect, useState } from 'react'
import { loadBoard } from '../store/actions/board.action'
import { useParams } from 'react-router'
import { GroupList } from './group/GroupList'
import { GroupFilter } from './group/GroupsFilter/GroupFilter'
import { useSelector } from 'react-redux'

export function BoardDetails() {
    const { boardId } = useParams()

    const currBoard = useSelector((storeState) => storeState.boardModule.boards.find((board) => board._id === boardId))
    const [boardsToDisplay, setBoardsToDisplay] = useState(currBoard?.groups || [])
    useEffect(() => {
        setBoardsToDisplay(currBoard?.groups || [])
    }, [currBoard])

    useEffect(() =>
        // loadBoardById(boardId)
        {}, [boardId])

    const setFilterBy = (arr) => {
        setBoardsToDisplay(arr)
    }

    async function loadBoardById(id) {
        try {
        } catch {}
    }

    return (
        <section className='board-details'>
            <header className='board-details-header'>
                <div className='board-details-title'>
                    <h1>{currBoard.title}</h1>
                </div>
                <div>
                    <GroupFilter setFilterBy={setFilterBy} />
                </div>
            </header>
            <GroupList boardsToDisplay={boardsToDisplay} />
        </section>
    )
}
