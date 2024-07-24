import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useState } from 'react'

import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import {
    MenuItem,
    Menu,
    MenuDivider,
    DialogContentContainer,
    SplitButton,
    SplitButtonMenu,
    MenuTitle,
    MenuItemButton,
    Dialog,
    Button,
    IconButton,
} from 'monday-ui-react-core'
import {
    Favorite,
    Home,
    NavigationChevronDown,
    NavigationChevronUp,
    DropdownChevronDown,
    Board,
    Add,
} from 'monday-ui-react-core/icons'

import { AddBoard } from './AddBoard'

export function Sidebar() {
    const navigate = useNavigate()
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false)
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const starredBoards = boards.filter((board) => board.isStarred)
    const boardLabel = boards.filter((board) => board.label)

    function handleOnClick(route) {
        navigate(route)
    }

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    function toggleAddBoard() {
        setIsAddBoardModalOpen(!isAddBoardModalOpen)
    }

    return (
        <div className='sidebar main-container'>
            <DialogContentContainer>
                <Menu>
                    <MenuItem icon={Home} title='Home' onClick={() => handleOnClick('/board')} />
                    <MenuDivider />
                    <MenuItem
                        icon={Favorite}
                        title='Favorite'
                        onClick={() => toggleCollapse()}
                        rightIcon={
                            isCollapsed ? <NavigationChevronDown icon={DropdownChevronDown} /> : <NavigationChevronUp />
                        }
                    />
                    {!isCollapsed &&
                        starredBoards.map((board) => (
                            <MenuItem
                                icon={Board}
                                key={board._id}
                                title={board.title}
                                onClick={() => handleOnClick(`/board/${board._id}`)}
                            />
                        ))}
                    <MenuDivider />
                    </Menu>
                    <div className='add-button-dialog'>
                        <Dialog
                            content={
                                <DialogContentContainer>
                                    <Menu>
                                        <MenuTitle caption='Add new' />
                                        <MenuItem icon={Board} title='Board' splitMenuItem>
                                            <Menu>
                                                <MenuItem icon={Board} title='New Board' onClick={toggleAddBoard} />
                                            </Menu>
                                        </MenuItem>
                                    </Menu>
                                </DialogContentContainer>
                            }
                            hideTrigger={['click', 'clickoutside', 'onContentClick']}
                            modifiers={[
                                {
                                    name: 'preventOverflow',
                                    options: {
                                        mainAxis: false,
                                    },
                                },
                            ]}
                            position='left-start'
                            shouldShowOnMount
                            showTrigger={['click']}>
                            <IconButton icon={Add} kind='primary' />
                        </Dialog>
                    </div>
                    <Menu>
                    <MenuDivider />
                    <MenuTitle caption='Main workspace' captionPosition='top' />
                    {boardLabel.map((board) => (
                        <MenuItem
                            icon={Board}
                            key={board._id}
                            title={board.title}
                            onClick={() => handleOnClick(`/board/${board._id}`)}
                        />
                    ))}
                </Menu>
            </DialogContentContainer>

            {isAddBoardModalOpen && <AddBoard isOpen={isAddBoardModalOpen} onClose={toggleAddBoard} />}
        </div>
    )
}
