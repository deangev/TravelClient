import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { createVacation, editVacation, removeVacation } from '../../redux/actions'
import Navbar from '../../layout/Navbar';
import Vacation from '../../components/vacation/Vacation';
import AddVacation from '../../components/add_vacation/AddVacation';
import Map from '../../components/map/Map';
import Filter from '../../components/filter/Filter';
import Tooltip from '../../components/Tooltip';

const SKELETON_WIDTH_ARRAY = [60, 100, 280, 300, 290]

const Home = () => {
    const classes = useStyles();
    const history = useHistory()
    const url = useSelector(state => state.url)
    const socket = socketIOClient(url)
    const userData = useSelector(state => state.userData)
    const filteredVacations = useSelector(state => state.filteredVacations)
    const dispatch = useDispatch()

    const [addVacation, setAddVacation] = useState(false)
    const [activeVacationData, setActiveVacationData] = useState()
    const activeVacationMapRef = useRef()
    const [map, setMap] = useState(null);

    if (!userData.token) history.push("/login")

    socket.on('add_vacation', (vacation) => {
        return dispatch(createVacation(vacation))
    })

    socket.on('remove_vacation', (vacationId) => {
        return dispatch(removeVacation(vacationId))
    })

    socket.on('edit_vacation', (editedVacation) => {
        return dispatch(editVacation(editedVacation))
    })

    const handleMapData = async (vacation) => {
        setActiveVacationData(vacation)
        await Axios.post(`${url}/vacations/getCoordinates`, { id: vacation.id }).then(res => {
            activeVacationMapRef.current = res.data
            map.setView([res.data.lat || 51.505, res.data.lon || -0.09], 9)
        })
    }
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Navbar />
            <div style={{ position: 'relative', top: '80px' }}>
                <Filter />
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <div className={classes.allVacationsWrapper}>
                        {userData.role === 1 && (
                            addVacation ? (
                                <div className={classes.vacationWrapper}>
                                    <AddVacation setAddVacation={setAddVacation} />
                                </div>
                            ) : (
                                <div
                                    className={classes.addVacationWrapper}
                                    style={{ display: 'flex', cursor: 'pointer' }}
                                    onClick={() => setAddVacation(true)}
                                >
                                    <div className={classes.addSkeletonIconContainer}>
                                        <Tooltip title={'Add vacation'}>
                                            <AddCircleIcon className={classes.addIcon} color='secondary' />
                                        </Tooltip>
                                        <Skeleton style={{ borderRadius: 10 }} variant="rect" height={200} width={300} className={classes.rectSkeleton} />
                                    </div>
                                    <div className={classes.skeletonContentWrapper}>
                                        {SKELETON_WIDTH_ARRAY.map((skeletonWidth, i) => {
                                            return <Skeleton variant="text" width={skeletonWidth} key={i} />
                                        })}
                                        <Skeleton variant="text" width={50} className={classes.lastSkeleton} />
                                    </div>
                                </div>
                            ))}
                        {filteredVacations.map(vacation => (
                            <div key={vacation.id} className={classes.vacationWrapper} style={{ borderBottom: '1px solid lightgrey' }}>
                                <Vacation vacation={vacation} handleMapData={handleMapData}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={classes.mapContainer} style={{ right: `${filteredVacations.length ? '16px' : 0}` }}>
                <Map map={map} setMap={setMap} lat={activeVacationMapRef.current?.lat} lon={activeVacationMapRef.current?.lon} vacation={activeVacationData} />
            </div>
        </div >
    )
}

const useStyles = makeStyles(theme => ({
    addSkeletonIconContainer: {
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            width: '89vw !important'
        }
    },
    lastSkeleton: {
        position: 'absolute',
        bottom: 30,
        [theme.breakpoints.down('xs')]: {
            display: 'none',
        },
    },
    rectSkeleton: {
        [theme.breakpoints.down('xs')]: {
            width: '100% !important'
        },
    },
    addIcon: {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        fontSize: 32,
        zIndex: 1
    },
    addVacationWrapper: {
        padding: '20px 0 20px 0',
        borderTop: '1px solid lightgrey',
        borderBottom: '1px solid lightgrey',
        marginLeft: 20,
        width: '48vw',
        [theme.breakpoints.down('md')]: {
            width: '95vw',
        },
        [theme.breakpoints.down('xs')]: {
            width: '89vw',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    allVacationsWrapper: {
        minWidth: 730,
        width: '45%',
        height: '100%',
    },
    mapContainer: {
        minWidth: '45vw',
        maxWidth: '48vw',
        height: 'calc(100vh - 45px)',
        marginLeft: 40,
        position: 'fixed',
        left: '50%',
        bottom: 0,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    skeletonContentWrapper: {
        background: '#fff',
        paddingBottom: 24,
        paddingLeft: 10,
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            top: 20
        },
    },
    vacationWrapper: {
        width: '48vw',
        margin: '0 20px',
        borderBottom: '1px solid lightgrey',
        [theme.breakpoints.down('md')]: {
            width: '93vw',
        },
        [theme.breakpoints.down('xs')]: {
            width: '89vw',
        }
    },
}))

export default Home