import { useEffect, useState } from 'react'
import { loadBoard, removeBoard, toggleStarredBoard, updateBoard } from '../store/actions/board.action'
import { Navigate, useNavigate, useParams } from 'react-router'
import { GroupList } from './group/GroupList'
import { GroupFilter } from './group/GroupsFilter/GroupFilter'
import { useSelector } from 'react-redux'
import { Delete, Favorite, NavigationChevronDown } from 'monday-ui-react-core/icons'
import {
    Avatar,
    AvatarGroup,
    Button,
    Dialog,
    DialogContentContainer,
    Divider,
    EditableHeading,
    EditableText,
    Icon,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuTitle,
    SplitButton,
    SplitButtonMenu,
    TextArea,
} from 'monday-ui-react-core'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function BoardDetails() {
    const { boardId } = useParams()

    const currBoard = useSelector((storeState) => storeState.boardModule.boards.find((board) => board._id === boardId))
    const [boardsToDisplay, setBoardsToDisplay] = useState(currBoard?.groups || [])
    const navigate = useNavigate()

    useEffect(() => {
        setBoardsToDisplay(currBoard?.groups || [])
        console.log('currBoard', currBoard)
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
        try {
            await toggleStarredBoard(currBoard._id)
            currBoard.isStarred = !currBoard.isStarred
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onRemoveBoard(currBoardId) {
        console.log('boardId remove', currBoardId)
        try {
            await removeBoard(currBoardId)
            navigate(`/board`)
            showSuccessMsg('board removed')
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }


    if (!currBoard) return <div>Loading...</div>

    return (
        <section className='board-details'>
            <header className='board-details-header'>
                <div>
                    <div
                        className='board-details-title'
                        style={{
                            width: 'auto',
                            display: 'flex',
                            justifyContent: 'space-Between',
                            alignItems: 'center',
                            // width: '100%',
                        }}>
                        <Dialog
                            content={
                                <DialogContentContainer
                                    size={DialogContentContainer.sizes.LARGE}
                                    type={DialogContentContainer.types.POPOVER}>
                                    <div
                                        className='board-details-title-edit'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-evenly',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}>
                                        <EditableHeading
                                            type='h2'
                                            value={currBoard.title}
                                            onChange={(value) => onUpdateField(currBoard, 'title', value)}
                                            weight='bold'
                                            size='large'
                                        />
                                        <Button
                                            className='favorite-button'
                                            onClick={() =>{handleToggleStarred}}
                                            kind={Button.kinds.TERTIARY}>
                                            {currBoard.isStarred ? (
                                                <Icon
                                                    iconType={Icon.type.ICON_FONT}
                                                    icon='fa fa-star'
                                                    className='favorite-icon'
                                                    ignoreFocusStyle
                                                    style={{ color: '$Mfavorite' }}
                                                />
                                            ) : (
                                                <Favorite className='regular-icon' />
                                            )}
                                        </Button>
                                    </div>
                                    <TextArea
                                        data-testid='editable-input'
                                        resize
                                        rows={6}
                                        tabIndex={6}
                                        maxLength={1000}
                                        controlled
                                        size='large'
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
                            position={DialogContentContainer.BOTTOM_START} 
                            showTrigger={['click']}
                            wrapperClassName='board-details-header-board-info'
                            zIndex={4}>
                            <Button
                                kind={Button.kinds.TERTIARY}
                                size='small'
                                dialogPaddingSize={DialogContentContainer.sizes.MEDIUM}
                                rightIcon={NavigationChevronDown}
                                zIndex={4}
                                >
                                {currBoard.title}
                            </Button>
                        </Dialog>
                        <div
                            style={{
                                width: 'auto',
                                display: 'flex',
                                marginInline: '25px',
                                alignItems: 'center',
                                // width: '100%',
                            }}>
                            <AvatarGroup max={3} size='medium'>
                                {currBoard.members.map((member) => (
                                    <Avatar
                                        key={member._id}
                                        ariaLabel={member.fullName}
                                        src={member.imgUrl}
                                        type='img'
                                    />
                                ))}
                            </AvatarGroup>
                            <MenuButton
                                componentPosition='start'
                                dialogPaddingSize='small'
                                style={{
                                    marginLeft: '25px',
                                }}>
                                <Menu id='menu' size='medium'>
                                    <MenuTitle caption='Board options' captionPosition='top' />
                                    <MenuItem
                                        onClick={() => onRemoveBoard(currBoard._id)}
                                        icon={Delete}
                                        title='Delete Board'
                                    />
                                </Menu>
                            </MenuButton>
                        </div>
                    </div>
                    <div
                        style={{
                            height: '10px',
                            marginInlineEnd: '30px',
                        }}>
                        <Divider />
                    </div>
                    <GroupFilter setFilterBy={setFilterBy} />
                </div>
            </header>
            <GroupList boardsToDisplay={boardsToDisplay} />
        </section>
    )
}
