import { Flex } from 'monday-ui-react-core';
import { BoardPreview } from './BoardPreview'

export function BoardList({ boards}) {
    console.log('board list ')

    return (
        <section>
            <Flex
                direction={Flex.directions.ROW}
                wrap={true}
                gap={Flex.gaps.SMALL}
                justify={Flex.justify.SPACE_AROUND}
                 className="board-list-flex"
            >
                {boards.slice(0, 4).map(board => (
                    <div key={board._id} className="board-preview-wrapper">
                        <BoardPreview board={board} />
                        </div>
                ))}
            </Flex>
        </section>
    );
}
