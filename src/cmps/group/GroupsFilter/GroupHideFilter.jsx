import { Dialog, DialogContentContainer } from 'monday-ui-react-core'
import { Hide } from 'monday-ui-react-core/icons'
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
  console.log(tasks[0])
  const [arrayOfProperties, setarrayOfProperties] = useState([])
  const [selectedColumn, setSelectedColumn] = useState([
    // 'byMember',
    // 'status',
    // 'dueDate',
    // 'priority',
  ])
  const [checkedColumns, setCheckedColumns] = useState({
    byMember: true,
    status: true,
    timeline: true,
    priority: true,
  })

  const toggleColumn = (id) => {
    console.log(id)

    const isChecked = !checkedColumns[id]
    setCheckedColumns((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }))
    setSelectedColumn((prevState) =>
      isChecked ? [...prevState, id] : prevState.filter((col) => col !== id)
    )
  }

  function handleCheckboxChange(event) {
    // console.log(event.target.value)

    const { id } = event.target
    toggleColumn(id)
  }

  function handleSelectAll(event) {
    const allChecked = event.target.checked
    setCheckedColumns({
      person: allChecked,
      status: allChecked,
      dueDate: allChecked,
      priority: allChecked,
    })
    setSelectedColumn(
      allChecked ? ['person', 'status', 'timeline', 'priority'] : []
    )
  }

  // console.log('selectedColumn', selectedColumn)
  // console.log('checkedColumns', checkedColumns)

  function getHideColumn() {
    const filteredGroups = groups.map((group) => {
      const filteredTasks = group.tasks.map((task) => {
        console.log({ selectedColumn })
        const filteredTask = selectedColumn.reduce((acc, key) => {
          if (task.hasOwnProperty(key)) {
            acc[key] = task[key]
          }
          return acc
        }, {})
        console.log({ filteredTask })
        filteredTask._id = task._id
        filteredTask.title = task.title
        filteredTask.style = task.style
        filteredTask.memberIds = task.memberIds
        filteredTask.labelIds = task.labelIds
        filteredTask.description = task.description
        filteredTask.comments = task.comments
        filteredTask.checklist = task.checklist
        filteredTask.archivedAt = task.archivedAt
        return filteredTask
      })
      console.log({ filteredTasks })

      return {
        ...group,
        tasks: filteredTasks,
      }
    })

    const nonEmptyGroups = filteredGroups.filter(
      (group) => group.tasks.length > 0
    )
    // console.log(nonEmptyGroups)

    setFilterBy(nonEmptyGroups)
    return nonEmptyGroups
  }

  return (
    <div className="monday-storybook-dialog--story-padding">
      <Dialog
        content={
          <DialogContentContainer>
            <div className="display-columns">
              <div className="header">
                <span>Display columns</span>
              </div>
              <div className="search-box">
                <button className="get-btn" onClick={getHideColumn}>
                  Get columns to show/hide
                </button>
              </div>
              <div className="columns-list">
                <label>
                  <input
                    type="checkbox"
                    checked={Object.values(checkedColumns).every(Boolean)}
                    onChange={handleSelectAll}
                  />
                  All columns
                  <span className="column-count">
                    {Object.values(checkedColumns).filter(Boolean).length}{' '}
                    selected
                  </span>
                </label>
                <div className="item-columns">
                  <label>
                    <input
                      type="checkbox"
                      id="byMember"
                      checked={checkedColumns.byMember}
                      onChange={handleCheckboxChange}
                    />
                    Person
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      id="status"
                      checked={checkedColumns.status}
                      onChange={handleCheckboxChange}
                    />
                    Status
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      id="dueDate"
                      checked={checkedColumns.timeline}
                      onChange={handleCheckboxChange}
                    />
                    Time line
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      id="priority"
                      checked={checkedColumns.priority}
                      onChange={handleCheckboxChange}
                    />
                    Priority
                  </label>
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
        position="bottom"
        showTrigger={['click']}
      >
        <div
          style={{ padding: '4px', cursor: 'pointer' }}
          icon={function noRefCheck() {}}
          className="filter-item sort"
        >
          <Hide />
          Hide
        </div>
      </Dialog>
    </div>
  )
}
