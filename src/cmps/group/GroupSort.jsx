import { useState } from 'react'

export function GruopSort() {
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  function getSotrColumn(ev) {
    const column = ev.target.value
    setSortColumn(column)
  }

  function getSotrOrder(ev) {
    const order = ev.target.value
    setSortOrder(order)
  }
  // function sortGroups(groups) {
  //   if (!sortColumn) return groups

  //   return groups.slice().sort((a, b) => {
  //     const aValue =
  //       sortColumn === 'title' ? a[sortColumn] : a.tasks[0]?.[sortColumn]
  //     const bValue =
  //       sortColumn === 'title' ? b[sortColumn] : b.tasks[0]?.[sortColumn]

  //     if (aValue === bValue) return 0

  //     if (sortOrder === 'ascending') {
  //       return aValue > bValue ? 1 : -1
  //     } else {
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
