import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Filter } from 'monday-ui-react-core/icons'
import { Dialog, DialogContentContainer } from 'monday-ui-react-core'

export function GroupAdvancedFilter({ setFilterBy }) {
    const { boardId } = useParams()
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))
    const groups = currBoard.groups || []
    const tasks = groups.flatMap(group => group.tasks || [])

    const [isFilterActive, setFilterisActive] = useState(false)
    const [selectedColumn, setSelectedColumn] = useState([])
    const [selectedCondition, setSelectedCondition] = useState('')
    const [columnToFilter, setColumnToFilter] = useState('')
    const [labelsToFilterBy, setLabelsToFilterBy] = useState('')
    const [isTextField, setTextField] = useState(false)
    const [textToFilter, setTextToFilter] = useState('')

    function onClearFilter() {
        setFilterisActive(false)
        setFilterBy(groups)
    }

    function handleTextFilterChange(ev) {
        const text = ev.target.value
        setTextToFilter(text)
    }

    function getColumn(ev) {
        const selectedValue = ev.target.value

        let columnArray = []
        setColumnToFilter(selectedValue)
        switch (selectedValue) {
            case 'status':
                columnArray = tasks.map(task => task.status)
                break
            case 'dueDate':
                columnArray = tasks.map(task => task.dueDate)
                break
            case 'owner':
                columnArray = tasks.map(task => task.byMember?.fullname)
                break
            case 'priority':
                columnArray = tasks.map(task => task.priority)
                break
            case 'title':
                columnArray = groups.map(group => group.title)
                break
            default:
                columnArray = []
        }

        const filteredColumnArray = [...new Set(columnArray)].filter(value => value !== null && value !== undefined)
        setSelectedColumn(filteredColumnArray)
    }

    function getCondition(ev) {
        const selectedValue = ev.target.value
        setSelectedCondition(selectedValue)
        setTextField(selectedValue === 'does_not_contain' || selectedValue === 'contains')
    }

    function handleLabelsToFilterBy(ev) {
        const selectedValue = ev.target.value
        setLabelsToFilterBy(selectedValue)
    }

    function getFilteredGroups() {
        setFilterisActive(true)
        const filteredGroups = groups.map(group => {
            const filteredTasks = group.tasks.filter(task => {
                switch (selectedCondition) {
                    case 'is_not':
                        return columnToFilter === 'title'
                            ? group[columnToFilter] !== labelsToFilterBy
                            : task[columnToFilter] !== labelsToFilterBy

                    case 'is':
                        return columnToFilter === 'title'
                            ? group[columnToFilter] === labelsToFilterBy
                            : task[columnToFilter] === labelsToFilterBy

                    case 'contains':
                        const normalizedTextToFilter = textToFilter.toLowerCase()
                        const groupValue = group[columnToFilter]?.toLowerCase()
                        const taskValue = task[columnToFilter]?.toLowerCase()

                        return columnToFilter === 'title'
                            ? groupValue?.includes(normalizedTextToFilter)
                            : taskValue?.includes(normalizedTextToFilter)

                    case 'does_not_contain':
                        return columnToFilter === 'title'
                            ? !groupValue?.includes(normalizedTextToFilter)
                            : !taskValue?.includes(normalizedTextToFilter)

                    default:
                        return true
                }
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

    return (
        <>
            <div className='monday-storybook-dialog--story-padding'>
                <Dialog
                    zIndex={4}
                    content={
                        <DialogContentContainer>
                            <div className='filter-filter'></div>
                            <div className='advanced-filter-modal'>
                                <div className='advanced-filter-content'>
                                    <section className='filter-header'>
                                        <div className='left-side'>
                                            <h2 className='main-header'>
                                                Advanced filters
                                                <span className='main-header second'>Showing all tasks</span>
                                            </h2>
                                        </div>
                                        <div className='right-side'>
                                            <button
                                                style={{ cursor: 'pointer' }}
                                                className='clear-all'
                                                onClick={onClearFilter}
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </section>
                                    <div className='column-filter'>
                                        <div>
                                            <label>Where</label>
                                            <select className='column' value={columnToFilter} onChange={getColumn}>
                                                <option value='' disabled>
                                                    Column
                                                </option>
                                                <option value='title'> Group</option>
                                                <option value='priority'>Priority</option>
                                                <option value='status'>Status</option>
                                                <option value='owner'>Owner</option>
                                                <option value='dueDate'>Due Date</option>
                                            </select>
                                            <select
                                                className='column'
                                                value={selectedCondition}
                                                onChange={getCondition}
                                            >
                                                <option value='' disabled>
                                                    Condition
                                                </option>
                                                <option value='is'>is</option>
                                                <option value='is_not'>is not</option>
                                                <option value='contains'>contains</option>
                                                <option value='does_not_contain'>does not contain</option>
                                            </select>
                                            {isTextField ? (
                                                <input
                                                    type='text'
                                                    id='filterTextField'
                                                    name='filterTextField'
                                                    placeholder='Enter text to filter by'
                                                    value={textToFilter}
                                                    onChange={handleTextFilterChange}
                                                />
                                            ) : (
                                                <select
                                                    className='column'
                                                    value={labelsToFilterBy}
                                                    onChange={handleLabelsToFilterBy}
                                                >
                                                    <option value='' disabled>
                                                        Value
                                                    </option>
                                                    {selectedColumn.map((label, idx) => (
                                                        <option key={idx} value={label}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            <button onClick={getFilteredGroups}>
                                                <i
                                                    className='fa fa-search'
                                                    style={{ fontSize: '18px', color: 'gray' }}
                                                ></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContentContainer>
                    }
                    hideTrigger={['clickoutside']}
                    modifiers={[
                        {
                            name: 'preventOverflow',
                            options: {
                                mainAxis: false,
                            },
                        },
                    ]}
                    position='bottom'
                    showTrigger={['click']}
                >
                    <div
                        style={{ padding: '4px', cursor: 'pointer' }}
                        className={`filter-item filter ${isFilterActive ? 'active' : ''}`}
                    >
                        <Filter />
                        Filter
                    </div>
                </Dialog>
            </div>
        </>
    )
}
