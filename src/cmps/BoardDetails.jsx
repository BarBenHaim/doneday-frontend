import { useEffect, useState } from 'react'
import { loadBoard, toggleStarredBoard, updateBoard } from '../store/actions/board.action'
import { useParams } from 'react-router'
import { GroupList } from './group/GroupList'
import { GroupFilter } from './group/GroupsFilter/GroupFilter'
import { useSelector } from 'react-redux'
import { Favorite, NavigationChevronDown } from 'monday-ui-react-core/icons'
import { Button, Dialog, DialogContentContainer, Divider, EditableHeading, EditableText, Icon, TextArea } from 'monday-ui-react-core'

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


    function onUpdateField(currBoard, field, value) {
        const updatedBoard = { ...currBoard, [field]: value }
        onUpdateBoard(updatedBoard)
    }

    async function onUpdateBoard(board) {
        try {
            await updateBoard(board)
            showSuccessMsg('Group updated')
        } catch (err) {
            showErrorMsg('Cannot update group')
        }
    }
    async function handleToggleStarred() {
            toggleStarredBoard(currBoard._id)
            currBoard.isStarred = !currBoard.isStarred
    }

    return (
        <section className='board-details'>
            <header className='board-details-header'>
                <div
                    className='board-details-title'
                    style={{
                        width: 'auto',
                    }}>
                    <Dialog
                        content={
                            <DialogContentContainer
                                size={DialogContentContainer.sizes.LARGE}
                                type={DialogContentContainer.types.POPOVER}>
                                <div className='board-details-title-edit'>
                                    <EditableHeading
                                        type='h2'
                                        value={currBoard.title}
                                        onChange={(value) => onUpdateField(currBoard, 'title', value)}
                                        weight='bold'
                                        size="large"

                                    />
                        <Button className='starred-btn' title='Starred' onClick={handleToggleStarred}  kind={Button.kinds.TERTIARY}>
                            {currBoard.isStarred ? (
                                <Icon iconType={Icon.type.ICON_FONT} icon='fa fa-star' className='yellow-icon' />
                            ) : (
                                <Favorite className='monday-favorite-icon' />
                            )}
                        </Button>
                                </div>
                                <TextArea
                                    data-testid='editable-input's
                                    resize
                                    rows={6}
                                    tabIndex={6}
                                    maxLength={1000}
                                    controlled
                                    size="large"
                                    value={currBoard.description}
                                    weight='normal'
                                    onChange={(value) => onUpdateField(currBoard, 'description', value)}
                                />
                                <div
                                    style={{
                                        height: '40px',
                                        width: '100%',
                                    }}>
                                    <Divider direction='horizontal' />
                                </div>
                            </DialogContentContainer>
                        }
                        hideTrigger={['clickoutside']}
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
                        showTrigger={['click']}
                        wrapperClassName='board-details-header-board-info'
                        zIndex={4}>
                        <h2 className='normal'>
                            {currBoard.title}
                            <span>
                                <NavigationChevronDown size='18' lable='Collapse list' />
                            </span>
                        </h2>
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
