import React from 'react'
import './loader.css'

export default function Loader() {
    return (
        <main>
            <div className="preloader">
                <div className="preloader__square"></div>
                <div className="preloader__square"></div>
                <div className="preloader__square"></div>
                <div className="preloader__square"></div>
            </div>
            <div className="status">Loading<span className="status__dot">.</span><span className="status__dot">.</span><span className="status__dot">.</span></div>
        </main>
    )
}
