import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GroupFilter({
  setArrayToDisplayfromfather,
  filterBy,
  setFilterBy,
  handleSetFilterBy,
}) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [isFilterModalOpen, setFilterModalOpen] = useState(false)
  const [isSortModalOpen, setSortModalOpen] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState([])
  const [arrayToDisplay, setArrayToDisplay] = useState([])
  const [selectedCondition, setselectedCondition] = useState('')
  const [columnToFilter, setColumnToFilter] = useState('')
  const [labelsToFilterBy, setLabelsToFilterBy] = useState('')
  const [textToFilter, setTextToFilter] = useState('')
  const [isTextField, setTextField] = useState(false)

  const handleFilterClick = () => {
    console.log({ isFilterModalOpen })
    if (isFilterModalOpen) {
      setFilterModalOpen(false)
    } else {
      setFilterModalOpen(true)
    }
  }

  const handleSortClick = () => {
    setSortModalOpen(true)
  }

  const handleCloseModal = () => {
    setFilterModalOpen(false)
    setSortModalOpen(false)
  }
  const handleTextFilterChange = (ev) => {
    const text = ev.target.value
    setTextToFilter(text)
  }
  const getColumn = (ev) => {
    const selectedValue = ev.target.value
    console.log({ selectedValue })
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
          console.log(task.byMember?.fullname)
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
  const getCondition = (ev) => {
    const selectedValue = ev.target.value
    setselectedCondition(selectedValue)
    if (selectedValue === 'does_not_contain' || selectedValue === 'contains') {
      setTextField(true)
      console.log(textToFilter)
    } else {
      setTextField(false)
    }
    console.log({ isTextField })
  }
  const handleLabelsToFilterBy = (ev) => {
    const selectedValue = ev.target.value
    setLabelsToFilterBy(selectedValue)
  }
  const getFilterdgroups = () => {
    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.filter((task) => {
        switch (selectedCondition) {
          case 'is_not':
            if (columnToFilter === 'title') {
              return group[columnToFilter] !== labelsToFilterBy
            } else {
              return task[columnToFilter] !== labelsToFilterBy
            }
          case 'is':
            if (columnToFilter === 'title') {
              return group[columnToFilter] === labelsToFilterBy
            } else {
              return task[columnToFilter] === labelsToFilterBy
            }
          case 'contains':
            if (columnToFilter === 'title') {
              return group[columnToFilter]?.includes(textToFilter)
            } else {
              return task[columnToFilter]?.includes(textToFilter)
            }
          case 'does_not_contain':
            if (columnToFilter === 'title') {
              return !group[columnToFilter]?.includes(textToFilter)
            } else {
              return !task[columnToFilter]?.includes(textToFilter)
            }
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

    setArrayToDisplayfromfather(nonEmptyGroups)

    return nonEmptyGroups
  }
  console.log(arrayToDisplay)
  return (
    <>
      <button onClick={getFilterdgroups}>filter</button>
      <button>X</button>
      <section className="group-filter">
        <div className="filter-item search">
          <input
            type="text"
            name="txt"
            placeholder="Search"
            onChange={(ev) => handleSetFilterBy(ev)}
            required
          />
        </div>
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
        {/* <div className="sort">
          <button className="filter-item sort" onClick={handleSortClick}>
            <i className="fa-solid fa-sort"></i> Sort
          </button>
        </div> */}
      </section>

      {isFilterModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span
              style={{ cursor: 'pointer' }}
              className="close"
              onClick={handleCloseModal}
            >
              &times;
            </span>
            <h2>Advanced filters</h2>
            <p>Showing all of X tasks</p>
            <div className="filter-options">
              <div className="filter-option">
                <label>Where</label>
                <select onChange={getColumn}>
                  <option value="" disabled selected>
                    Column
                  </option>
                  <option value="title">Group</option>
                  <option value="priority">Priority</option>
                  {/* <option value="Collaboretors">Collaboretors</option> */}
                  <option value="status">Status</option>
                  <option value="owner">Owner</option>
                  <option value="dueDate">Due Date</option>
                </select>

                <select onChange={getCondition}>
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
                  <select onChange={handleLabelsToFilterBy}>
                    <option value="" disabled selected>
                      Value
                    </option>
                    {selectedColumn.map((lable, idx) => (
                      <option key={idx}>{lable}</option>
                    ))}
                  </select>
                )}
              </div>
              <button className="new-filter-button">+ New filter</button>
              <button className="new-group-button">+ New group</button>
            </div>
            <div className="modal-footer">
              <button className="clear-button">Clear all</button>
              <button className="save-button">Save as new view</button>
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
