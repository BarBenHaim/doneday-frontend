import { BoardPreview } from './BoardPreview'

export function BoardList({ boards }) {
  console.log('board list ')

  return (
    <section>
      <ul className='board-list'>
        <h1>Recently visited</h1>
        {boards.map((board) => (
          <li key={board._id}>
            <BoardPreview board={board} />
          </li>
        ))}
      </ul>
    </section>
  )
}
