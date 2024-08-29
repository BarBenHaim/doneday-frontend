import React, { useEffect, useMemo } from 'react'
import { Pie, Bar, Line, Radar } from 'react-chartjs-2'
import 'chart.js/auto'
import { useSelector } from 'react-redux'
import { loadBoards } from '../store/actions/board.action'

const calculateStatusPercentages = boards => {
    const statusCounts = {}
    let totalTasks = 0

    boards.forEach(board => {
        board.groups.forEach(group => {
            group.tasks.forEach(task => {
                if (task.status !== null) {
                    if (statusCounts[task.status]) {
                        statusCounts[task.status]++
                    } else {
                        statusCounts[task.status] = 1
                    }
                    totalTasks++
                }
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

export function Dashboard() {
    useEffect(() => {}, [])

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

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                position: 'left',
            },
        },
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

    const lineData = {
        labels: ['Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24'],
        datasets: [
            {
                label: 'Tasks Completed Over Time',
                data: [22, 25, 20, 23, 31],
                fill: false,
                borderColor: '#4bc0c0',
            },
        ],
    }

    const radarData = {
        labels: ['Done', 'Working on it', 'Stuck', 'Not Started', 'Important'],
        datasets: [
            {
                label: 'Status Distribution',
                data: statusData.map(data => data.value),
                backgroundColor: 'rgba(179, 181, 198, 0.2)',
                borderColor: 'rgba(179, 181, 198, 1)',
                pointBackgroundColor: 'rgba(179, 181, 198, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179, 181, 198, 1)',
            },
        ],
    }

    return (
        <div className='dashboard'>
            <div className='chart-row'>
                <div className='chart-container'>
                    <h3>Status Distribution</h3>
                    <Pie data={pieData} options={pieOptions} />
                </div>
                <div className='chart-container'>
                    <h3>Task Count by Priority</h3>
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            </div>
            <div className='chart-row'>
                <div className='chart-container'>
                    <h3>Tasks Completed Over Time</h3>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
                <div className='chart-container'>
                    <h3>Status Distribution Radar</h3>
                    <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            </div>
        </div>
    )
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
