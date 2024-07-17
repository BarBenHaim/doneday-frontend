import { BoardList } from '../cmps/BoardList'

export function BoardIndex() {
    console.log('board index ')

    return (
        <section className='board-index'>
            <h1>This is board index</h1>
            <BoardList />
        </section>
    )
}
