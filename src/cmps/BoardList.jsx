import { Flex } from 'monday-ui-react-core';
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards}) {
    console.log('board list ')

    return (
        <section>
            <div
                 className="board-list-container"
            >
                {boards.slice(0, 4).map(board => (
                    <div key={board._id} className="board-preview-wrapper">
                        <BoardPreview board={board} />
                        </div>
                ))}
            </div>
        </section>
    );
}
