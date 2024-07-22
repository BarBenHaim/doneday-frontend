import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { GruopSort } from './GroupSort'
import { GroupPersonFilter } from './GroupPersonFilter'
import { GroupHideFilter } from './GroupHideFilter'
import { Filter, Hide, Sort } from 'monday-ui-react-core/icons'
import { TaxSvg } from '../../svgs/TaskSvg'
import { Avatar, Tooltip } from 'monday-ui-react-core'

export function GroupFilter({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [isSearchActive, setIsSearchActive] = useState(false)
  const [isPersonActive, setIsPersonActive] = useState(false)
  const [isSortActive, setIsSortActive] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [isHideActive, setIsHideActive] = useState(false)

  const [selectedColumn, setSelectedColumn] = useState([])
  const [selectedCondition, setselectedCondition] = useState('')

  const [columnToFilter, setColumnToFilter] = useState('')
  const [labelsToFilterBy, setLabelsToFilterBy] = useState('')

  const [isTextField, setTextField] = useState(false)
  const [textToFilter, setTextToFilter] = useState('')

  function handleSearchClick(ev) {
    const value = ev.target.value

    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.filter((task) => {
        return task.title.toLowerCase().includes(value.toLowerCase())
      })
      return {
        ...group,
        tasks: filteredTasks,
      }
    })

    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )

    setFilterBy(nonEmptyGroups)
    return nonEmptyGroups
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
        tasks.map((task) => {
          columnArray.push(task.status)
        })
        break

      case 'dueDate':
        tasks.map((task) => {
          columnArray.push(task.dueDate)
        })
        break

      case 'owner':
        tasks.map((task) => {
          columnArray.push(task.byMember?.fullname)
        })
        break

      case 'priority':
        tasks.map((task) => {
          columnArray.push(task.priority)
        })
        break

      case 'title':
        groups.map((group) => {
          columnArray.push(group.title)
        })
        break

      default:
        break
    }

    const filteredColumnArray = columnArray.filter(
      (value, index, self) =>
        value !== null && value !== undefined && self.indexOf(value) === index
    )
    setSelectedColumn(filteredColumnArray)
  }

  function getCondition(ev) {
    const selectedValue = ev.target.value
    setselectedCondition(selectedValue)

    setTextField(
      selectedValue === 'does_not_contain' || selectedValue === 'contains'
    )
  }

  function handleLabelsToFilterBy(ev) {
    const selectedValue = ev.target.value

    setLabelsToFilterBy(selectedValue)
  }

  function getFilterdgroups() {
    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.filter((task) => {
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
            return columnToFilter === 'title'
              ? group[columnToFilter]?.includes(textToFilter)
              : task[columnToFilter]?.includes(textToFilter)

          case 'does_not_contain':
            return columnToFilter === 'title'
              ? !group[columnToFilter]?.includes(textToFilter)
              : !task[columnToFilter]?.includes(textToFilter)

          default:
            return true
        }
      })

      return {
        ...group,
        tasks: filteredTasks,
      }
    })

    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )

    setFilterBy(nonEmptyGroups)

    return nonEmptyGroups
  }

  return (
    <>
      <section className="board-filter">
        <div className="search-filter">
          {!isSearchActive ? (
            <div className="search" onClick={() => setIsSearchActive(true)}>
              <button className="filter-item search">
                <i className="fa-solid fa-magnifying-glass"></i>
                Search
              </button>
            </div>
          ) : (
            <div className=" search ">
              <input
                type="text"
                name="txt"
                placeholder="Search this board"
                autoFocus
                onBlur={() => setIsSearchActive(false)}
                onChange={(ev) => handleSearchClick(ev)}
              />
            </div>
          )}
        </div>
        <div className="person-filter">
          <Tooltip
            content="Filter board by person"
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
            <button
              className={`filter-item person ${isPersonActive ? 'active' : ''}`}
              onClick={() => setIsPersonActive(!isPersonActive)}
            >
              <i className="fa-regular fa-circle-user"></i>
              Person
            </button>
          </Tooltip>
          {isPersonActive && (
            <div className="group-person-filter">
              <GroupPersonFilter setFilterBy={setFilterBy} />
            </div>
          )}
        </div>

        <div className="filter-filter">
          <Tooltip
            content="Filter board by anyting"
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
            <button
              className={`filter-item filter ${isFilterActive ? 'active' : ''}`}
              onClick={() => setIsFilterActive(!isFilterActive)}
            >
              <Filter />
              Filter
            </button>
          </Tooltip>
        </div>
        {isFilterActive && (
          <div className="advanced-filter-modal">
            <div className="advanced-filter-content">
              <saction className="filter-header">
                <div className="left-side">
                  <h2 className="main-header">
                    Advanced filters
                    <span className="main-header second">
                      Showing all tasks
                    </span>
                  </h2>
                </div>

                <div className="right-side">
                  <button className="clear-btn">Clear all</button>
                </div>
              </saction>

              <div className="column-filter">
                <div>
                  <label>Where</label>
                  <select className="column" onChange={getColumn}>
                    <option value="" disabled selected>
                      Column
                    </option>

                    <option value="title">Group</option>
                    <option value="priority">Priority</option>

                    <option value="status">Status</option>
                    <option value="owner">Owner</option>
                    <option value="dueDate">Due Date</option>
                  </select>

                  <select className="column" onChange={getCondition}>
                    <option value="" disabled selected>
                      Condition
                    </option>
                    <option value="is">is</option>
                    <option value="is_not">is not</option>
                    <option value="contains">contains</option>
                    <option value="does_not_contain">does not contain</option>
                  </select>
                  {isTextField && (
                    <input
                      type="text"
                      id="filterTextField"
                      name="filterTextField"
                      placeholder="Enter text to filter by"
                      onChange={handleTextFilterChange}
                    />
                  )}
                  {!isTextField && (
                    <select
                      className="column"
                      onChange={handleLabelsToFilterBy}
                    >
                      <option value="" disabled selected>
                        Value
                      </option>
                      {selectedColumn.map((lable, idx) => (
                        <option key={idx}>{lable}</option>
                      ))}
                    </select>
                  )}
                  <button onClick={getFilterdgroups}>
                    {' '}
                    <i
                      className="fa-solid fa-magnifying-glass"
                      style={{ fontSize: '18px', color: 'gray' }}
                    ></i>
                  </button>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="close"
                    onClick={() => setIsFilterActive(false)}
                  >
                    &times;
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="filter-sort">
          <Tooltip
            content="Sort board by any column"
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
            <button
              className={`filter-item sort ${isSortActive ? 'active' : ''}`}
              onClick={() => setIsSortActive(!isSortActive)}
            >
              <Sort />
              Sort
            </button>
          </Tooltip>
          {isSortActive && <GruopSort setFilterBy={setFilterBy} />}
        </div>
        <div className="filter-hide">
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
            <button
              className={`filter-item hide ${isHideActive ? 'active' : ''}`}
              onClick={() => setIsHideActive(!isHideActive)}
            >
              <Hide />
              Hide
            </button>
          </Tooltip>
          {isHideActive && <GroupHideFilter setFilterBy={setFilterBy} />}
        </div>

        {/* <div className="Hide">
          <button
            className={`filter-item hide ${isHideActive ? 'active' : ''}`}
            onClick={() => setIsHideActive(!isHideActive)}
          >
            <Hide />
            Hide
          </button>
          {isHideActive && <GroupHideFilter setFilterBy={setFilterBy} />}
        </div> */}
      </section>
    </>
  )
}
