import { BoardPreview } from './BoardPreview'
import { BoardBuilder } from './group/BoardBuilder'

export function BoardList({ boards }) {
    console.log('board list ')

    return (
        <section>
            <BoardBuilder />
            <div className='board-list-container'>
                {boards.map(board => (
                    <div key={board._id} className='board-preview-wrapper'>
                        <BoardPreview board={board} />
                    </div>
                ))}
            </div>
        </section>
    )
}
