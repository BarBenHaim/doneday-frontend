import { useEffect, useState } from 'react'
import { loadBoard } from '../store/actions/board.action'
import { useParams } from 'react-router'
import { GroupList } from './group/GroupList'
import { GroupFilter } from './group/GroupsFilter/GroupFilter'
import { useSelector } from 'react-redux'
import { NavigationChevronDown } from 'monday-ui-react-core/icons'
import { Dialog, DialogContentContainer, EditableText } from 'monday-ui-react-core'

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
    async function loadBoardById(id) {
        try {
        } catch {}
    }

    function onUpdateField(currBoard, field, value) {
        const updatedBoard = { ...currBoard, [field]: value }
        onUpdateBoard(updatedBoard)
    }
    return (
        <section className='board-details'>
            <header className='board-details-header'>
                <div className='board-details-title'>
                    <Dialog
                        content={
                            <DialogContentContainer>
                                <div className='board-details-title-edit'>
                                    <EditableText
                                        value={currBoard.title}
                                        onChange={(value) => onUpdateField(currBoard, 'title', value)}
                                    />
                                </div>
                            </DialogContentContainer>
                        }
                        disableContainerScroll={{}}
                        hideTrigger={['click']}
                        isOpen
                        modifiers={[
                            {
                                name: 'preventOverflow',
                                options: {
                                    mainAxis: false,
                                },
                            },
                        ]}
                        position='bottom-start'
                        shouldShowOnMount
                        showTrigger={['click']}
                        startingEdge=''
                        wrapperClassName='board-details-header-board-info'
                        zIndex={4}>
                        <h1>
                            {currBoard.title}
                            <span>
                                <NavigationChevronDown size='18' lable='Collapse list' />
                            </span>
                        </h1>
                    </Dialog>
                </div>
                <div>
                    <GroupFilter setFilterBy={setFilterBy} />
                </div>
            </header>
            <GroupList boardsToDisplay={boardsToDisplay} />
        </section>
    )
}
