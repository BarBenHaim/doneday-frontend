import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

export function GruopSort({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )

  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  const priorityMap = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  }

  function getSotrOrder(ev) {
    const order = ev.target.value
    setSortOrder(order)
    if (!sortColumn) return tasks

    const filteredGroups = groups.map((group) => {
      const sortedTasks = [...group.tasks].sort((a, b) => {
        if (sortColumn === 'priority') {
          const priorityA = priorityMap[a.priority] || 0
          const priorityB = priorityMap[b.priority] || 0
          return order === 'ascending'
            ? priorityA - priorityB
            : priorityB - priorityA
        } else if (sortColumn === 'dueDate') {
          const dateA = new Date(a.dueDate)
          const dateB = new Date(b.dueDate)
          return order === 'ascending' ? dateA - dateB : dateB - dateA
        } else {
          if (order === 'ascending') {
            return a.title.localeCompare(b.title)
          } else if (order === 'descending') {
            return b.title.localeCompare(a.title)
          }
        }
      })

      return { ...group, tasks: sortedTasks }
    })

    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )

    setFilterBy(nonEmptyGroups)
    console.log({ nonEmptyGroups })
    return nonEmptyGroups
  }

  return (
    <div className="sort-content">
      <span style={{ cursor: 'pointer' }} className="close">
        &times;
      </span>
      <h2>Sort by</h2>
      <div className="sort-options">
        <div className="sort-option">
          <label>Choose column:</label>
          <select
            onChange={(ev) => {
              setSortColumn(ev.target.value)
            }}
          >
            <option value="" disabled selected>
              Sort by
            </option>
            <option value="name">Name</option>
            <option value="priority">Priority</option>
            <option value="due-date">Due Date</option>
          </select>
        </div>
        <div className="sort-option">
          <label>Order:</label>
          <select onChange={getSotrOrder}>
            <option value="" disabled selected>
              Sort by
            </option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>
    </div>
  )
}
