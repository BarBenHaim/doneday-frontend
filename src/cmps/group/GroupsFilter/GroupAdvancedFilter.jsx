import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'

import { Filter } from 'monday-ui-react-core/icons'

import { Dialog, DialogContentContainer } from 'monday-ui-react-core'

export function GroupAdvancedFilter({ setFilterBy }) {
  const { boardId } = useParams()
  const currBoard = useSelector((storeState) =>
    storeState.boardModule.boards.find((board) => board._id === boardId)
  )
  const groups = currBoard.groups || []
  const tasks = groups.flatMap((group) => group.tasks || [])

  const [selectedColumn, setSelectedColumn] = useState([])
  const [selectedCondition, setselectedCondition] = useState('')

  const [columnToFilter, setColumnToFilter] = useState('')
  const [labelsToFilterBy, setLabelsToFilterBy] = useState('')

  const [isTextField, setTextField] = useState(false)
  const [textToFilter, setTextToFilter] = useState('')

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
      <div className="monday-storybook-dialog--story-padding">
        <Dialog
          content={
            <DialogContentContainer>
              {' '}
              <div className="filter-filter"></div>
              <div className="advanced-filter-modal">
                <div className="advanced-filter-content">
                  <section className="filter-header">
                    <div className="left-side">
                      <h2 className="main-header">
                        Advanced filters
                        <span className="main-header second">
                          Showing all tasks
                        </span>
                      </h2>
                    </div>
                    <div className="right-side">
                      <span
                        style={{ cursor: 'pointer' }}
                        className="close"
                        onClick={() => setIsFilterActive(false)}
                      >
                        &times;
                      </span>
                    </div>
                  </section>
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
                        <option value="does_not_contain">
                          does not contain
                        </option>
                      </select>
                      {isTextField ? (
                        <input
                          type="text"
                          id="filterTextField"
                          name="filterTextField"
                          placeholder="Enter text to filter by"
                          onChange={handleTextFilterChange}
                        />
                      ) : (
                        <select
                          className="column"
                          onChange={handleLabelsToFilterBy}
                        >
                          <option value="" disabled selected>
                            Value
                          </option>
                          {selectedColumn.map((label, idx) => (
                            <option key={idx}>{label}</option>
                          ))}
                        </select>
                      )}
                      <button onClick={getFilterdgroups}>
                        <i
                          className="fa fa-search"
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
          position="bottom"
          showTrigger={['click']}
        >
          <div
            style={{ padding: '4px', cursor: 'pointer' }}
            icon={function noRefCheck() {}}
            className="filter-item filter"
          >
            <Filter />
            Filter
          </div>
        </Dialog>
      </div>
    </>
  )
}