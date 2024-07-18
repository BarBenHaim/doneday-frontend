import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavigationChevronDown, NavigationChevronRight } from 'monday-ui-react-core/icons'

import { addBoard, loadBoards, removeBoard } from '../store/actions/board.action'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { BoardList } from '../cmps/BoardList'
import { boardService } from '../services/board/'
import { GroupFilter } from '../cmps/GroupFilter'

export function BoardIndex() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const groupTaskFilterBy = useSelector(storeState => storeState.boardModule.groupTaskFilterBy)
    useEffect(() => {
        loadBoards()
    }, [])

    async function onRemoveBoard(boardId) {
        try {
            await removeBoard(boardId)
            showSuccessMsg('board removed')
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onAddBoard() {
        const board = boardService.getEmptyBoard()
        try {
            const savedBoard = await addBoard(board)
            showSuccessMsg(`board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        }
    }

    async function handleSetFilterBy(newFilterBy) {}

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <section className='board-index'>
            <GroupFilter filterBy={groupTaskFilterBy} setFilterBy={handleSetFilterBy} />
            <div className='collapsible-header flex align-center' onClick={toggleCollapse}>
                {isCollapsed ? (
                    <NavigationChevronRight iconSize={16} iconLabel='Expand list' />
                ) : (
                    <NavigationChevronDown iconSize={16} iconLabel='Collapse list' />
                )}
                <h1 className='collapsible-title'>Recently visited</h1>
            </div>
            {!isCollapsed && <BoardList boards={boards} onRemoveBoard={onRemoveBoard}/>}
        </section>
    )
}
