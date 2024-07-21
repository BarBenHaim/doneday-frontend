import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router'
import { GruopSort } from './GroupSort'
import { GroupPersonFilter } from './GroupPersonFilter'

export function GroupFilter({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [isSearchFilterOpen, setSearchFilterOpen] = useState(false)
  const [isPersonFilterOpen, setPersonFilterOpen] = useState(false)
  const [isFilterModalOpen, setFilterModalOpen] = useState(false)
  const [isSortModalOpen, setSortModalOpen] = useState(false)

  const [selectedColumn, setSelectedColumn] = useState([])
  const [selectedCondition, setselectedCondition] = useState('')

  const [columnToFilter, setColumnToFilter] = useState('')
  const [labelsToFilterBy, setLabelsToFilterBy] = useState('')

  const [isTextField, setTextField] = useState(false)
  const [textToFilter, setTextToFilter] = useState('')

  function handleSearchClick(ev) {
    const value = ev.target.value
    console.log(value)
    // setSearchActive(true)
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
    console.log({ nonEmptyGroups })
    return nonEmptyGroups
  }

  function handelSearchClick() {
    setSearchFilterOpen(!isSearchFilterOpen)
  }

  function handelPersonClick() {
    setPersonFilterOpen(!isPersonFilterOpen)
  }

  function handleFilterClick() {
    setFilterModalOpen(!isFilterModalOpen)
  }

  function handleSortClick() {
    setSortModalOpen(!isSortModalOpen)
  }

  function handleCloseModal() {
    setFilterModalOpen(false)
    setSortModalOpen(false)
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
        {/* <div className="search" onClick={handelSearchClick}>
          <button className="filter-item search">
            <i className="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </div> */}
        {/* {isSearchFilterOpen && ( */}
        <div className={`filter-item search active`}>
          <input
            type="text"
            name="txt"
            placeholder="Search this board"
            // onFocus={() => setSearchActive(true)}
            // onBlur={() => setSearchActive(false)}
            onChange={(ev) => handleSearchClick(ev)}
          />
        </div>
        {/* )} */}

        <div className="person" onClick={handelPersonClick}>
          <button className="filter-item person">
            <i className="fa-regular fa-circle-user"></i> Person
          </button>
        </div>
        {isPersonFilterOpen && <GroupPersonFilter />}

        <div className="filter">
          <button className="filter-item filter" onClick={handleFilterClick}>
            <i className="fa-solid fa-filter"></i> Filter
          </button>
        </div>
        {isFilterModalOpen && (
          <div className="advanced-filter-modal">
            <div className="advanced-filter-content">
              <saction className="filter-header">
                <div className="left-side">
                  <h2 className="main-header">
                    Advanced filters
                    <span className="main-header second">
                      Showing all of X tasks
                    </span>
                  </h2>
                </div>

                <div className="right-side">
                  <button className="clear-btn">Clear all</button>
                  <button className="save-btn">Save as new view</button>
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
                  <button onClick={getFilterdgroups}>filter</button>
                  <span
                    style={{ cursor: 'pointer' }}
                    className="close"
                    onClick={handleCloseModal}
                  >
                    &times;
                  </span>
                </div>
                <div>
                  <button className="filter-button">+ New filter</button>
                  <button className="filter-button">+ New group</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sort">
          <button className="filter-item sort" onClick={handleSortClick}>
            <i className="fa-solid fa-sort"></i> Sort
          </button>
        </div>
        {isSortModalOpen && <GruopSort setFilterBy={setFilterBy} />}

        <div className="Hide">
          <button className="filter-item hide">
            <i class="fa-regular fa-eye-slash"></i> Hide
          </button>
        </div>
      </section>
    </>
  )
}
