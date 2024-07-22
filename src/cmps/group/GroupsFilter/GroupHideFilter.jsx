import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GroupHideFilter({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [selectedColumns, setSelectedColumns] = useState({
    // allColumns: true,
    person: true,
    status: true,
    timeline: true,
    priority: true,
  })

  function handleCheckboxChange(e) {
    const { id, checked } = e.target
    const column = id

    setSelectedColumns((prev) => ({
      ...prev,
      [id]: checked,
    }))

    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.filter((task) => {
        return selectedColumns[column] !== false
      })
      console.log(filteredTasks)
      return { ...group, tasks: filteredTasks }
    })
    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )

    setFilterBy(nonEmptyGroups)
    console.log({ nonEmptyGroups })
    return nonEmptyGroups
  }
  //

  // const handleSave = () => {
  //   setFilterBy(selectedColumns)
  // }

  return (
    <section>
      <div className="modal">
        <div className="modal-content">
          {/* <div className="modal-header">
            <h2>Display columns</h2>
            <button className="save-view" onClick={handleSave}>
              Save as new view
            </button>
          </div> */}
          <div className="modal-body">
            <input
              type="text"
              placeholder="Find columns to show/hide"
              className="search-input"
              // onChange={handelChangeSearch}
            />
            <div className="columns-list">
              <div className="column">
                <input
                  type="checkbox"
                  id="allColumns"
                  // checked={selectedColumns.allColumns}
                  // onChange={handleCheckboxChange}
                />
                <label htmlFor="allColumns">
                  All columns{' '}
                  <span className="selected-count">
                    {Object.values(selectedColumns).filter(Boolean).length}{' '}
                    selected
                  </span>
                </label>
              </div>
              <div className="column">
                <input
                  type="checkbox"
                  id="person"
                  checked={selectedColumns.person}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="person">
                  <span className="icon person-icon"></span>Person
                </label>
              </div>
              <div className="column">
                <input
                  type="checkbox"
                  id="status"
                  checked={selectedColumns.status}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="status">
                  <span className="icon status-icon"></span>Status
                </label>
              </div>
              <div className="column">
                <input
                  type="checkbox"
                  id="dueDate"
                  checked={selectedColumns.timeline}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="dueDate">
                  <span className="icon timeline-icon"></span>Time line
                </label>
              </div>
              <div className="column">
                <input
                  type="checkbox"
                  id="priority"
                  checked={selectedColumns.priority}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="priority">
                  <span className="icon priority-icon"></span>Priority
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
