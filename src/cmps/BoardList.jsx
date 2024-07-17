import { BoardPreview } from './BoardPreview'

export function BoardList(board) {
    console.log('board list ')
    return (
        <section className='board-list'>
            <h1>this is board list</h1>
            <BoardPreview />
            <BoardPreview />
            <BoardPreview />
        </section>
    )
}
