import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton, makeStyles } from '@material-ui/core'
import { Search, Close } from '@material-ui/icons';
import { clearInput, filterVacations } from '../../redux/actions'
import Tooltip from '../Tooltip'

export default function Filter() {
    const classes = useStyles()
    const searchString = useSelector(state => state.searchString)
    const dispatch = useDispatch()

    const handleSearch = (e) => {
        const inputText = e.target.value
        dispatch(filterVacations(inputText))
    }

    return (
        <div className={classes.inputContainer}>
            <input className={classes.input} value={searchString} onChange={handleSearch} placeholder={'Search by destination'} />
            {searchString.length
                ? <Tooltip title={'Clear'}>
                    <IconButton className={classes.icon} onClick={() => dispatch(clearInput())} style={{ padding: 6, right: -3 }}>
                        <Close color={'secondary'} />
                    </IconButton>
                </Tooltip>
                : <Search className={classes.icon} color={'secondary'} />}
        </div >
    )
}

const useStyles = makeStyles(theme => ({
    inputContainer: {
        position: 'relative',
        width: '48.4%',
        height: 40,
        marginBottom: 20,
        [theme.breakpoints.down('md')]: {
            width: '95vw',
        },
        [theme.breakpoints.down('xs')]: {
            width: '89vw !important'
        }
    },
    input: {
        border: '1px solid #ddd',
        borderRadius: 32,
        width: '100%',
        height: '100%',
        marginLeft: 15,
        fontSize: 16,
        padding: '5px 50px 5px 20px',
        outline: 'none !important'
    },
    icon: {
        transform: 'translateY(-50%)',
        position: 'absolute',
        right: 0,
        top: '50%'
    }
}))
