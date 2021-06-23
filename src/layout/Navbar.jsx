import React from 'react'
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, makeStyles } from '@material-ui/core';
import { FlightTakeoff, AccountCircle, ExitToApp, PieChart } from '@material-ui/icons';
import { updateUserData } from '../redux/actions';
import Tooltip from '../components/Tooltip';

const Navbar = () => {
    const classes = useStyles()
    const userData = useSelector(state => state.userData)
    const dispatch = useDispatch()
    const history = useHistory();
    const firstName = `${userData.firstName?.charAt(0).toUpperCase() + userData.firstName?.slice(1).toLowerCase()}`
    const lastName = `${userData.lastName?.charAt(0).toUpperCase() + userData.lastName?.slice(1).toLowerCase()}`

    const logout = () => {
        localStorage.setItem('auth-token', '')
        dispatch(
            updateUserData({
                token: undefined,
                firstName: undefined,
                lastName: undefined,
                id: undefined,
                role: undefined,
            })
        )
        history.push('/login')
    }

    return (
        <div className={classes.navbarContainer}>
            <div className={classes.topLeft}>
                <Tooltip title={'Home'}>
                    <IconButton onClick={() => history.push('/')}>
                        <FlightTakeoff color={'secondary'} />
                    </IconButton>
                </Tooltip>
                <div className={classes.title}>GetVacation</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: 20 }}>
                    <AccountCircle color={'secondary'} style={{ fontSize: 35, marginRight: 5 }} />
                    <div style={{ fontSize: 17 }}>
                        <span>{firstName} </span><span className={classes.lastName}>{lastName}</span>
                    </div>
                </div>
                {userData.role === 1 && <Tooltip title={'Stats'}>
                    <IconButton onClick={() => history.push('/stats')}>
                        <PieChart color={'secondary'} />
                    </IconButton>
                </Tooltip>}
                <Tooltip title={'Sign out'}>
                    <IconButton style={{ marginRight: 5 }} onClick={logout} color="primary">
                        <ExitToApp color={'secondary'} style={{ fontSize: 30 }} />
                    </IconButton>
                </Tooltip>
            </div>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    navbarContainer: {
        backgroundColor: '#fff',
        zIndex: 10,
        position: 'fixed',
        width: '100%',
        minHeight: 45,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 6px -6px black',
    },
    topLeft: {
        marginLeft: 20,
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            marginLeft: 2,
            marginRight: 20
        }
    },
    title: {
        fontSize: 25,
        marginLeft: 10,
        [theme.breakpoints.down('xs')]: {
            fontSize: 18,
            marginLeft: 2,
        }
    },
    lastName: {
        [theme.breakpoints.down('xs')]: {
            display: 'none'
        }
    }
}))

export default Navbar