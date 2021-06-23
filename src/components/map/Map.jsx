import React, { useRef } from 'react'
import { MapContainer, TileLayer, useMapEvent } from 'react-leaflet'
import { makeStyles } from '@material-ui/core';

function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
        map.setView(e.latlng, map.getZoom() + 1, {
            animate: animateRef.current || false,
        })
    })
    return null
}

const Map = ({ lat, lon, setMap }) => {
    const classes = useStyles()
    const animateRef = useRef(true);

    return (
        <MapContainer className={classes.mapContainer} center={[lat || 51.505, lon || -0.09]} scrollWheelZoom={true} zoom={8} whenCreated={setMap} style={{ width: '100%', height: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
            />
            <SetViewOnClick animateRef={animateRef} />
        </MapContainer>
    )
}

const useStyles = makeStyles({
    mapContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
})

export default Map