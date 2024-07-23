import { BoardPreview } from './BoardPreview'

export function BoardList({ boards}) {
    console.log('board list ')

    return (
        <section>
            <ul className='board-list-container'>
                {boards.map(board => (
                    <li key={board._id}>
                        <BoardPreview board={board} />
                        {/* <button onClick={() => onRemoveBoard(board._id)}>x</button> */}
                    </li>
                ))}
            </ul>
        </section>
    )
}
