// utils.js
export const getResponsiveWidths = () => {
    const width = window.innerWidth

    if (width <= 480) {
        return {
            checkbox: '50px',
            title: '150px',
            status: '100px',
            priority: '100px',
            dueDate: '140px',
            memberIds: '140px',
            files: '80px',
            description: '150px',
            checklists: '100px',
        }
    } else if (width <= 768) {
        return {
            checkbox: '50px',
            title: '200px',
            status: '100px',
            priority: '100px',
            dueDate: '140px',
            memberIds: '140px',
            files: '100px',
            description: '200px',
            checklists: '150px',
        }
    } else {
        return {
            checkbox: '50px',
            title: '300px',
            status: '140px',
            priority: '140px',
            dueDate: '140px',
            memberIds: '140px',
            files: '140px',
            description: '300px',
            checklists: '200px',
        }
    }
}
