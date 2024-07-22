export const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}

export const getPriorityStyle = value => {
    switch (value) {
        case 'Critical':
            return { backgroundColor: '#563E3E', color: '#F7F7F8' }
        case 'High':
            return { backgroundColor: '#401694', color: '#F7F7F8' }
        case 'Medium':
            return { backgroundColor: '#5559df', color: '#F7F7F8' }
        case 'Low':
            return { backgroundColor: '#579BFC', color: '#F7F7F8' }
        default:
            return { backgroundColor: '#D3D3D3', color: '#F7F7F8' }
    }
}

export const getStatusStyle = value => {
    switch (value) {
        case 'Done':
            return { backgroundColor: '#00C875', color: '#F7F7F8' }
        case 'Working on it':
            return { backgroundColor: '#fdab3d', color: '#F7F7F8' }
        case 'Stuck':
            return { backgroundColor: '#DF2F4A', color: '#F7F7F8' }
        case 'Not Started':
            return { backgroundColor: '#C4C4C4', color: '#F7F7F8' }
        case 'Important':
            return { backgroundColor: '#007EB5', color: '#F7F7F8' }
        default:
            return { backgroundColor: '#C4C4C4', color: '#F7F7F8' }
    }
}
