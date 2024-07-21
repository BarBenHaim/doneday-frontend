import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GruopSort({ tasks }) {
  // const { boardId } = useParams()
  // const currBoard = useSelector((storeState) =>
  //   storeState.boardModule.boards.find((board) => board._id === boardId)
  // )

  // const groups = currBoard.groups || []
  // const tasks = groups.flatMap((group) => group.tasks || [])
  console.log(tasks)

  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  function getSotrColumn(ev) {
    const column = ev.target.value
    setSortColumn(column)
  }
  console.log(sortColumn)

  function getSotrOrder(ev) {
    const order = ev.target.value
    setSortOrder(order)
  }
  console.log(sortOrder)
  sortTask(tasks)

  // function sortTask(tasks) {
  //   if (!sortColumn) return tasks
  //   console.log(tasks)

  //   return tasks.slice().sort((a, b) => {
  //     const aValue = a[sortColumn]
  //     const bValue = b[sortColumn]

  //     if (aValue === bValue) return 0

  //     if (sortOrder === 'ascending') {
  //       return aValue > bValue ? 1 : -1
  //     } else {
  //       console.log(tasks)
  //       return aValue < bValue ? 1 : -1
  //     }
  //   })
  // }

  return (
    <div className="modal">
      <div className="modal-content">
        <span
          style={{ cursor: 'pointer' }}
          className="close"
          // onClick={handleCloseModal}
        >
          &times;
        </span>
        <h2>Sort by</h2>
        <div className="sort-options">
          <div className="sort-option">
            <label>Choose column:</label>
            <select onChange={getSotrColumn}>
              <option value="" disabled selected>
                Sort by
              </option>
              <option value="name">Name</option>
              <option value="priority">Priority</option>
              <option value="owner">Owner</option>
              <option value="due-date">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="sort-option">
            <label>Order:</label>
            <select onChange={getSotrOrder}>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        </div>
        {/* <button className="save-button" onClick={handleCloseModal}>
          Save
        </button> */}
      </div>
    </div>
  )
}
