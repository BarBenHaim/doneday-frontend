import { Flex } from 'monday-ui-react-core'
import { BoardPreview } from './BoardPreview'
import TasksBuilder from './group/TasksBuilder'

export function BoardList({ boards }) {
    console.log('board list ')

    return (
        <section>
            <TasksBuilder />
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
