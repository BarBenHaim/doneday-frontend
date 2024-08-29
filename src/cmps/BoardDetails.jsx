import { useEffect, useState } from 'react'
import { loadBoards, removeBoard, toggleStarredBoard, updateBoard } from '../store/actions/board.action'
import { useNavigate, useParams } from 'react-router'
import { GroupList } from './group/GroupList'
import { GroupFilter } from './group/GroupsFilter/GroupFilter'
import { useSelector } from 'react-redux'
import { Delete, Home, NavigationChevronDown } from 'monday-ui-react-core/icons'
import StarIcon from './svgs/starIcon'
import {
    Avatar,
    AvatarGroup,
    Button,
    Dialog,
    DialogContentContainer,
    Divider,
    EditableHeading,
    Menu,
    MenuButton,
    MenuItem,
    MenuTitle,
    Tab,
    TabList,
    TextArea,
} from 'monday-ui-react-core'
import { SOCKET_EMIT_SET_TOPIC, socketService } from '../services/socket.service'
import { useDispatch } from 'react-redux'
import { debounce } from '../services/util.service'

export function BoardDetails() {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const dispatch = useDispatch()

    const [isStarredBoard, setIsStarredBoard] = useState(currBoard?.isStarred)
    const [boardsToDisplay, setBoardsToDisplay] = useState(currBoard?.groups || [])
    const isLoading = useSelector(storeState => storeState.boardModule.flag.isLoading)
    const [activeTabIndex, setActiveTabIndex] = useState(0)

    const navigate = useNavigate()

    useEffect(() => {
        socketService.on('board-changed', onBoardChanged)
        return () => {
            socketService.off('board-changed')
        }
    }, [])

    useEffect(() => {
        loadBoards()
        socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId)
    }, [boardId])

    useEffect(() => {
        if (currBoard) {
            setBoardsToDisplay(currBoard?.groups || [])
            setIsStarredBoard(currBoard?.isStarred)
        }
    }, [currBoard])

    async function onBoardChanged(board) {
        if (board._id === currBoard._id && JSON.stringify(board) !== JSON.stringify(currBoard)) {
            dispatch({ type: 'UPDATE_BOARD', board })
        }
    }

    function setFilterBy(arr) {
        setBoardsToDisplay(arr)
    }

    function onUpdateField(currBoard, field, value) {
        const updatedBoard = { ...currBoard, [field]: value }
        onUpdateBoard(updatedBoard)
    }

    const debouncedUpdateField = debounce(onUpdateField, 600)

    async function onUpdateBoard(board) {
        try {
            await updateBoard(board)
        } catch (err) {
            console.log(err)
        }
    }

    async function handleToggleStarred() {
        try {
            await toggleStarredBoard(currBoard)
            setIsStarredBoard(isStarredBoard => !isStarredBoard)
            onUpdateField(currBoard, 'isStarred', !currBoard.isStarred)
        } catch (err) {
            console.log(err)
        }
    }

    async function onRemoveBoard(currBoardId) {
        try {
            await removeBoard(currBoardId)
            navigate(`/board`)
        } catch (err) {
            console.log(err)
        }
    }

    if (!currBoard) return <img className='loader-gif' src='/img/board-loader.gif' alt='Loading...' />

    const view = (() => {
        switch (activeTabIndex) {
            case 0:
                return 'table'
            case 1:
                return 'kanban'
            case 2:
                return 'dashboard'
            default:
                return 'table'
        }
    })()

    return (
        <section className='board-details'>
            {isLoading ? (
                <img className='loader-gif' src='/img/board-loader.gif' alt='Loading...' />
            ) : (
                <>
                    <header className='board-details-header'>
                        <div className='header-content'>
                            <div className='board-details-edit'>
                                <Dialog
                                    content={
                                        <DialogContentContainer
                                            size={DialogContentContainer.sizes.LARGE}
                                            type={DialogContentContainer.types.POPOVER}
                                        >
                                            <div
                                                className='board-details-title-edit flex'
                                                style={{ paddingBottom: '10px' }}
                                            >
                                                <EditableHeading
                                                    type='h2'
                                                    value={currBoard.title}
                                                    onChange={value => debouncedUpdateField(currBoard, 'title', value)}
                                                    weight='bold'
                                                    size='large'
                                                />
                                                <Button
                                                    className='favorite-button'
                                                    onClick={handleToggleStarred}
                                                    kind={Button.kinds.TERTIARY}
                                                    size={Button.sizes.XS}
                                                >
                                                    <StarIcon isStarred={isStarredBoard} />
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
                                                style={{ marginBottom: '10px' }}
                                                onChange={e =>
                                                    debouncedUpdateField(currBoard, 'description', e.target.value)
                                                }
                                            />
                                            <div
                                                className='board-details-edit-divider'
                                                style={{ height: '20px', width: '100%' }}
                                            >
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
                                    zIndex={4}
                                >
                                    <Button
                                        kind={Button.kinds.TERTIARY}
                                        size='small'
                                        dialogPaddingSize={DialogContentContainer.sizes.MEDIUM}
                                        rightIcon={NavigationChevronDown}
                                        zIndex={4}
                                    >
                                        <span className='board-title'>{currBoard.title}</span>
                                    </Button>
                                </Dialog>

                                <div
                                    style={{
                                        width: 'auto',
                                        display: 'flex',
                                        marginInline: '25px',
                                        alignItems: 'center',
                                    }}
                                >
                                    <AvatarGroup max={3} size='medium'>
                                        {currBoard.members.map(member => (
                                            <Avatar
                                                key={member._id}
                                                ariaLabel={member.fullname}
                                                src={member.imgUrl}
                                                type='img'
                                            />
                                        ))}
                                    </AvatarGroup>

                                    <MenuButton
                                        componentPosition='start'
                                        dialogPaddingSize='small'
                                        style={{ marginLeft: '25px' }}
                                    >
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
                            <div style={{ margin: '0', padding: '0' }}>
                                <TabList
                                    className='tabs-container'
                                    activeTab={activeTabIndex}
                                    onTabChange={setActiveTabIndex}
                                >
                                    <Tab id='table' title='Table View'>
                                        <span
                                            style={{
                                                fontSize: '0.875rem',
                                                display: 'flex',
                                                gap: '2px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <Home size={16} opacity={0.75} /> Main Table
                                        </span>
                                    </Tab>
                                    <Tab id='kanban' title='Kanban View'>
                                        <span style={{ fontSize: '0.875rem' }}>Kanban</span>
                                    </Tab>
                                    <Tab id='dashboard' title='Dashboard'>
                                        <span style={{ fontSize: '0.875rem' }}>Dashboard</span>
                                    </Tab>
                                </TabList>
                            </div>
                            <div style={{ height: '8px', marginInlineEnd: '30px' }}>
                                <Divider withoutMargin />
                            </div>
                            <GroupFilter setFilterBy={setFilterBy} />
                        </div>
                    </header>

                    <GroupList boardsToDisplay={boardsToDisplay} view={view} />
                </>
            )}
        </section>
    )
}
