import React, { useEffect, useMemo } from 'react'
import { Pie, Bar, Line } from 'react-chartjs-2'
import 'chart.js/auto'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/actions/board.action'

const calculateStatusPercentages = boards => {
    const statusCounts = {}
    let totalTasks = 0

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (statusCounts[task.status]) {
                    statusCounts[task.status]++
                } else {
                    statusCounts[task.status] = 1
                }
                totalTasks++
            })
        })
    })

    return Object.keys(statusCounts).map(status => ({
        name: status,
        value: ((statusCounts[status] / totalTasks) * 100).toFixed(2),
    }))
}

const calculatePriorityCounts = boards => {
    const priorityCounts = {}

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (priorityCounts[task.priority]) {
                    priorityCounts[task.priority]++
                } else {
                    priorityCounts[task.priority] = 1
                }
            })
        })
    })

    return Object.keys(priorityCounts).map(priority => ({
        name: priority,
        count: priorityCounts[priority],
    }))
}

const getPriorityStyle = value => {
    switch (value) {
        case 'Critical':
            return '#563E3E'
        case 'High':
            return '#401694'
        case 'Medium':
            return '#5559df'
        case 'Low':
            return '#579BFC'
        default:
            return '#D3D3D3'
    }
}

const getStatusStyle = value => {
    switch (value) {
        case 'Done':
            return '#00C875'
        case 'Working on it':
            return '#fdab3d'
        case 'Stuck':
            return '#DF2F4A'
        case 'Not Started':
            return '#C4C4C4'
        case 'Important':
            return '#007EB5'
        default:
            return '#C4C4C4'
    }
}

export function Dashboard() {
    useEffect(() => {
        loadBoards()
    }, [])

    const boards = useSelector(storeState => storeState.boardModule.boards)
    const statusData = useMemo(() => calculateStatusPercentages(boards), [boards])
    const priorityData = useMemo(() => calculatePriorityCounts(boards), [boards])

    const pieData = {
        labels: statusData.map(data => data.name),
        datasets: [
            {
                data: statusData.map(data => data.value),
                backgroundColor: statusData.map(data => getStatusStyle(data.name)),
            },
        ],
    }

    const barData = {
        labels: priorityData.map(data => data.name),
        datasets: [
            {
                label: 'Task Count by Priority',
                data: priorityData.map(data => data.count),
                backgroundColor: priorityData.map(data => getPriorityStyle(data.name)),
            },
        ],
    }

    return (
        <div className='dashboard'>
            <div className='chart-container'>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>

            <div className='chart-container'>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
        </div>
    )
}
