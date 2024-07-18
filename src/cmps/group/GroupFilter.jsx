import { useState, useEffect } from 'react'
import { Favorite, Home } from 'monday-ui-react-core/icons'
export function GroupFilter({ filterBy, setFilterBy, handleSetFilterBy }) {
  // const [filterToEdit, setFilterToEdit] = useState(structuredClone(filterBy))

  // useEffect(() => {
  //   setFilterBy(filterToEdit)
  // }, [filterToEdit])

  // function handleChange(ev) {
  //   console.log(ev.target.value)

  //   const value = ev.target.value

  //   setFilterToEdit(value)
  //   console.log(filterToEdit)
  // }

  // function clearFilter() {
  //   setFilterToEdit({ ...filterToEdit, txt: '', minSpeed: '', maxPrice: '' })
  // }

  // function clearSort() {
  //   setFilterToEdit({ ...filterToEdit, sortField: '', sortDir: '' })
  // }

  const [isFilterModalOpen, setFilterModalOpen] = useState(false)
  const [isSortModalOpen, setSortModalOpen] = useState(false)

  const handleFilterClick = () => {
    setFilterModalOpen(true)
  }

  const handleSortClick = () => {
    setSortModalOpen(true)
  }

  const handleCloseModal = () => {
    setFilterModalOpen(false)
    setSortModalOpen(false)
  }

  return (
    <>
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
        <div className="sort">
          <button className="filter-item sort" onClick={handleSortClick}>
            <i className="fa-solid fa-sort"></i> Sort
          </button>
        </div>
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
                <select>
                  <option value="collaborators">Collaborators</option>
                  <option value="name">Name</option>
                  <option value="owner">Owner</option>
                  <option value="status">Status</option>
                </select>
                <select>
                  <option value="is">is</option>
                  <option value="is_not">is not</option>
                  <option value="contains">contains</option>
                  <option value="does_not_contain">does not contain</option>
                </select>
                <input type="text" placeholder="Value" />
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
