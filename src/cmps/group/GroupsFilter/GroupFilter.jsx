import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { GruopSort } from './GroupSort'
import { GroupPersonFilter } from './GroupPersonFilter'
import { GroupHideFilter } from './GroupHideFilter'
import { Group } from 'monday-ui-react-core/icons'

import { MenuItem, SplitButton, SplitButtonMenu, Tooltip } from 'monday-ui-react-core'
import { GroupAdvancedFilter } from './GroupAdvancedFilter'
import { addTask, getEmptyTask } from '../../../store/actions/board.action'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service'

export function GroupFilter({ setFilterBy }) {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const groups = currBoard.groups || []
    const tasks = groups.flatMap(group => group.tasks || [])
    async function onAddTask(title = '') {
        try {
            const addedTask = await addTask(currBoard._id, currBoard.groups[0]._id, getEmptyTask(), title)
            setTaskList([addedTask, ...taskList])
            showSuccessMsg('Task added successfully')
        } catch (err) {
            showErrorMsg('Cannot add task')
            console.error(err)
        }
    }

    const [taskList, setTaskList] = useState(tasks)
    // useEffect(() => {
    //     setTaskList(tasks)
    // }, [tasks, currBoard])

    const [isSearchActive, setIsSearchActive] = useState(false)

    function handleSearchClick(ev) {
        const value = ev.target.value

        const filteredGroups = groups.map(group => {
            const filteredTasks = group.tasks.filter(task => {
                return task.title.toLowerCase().includes(value.toLowerCase())
            })
            return {
                ...group,
                tasks: filteredTasks,
            }
        })

        const nonEmptyGroups = filteredGroups.filter(group => group.tasks.length > 0)

        setFilterBy(nonEmptyGroups)
        return nonEmptyGroups
    }
    const boardLabelName = currBoard.label.toLowerCase()

    return (
        <>
            <section className='board-filter'>
                <SplitButton
                    style={{ fontSize: '14px' }}
                    children={'New ' + boardLabelName}
                    onClick={() => onAddTask(`New ${boardLabelName}`)}
                    size='small'
                    secondaryDialogContent={
                        <SplitButtonMenu id='split-menu'>
                            <MenuItem icon={Group} title='Add group' onClick={() => alert('in development...')} />
                        </SplitButtonMenu>
                    }
                />
                <div className='header-filter'>
                    {!isSearchActive ? (
                        <div className='search' onClick={() => setIsSearchActive(true)}>
                            <button className='filter-item search'>
                                <i
                                    className='fa-solid fa-magnifying-glass'
                                    style={{
                                        fontSize: '16px',
                                        color: 'gray',
                                    }}
                                ></i>
                                Search
                            </button>
                        </div>
                    ) : (
                        <div className=' search '>
                            <input
                                type='text'
                                name='txt'
                                placeholder='Search this board'
                                autoFocus
                                onBlur={() => setIsSearchActive(false)}
                                onChange={ev => handleSearchClick(ev)}
                            />
                        </div>
                    )}
                </div>

                <div className='person-filter'>
                    <Tooltip
                        content='Filter board by person'
                        modifiers={[
                            {
                                name: 'preventOverflow',
                                options: {
                                    mainAxis: false,
                                },
                            },
                            {
                                name: 'flip',
                                options: {
                                    fallbackPlacements: [],
                                },
                            },
                        ]}
                        withMaxWidth
                    >
                        <GroupPersonFilter setFilterBy={setFilterBy} />
                    </Tooltip>
                </div>

                <div className='filter-filter'>
                    <Tooltip
                        content='Filter board by anyting'
                        modifiers={[
                            {
                                name: 'preventOverflow',
                                options: {
                                    mainAxis: false,
                                },
                            },
                            {
                                name: 'flip',
                                options: {
                                    fallbackPlacements: [],
                                },
                            },
                        ]}
                        withMaxWidth
                    >
                        <GroupAdvancedFilter setFilterBy={setFilterBy} />
                    </Tooltip>
                </div>

                <div className='filter-sort'>
                    <Tooltip
                        content='Sort board by any column'
                        modifiers={[
                            {
                                name: 'preventOverflow',
                                options: {
                                    mainAxis: false,
                                },
                            },
                            {
                                name: 'flip',
                                options: {
                                    fallbackPlacements: [],
                                },
                            },
                        ]}
                        withMaxWidth
                    >
                        <GruopSort setFilterBy={setFilterBy} />
                    </Tooltip>
                </div>

                {/* <div className="filter-hide">
          <Tooltip
            content="Hidden columns"
            modifiers={[
              {
                name: 'preventOverflow',
                options: {
                  mainAxis: false,
                },
              },
              {
                name: 'flip',
                options: {
                  fallbackPlacements: [],
                },
              },
            ]}
            withMaxWidth
          >
            <GroupHideFilter setFilterBy={setFilterBy} />
          </Tooltip>
        </div> */}
            </section>
        </>
    )
}
