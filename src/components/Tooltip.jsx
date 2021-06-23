import React from 'react'
import { makeStyles, Tooltip as MuiTooltip, Zoom } from '@material-ui/core'

const Tooltip = React.forwardRef((props, ref) => {
    const classes = useStyles()
    const { open, title, children } = props
    return (
        <MuiTooltip
            ref={ref}
            TransitionComponent={Zoom}
            classes={{
                tooltip: classes.tooltipLabel,
                arrow: classes.customArrow
            }}
            open={open}
            title={title}
            arrow>
            {children}
        </MuiTooltip>
    )
})

const useStyles = makeStyles(theme => ({
    tooltipLabel: {
        fontSize: 16,
        padding: '5px 10px',
        backgroundColor: '#f50057',
        textAlign: 'center'
    },
    customArrow: {
        color: '#f50057',
    }
}))

export default Tooltip