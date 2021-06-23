import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Bar } from 'react-chartjs-2'
import Navbar from '../../layout/Navbar'
import { useHistory } from 'react-router-dom'

export default function Stats() {
    const vacations = useSelector(state => state.vacations)
    const userData = useSelector(state => state.userData)
    const [chartData, setChartData] = useState()
    const history = useHistory()

    if (userData.role === 0) history.push('/')

    const formattedVacationArray = useMemo(() => vacations.filter(v => v.followers > 0).map(vacation => `${vacation.destination}(${vacation.id})`), [vacations])
    const formattedFollowersArray = useMemo(() => vacations.filter(v => v.followers > 0).map(vacation => vacation.followers), [vacations])

    const chart = useCallback(() => {
        setChartData({
            labels: formattedVacationArray,
            datasets: [
                {
                    data: formattedFollowersArray,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'
                    ],
                    borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)'
                    ],
                    borderWidth: 1
                }
            ]
        })
    }, [formattedVacationArray, formattedFollowersArray])

    useEffect(() => {
        chart()
    }, [chart])

    return (
        <div>
            <Navbar />
            <div style={{ width: '90vw', height: '85vh', position: 'relative', top: '80px', left: '50%', transform: 'translateX(-50%)' }}>
                <Bar
                    data={chartData}
                    options={{
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                suggestedMin: 0,
                                suggestedMax: 20,
                            },
                        },
                    }} />
            </div>
        </div>
    )
}
