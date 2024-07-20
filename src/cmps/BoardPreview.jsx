import { Link } from 'react-router-dom'
import { Favorite } from 'monday-ui-react-core/icons'
import { Board } from 'monday-ui-react-core/icons'
import 'monday-ui-react-core/dist/main.css'

import boardPreviewImg from '../assets/img/board-preview/board-preview-01.png'
import { toggleStarredBoard } from '../store/actions/board.action'
import { Icon } from 'monday-ui-react-core'

export function BoardPreview({ board }) {
  async function handleToggleStarred(event) {
    event.stopPropagation()
    toggleStarredBoard(board._id)
    board.isStarred = !board.isStarred
  }

  return (
    <article className='board-preview-container'>
    <div className='board-preview-content'>
      <Link to={`/board/${board._id}`} className='board-preview-link'>
        <div className='board-preview-img'>
          <img src={boardPreviewImg} alt='boardPreviewImg' />
        </div>
        <div className='board-preview-item-wrapper flex'>
          <Board size="18" label='Expand list' />
          <div className='board-preview-title'>{board.title}</div>
        </div>
      </Link>
      <button className='starred-btn' title='Starred' onClick={handleToggleStarred}>   

        {board.isStarred ? (
          // <FontAwesomeIcon icon={faStar} className='fa-star' style={{ color: '#FFD43B' }} title='Favorite' />
          <Icon iconType={Icon.type.ICON_FONT} icon="fa fa-star" className='yellow-star-icon'/>
        ) : (
          <Favorite className='monday-icon' />
        )}
           </button>
    </div>
    <Link to={`/board/${board._id}`}>
      <div className='board-preview-navigation'>
        <p>
          work management {'>'} Main workspace {'>'} {board.title}{' '}
        </p>
      </div>
    </Link>
  </article>
);
}
