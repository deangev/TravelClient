import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios'
import { toast } from 'react-toastify';
import socketIOClient from "socket.io-client";
import { CardContent, CircularProgress, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, ClickAwayListener } from '@material-ui/core';
import { Delete, Undo, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { editVacation, removeVacation } from '../../redux/actions';
import DatePicker from '../date_picker/DatePicker'
import EditImage from './EditImage';
import Tooltip from '../Tooltip';
import url from '../../service';

toast.configure()
const EditVacation = (props) => {
    const classes = useStyles();
    const { setEdit, vacation } = props
    const dispatch = useDispatch()
    const socket = socketIOClient(url)
    const vacations = useSelector(state => state.vacations)

    const deleteRef = useRef()
    const [file, setFile] = useState();
    const [error, setError] = useState('');
    const [description, setDescription] = useState(vacation.description);
    const [destination, setDestination] = useState(vacation.destination);
    const [coordinates, setCoordinates] = useState({ lat: null, lon: null })
    const [isDestination, setIsDestination] = useState(true)
    const [dates, setDates] = useState(vacation.dates)
    const [price, setPrice] = useState(vacation.price);
    const [isLoading, setIsLoading] = useState(false)
    const [isEditTooltipOpen, setIsEditTooltipOpen] = useState(false)
    const vacationDestination = vacations.filter(v => v.id === vacation.id)

    const getDestinationData = async (value) => {
        try {
            setDestination(value)
            if (value?.length <= 2) return setIsDestination(false)

            await Axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${value}&appid=86457b0129712697ddacbf9b3caa7282`).then(res => {
                setIsDestination(!!res.data.length)
                setCoordinates({
                    lat: res.data[0]?.lat,
                    lon: res.data[0]?.lon
                })
            })
        } catch (err) {
            console.warn(err);
        }
    }

    const handleSaveVacation = async () => {
        try {
            if (!isDestination) {
                setError('Destination not found')
                setIsEditTooltipOpen(true)
                return
            }
            if (Array.isArray(dates) && (!dates[0] || !dates[1])) {
                setError('Please insert valid dates')
                setIsEditTooltipOpen(true)
                return
            }
            if (price <= 0) {
                setError('Please insert valid price')
                setIsEditTooltipOpen(true)
                return
            }

            setIsLoading(true)
            let image = vacation.image
            file && await Axios.post(`${url}/vacations/imageUpload`, JSON.stringify({ data: file }), { headers: { 'Content-type': 'application/json' } }).then(res => {
                image = res.data
            })

            const editedVacation = {
                id: vacation.id,
                image,
                destination,
                lat: coordinates.lat,
                lon: coordinates.lon,
                description,
                dates: Array.isArray(dates) ? dates.join(' - ') : dates,
                price: Number(price),
                followers: vacation.followers,
            }

            dispatch(editVacation(editedVacation))
            socket.emit('edit_vacation', editedVacation)
            await Axios.post(`${url}/vacations/editVacation`, editedVacation)
            toast.success("Vacation edited!")
            setEdit(false)
            props.setEdittedTitle(destination)

        } catch (err) {
            setIsEditTooltipOpen(true)
            setIsLoading(false)
            setError(err.response.data.message);
        }
    }

    const handleDeleteVacation = () => {
        deleteRef.current.classList.add('animate__fadeOut')
        setTimeout(async () => {
            deleteRef.current.classList.remove('animate__fadeOut')
            toast.success("Vacation removed!")
            dispatch(removeVacation(vacation.id))
            socket.emit('remove_vacation', vacation.id)
            await Axios.post(`${url}/vacations/removeVacation`, {
                id: vacation.id
            })
        }, 550)
    }

    return (
        <div className={`${classes.root} animate__animated animate__faster`} ref={deleteRef}>
            <EditImage setFile={setFile} image={vacation.image} />
            <CardContent className={classes.cardContent}>
                <div className={classes.titleContainer}>
                    <div>
                        <TextField
                            style={{ width: '100%' }}
                            onChange={e => getDestinationData(e.target.value)}
                            defaultValue={vacationDestination[0].destination}
                            label={!isDestination && destination?.length ? 'Destination - Country or City not found' : 'Destination'}
                            error={!isDestination && !!destination?.length}
                        />
                        <DatePicker dates={dates} setDates={setDates} />
                    </div>
                </div>
                <TextField label="Description" defaultValue={vacation.description} style={{ width: '100%' }} inputProps={{ maxLength: 210 }} onChange={e => setDescription(e.target.value)} />
                <FormControl fullWidth className={classes.price}>
                    <InputLabel>Price</InputLabel>
                    <Input
                        type='number'
                        startAdornment={<InputAdornment position="start" style={{ margin: 0, marginRight: 8 }}>$</InputAdornment>}
                        value={price}
                        onChange={e => {
                            if (e.target.value.length < 6) setPrice(e.target.value)
                        }}
                    />
                </FormControl>
                <div className={classes.buttonsContainer}>
                    <div className={classes.innerButtonsContainer}>
                        <Tooltip title={'Undo'}>
                            <IconButton onClick={() => setEdit(false)}>
                                <Undo fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        {isLoading ?
                            <div style={{ position: 'relative', top: 10, padding: '0 10px' }}><CircularProgress size={24} color={'primary'} /></div> :
                            isEditTooltipOpen ? (
                                <ClickAwayListener onClickAway={() => setIsEditTooltipOpen(false)}>
                                    <Tooltip
                                        title={error}
                                        open={isEditTooltipOpen}
                                        children={<IconButton onClick={handleSaveVacation}>
                                            <Save fontSize="small" color='primary' />
                                        </IconButton>}
                                    />
                                </ClickAwayListener>
                            ) : (
                                <Tooltip
                                    title={'Save'}
                                    children={<IconButton onClick={handleSaveVacation}>
                                        <Save fontSize="small" color='primary' />
                                    </IconButton>}
                                />
                            )
                        }
                        <Tooltip title={'Delete'}>
                            <IconButton onClick={handleDeleteVacation}>
                                <Delete fontSize="small" color='secondary' />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </div >
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        paddingTop: 20,
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column'
        }
    },
    cardContent: {
        marginLeft: 10,
        padding: 4,
        flexGrow: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
            paddingLeft: 0,
        }
    },
    datePickers: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 50,
        '& > *': {
            width: '48%',
            marginTop: 4,
            paddingTop: 10
        }
    },
    titleContainer: {
        width: '100%',
        position: 'relative',
    },
    buttonsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        position: 'absolute',
        right: 0,
        bottom: 18
    },
    innerButtonsContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        display: 'flex'
    },
    price: {
        marginTop: 5,
        width: '20%',
    }
}));

export default EditVacation