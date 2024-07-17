import { Link } from 'react-router-dom'

// import boardPreviewImg from '../assets/img/board-preview/board-preview-01.png'

export function BoardPreview({ board }) {
  return (
    <article className='board-preview'>
      <Link to={`/board/${board._id}`}>
        {/* <img src={boardPreviewImg} alt='boardPreviewImg' /> */}
        {board.title}
        <p>
          work managment {'>'} Main workspace {'>'} {board.title}{' '}
        </p>
      </Link>
    </article>
  )
}
