import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { NavigationChevronDown, NavigationChevronRight } from 'monday-ui-react-core/icons'

import { addBoard, loadBoards, removeBoard } from '../store/actions/board.action'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { BoardList } from '../cmps/BoardList'
import { Button, DialogContentContainer, Flex, Text, TextArea } from 'monday-ui-react-core'
import { TaxSvg } from '../cmps/svgs/TaskSvg'

import boardIndexBanner from '../assets/img/monday-banners/monday-banner-index.jpeg'

// import { GroupFilter } from '../cmps/group/GroupFilter'

export function BoardIndex() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const groupTaskFilterBy = useSelector((storeState) => storeState.boardModule.groupTaskFilterBy)
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

    async function handleSetFilterBy(ev) {
        const value = ev.target.value
    }

    function toggleCollapse() {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <section className='board-index'>
            <DialogContentContainer size='large' type='modal' className='border-index-body'>
                {/* <GroupFilter
        filterBy={groupTaskFilterBy}
        setFilterBy={handleSetFilterBy}
      /> */}
                <Flex
                    direction={Flex.directions.ROW}
                    align={Flex.align.START}
                    justify={Flex.justify.SPACE_BETWEEN}
                    gap={Flex.gaps.MEDIUM}
                    wrap={false}>
                    <DialogContentContainer 
                    className="board-list-dialog"
                        size={DialogContentContainer.sizes.MEDIUM}
                        type={DialogContentContainer.types.MODAL}>
                        <div className='collapsible-header flex align-center' onClick={toggleCollapse}>
                            {isCollapsed ? (
                                <NavigationChevronRight size={'15'} lable='Expand list' />
                            ) : (
                                <NavigationChevronDown size={'15'} lable='Collapse list' />
                            )}
                            <h1 className='bold collapsible-title'>Recently visited</h1>
                        </div>
                        {!isCollapsed && <BoardList boards={boards} onRemoveBoard={onRemoveBoard} />}
                    </DialogContentContainer>
                    <DialogContentContainer
                        size={DialogContentContainer.sizes.LARGE}
                        type={DialogContentContainer.types.MODAL}
                        className='board-index-template'>
                        <Flex
                            direction={Flex.directions.COLUMN}
                            align={Flex.align.CENTER}
                            justify={Flex.justify.SPACE_BETWEEN}
                            gap={Flex.gaps.SMALL}
                            wrap={false}>
                            <img src={boardIndexBanner} className='board-index-banner' />
                            <Flex
                                className='banner-section-content-wrapper'
                                direction={Flex.directions.COLUMN}
                                align={Flex.align.CENTER}
                                justify={Flex.justify.SPACE_AROUND}
                                wrap={true}>
                                <Flex
                                    direction={Flex.directions.COLUMN}
                                    gap={Flex.gaps.SMALL}
                                    align={Flex.align.START}>
                                    <Text
                                        align={Text.align.START}
                                        type={Text.types.TEXT1}
                                        weight={Text.weights.NORMAL}
                                        className='text-line'>
                                        Boost your workflow in minutes
                                    </Text>
                                    <Text align={Text.align.START} type={Text.types.TEXT1} weight={Text.weights.NORMAL}>
                                        with ready-made templates
                                    </Text>
                                </Flex>
                                <Button
                                    onClick={function noRefCheck() {}}
                                    kind={Button.kinds.SECONDARY}
                                    marginLeft
                                    marginRight
                                    size='large' 
                                    style={{
                                        display: 'block',
                                        width: '100%'
                                      }}>
                                    Explore templates
                                </Button>
                            </Flex>
                        </Flex>
                    </DialogContentContainer>
                </Flex>
            </DialogContentContainer>
        </section>
    )
}
