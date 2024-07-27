export function FilesCmp() {
    return (
        <div className='empty-state-container'>
            <img class='empty-state-image' src='https://cdn.monday.com/images/files-gallery/empty-state.svg'></img>
            <h1 className='add-file-header'>Add files here</h1>
            <p className='add-file-p'>
                Upload, comment and review all files in this item to easily collaborate in context
            </p>
            <button className='add-files-btn'>+ Add file</button>
        </div>
    )
}
