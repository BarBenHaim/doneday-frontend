import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GroupFilter({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [arrayToDisplay, setArrayToDisplay] = useState([])

  const [isSearchActive, setSearchActive] = useState(false)
  const [isFilterModalOpen, setFilterModalOpen] = useState(false)
  const [isSortModalOpen, setSortModalOpen] = useState(false)

  const [selectedColumn, setSelectedColumn] = useState([])
  const [selectedCondition, setselectedCondition] = useState('')

  const [columnToFilter, setColumnToFilter] = useState('')
  const [labelsToFilterBy, setLabelsToFilterBy] = useState('')

  const [isTextField, setTextField] = useState(false)
  const [textToFilter, setTextToFilter] = useState('')

  function handleSearchClick() {
    setSearchActive(true)
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

  function onClearFilter() {
    console.log('hi')

    setColumnToFilter('')
    setLabelsToFilterBy('')
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

    setArrayToDisplay(nonEmptyGroups)

    setFilterBy(nonEmptyGroups)

    return nonEmptyGroups
  }

  return (
    <>
      <section className="board-filter">
        {isSearchActive && (
          <div className={`filter-item search active`}>
            <input
              type="text"
              name="txt"
              placeholder="Search this board"
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
              onChange={(ev) => handleSearchClick(ev)}
            />
          </div>
        )}
        {!isSearchActive && (
          <div className="search">
            <button className="filter-item search">
              <i className="fa-solid fa-magnifying-glass"></i> Search
            </button>
          </div>
        )}
        <div className="person">
          <button className="filter-item person">
            <i className="fa-regular fa-circle-user"></i> Person
          </button>
        </div>
        <div className="filter">
          <button className="filter-item filter" onClick={handleFilterClick}>
            <i className="fa-solid fa-filter"></i> Filter
          </button>
        </div>

        <div className="sort">
          <button className="filter-item sort" onClick={handleSortClick}>
            <i className="fa-solid fa-sort"></i> Sort
          </button>
        </div>
        <div className="Hide">
          <button className="filter-item hide">
            <i class="fa-regular fa-eye-slash"></i> Hide
          </button>
        </div>
      </section>

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
                {/* <p className="second-header">Showing all of X tasks</p> */}
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
                  <select className="column" onChange={handleLabelsToFilterBy}>
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

      {isSortModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              style={{ cursor: 'pointer' }}
              className="close"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2>Sort by</h2>
            <div className="sort-options">
              <div className="sort-option">
                <label>Choose column:</label>
                <select>
                  <option value="name">Name</option>
                  <option value="owner">Owner</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="status">Status</option>
                </select>
              </div>
              <div className="sort-option">
                <label>Order:</label>
                <select>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </select>
              </div>
            </div>
            <button className="save-button" onClick={handleCloseModal}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  )
}
