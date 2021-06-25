import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Axios from 'axios';
import socketIOClient from "socket.io-client";
import { toast } from 'react-toastify';
import { CardContent, CircularProgress, FormControl, Input, InputAdornment, InputLabel, makeStyles, TextField, ClickAwayListener, IconButton } from '@material-ui/core';
import { Undo, Save } from '@material-ui/icons';
import DatePicker from '../date_picker/DatePicker';
import { createVacation } from '../../redux/actions'
import Tooltip from '../Tooltip';
import ImageUpload from './ImageUpload';
import url from '../../service'

toast.configure()
const AddVacation = ({ setAddVacation }) => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [error, setError] = useState('');
    const [file, setFile] = useState()
    const [description, setDescription] = useState()
    const [destination, setDestination] = useState()
    const [price, setPrice] = useState(0)
    const [dates, setDates] = useState([])
    const [isDestination, setIsDestination] = useState(false)
    const [coordinates, setCoordinates] = useState({ lat: null, lon: null })
    const [isLoading, setIsLoading] = useState(false)
    const [isOpenTooltip, setIsOpenTooltip] = useState(false)
    const socket = socketIOClient(url)

    useEffect(() => {
        const getDestinationData = async () => {
            if (destination?.length > 2) {
                const destinationData = await Axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${destination}&appid=86457b0129712697ddacbf9b3caa7282`)
                setIsDestination(!!destinationData.data.length)
                setCoordinates({
                    lat: destinationData.data[0]?.lat,
                    lon: destinationData.data[0]?.lon
                })
                return
            }
            setIsDestination(false)
        }
        getDestinationData()
    }, [destination])

    const addVacationHandler = async () => {
        try {
            if (price <= 0) {
                setError('Please insert valid price')
                setIsOpenTooltip(true)
                return
            }
            setIsLoading(true)
            const image = await Axios.post(`${url}/vacations/imageUpload`, JSON.stringify({ data: file }), { headers: { 'Content-type': 'application/json' } })
            await Axios.post(`${url}/vacations/createVacation`, {
                image: image.data,
                destination,
                lat: coordinates.lat,
                lon: coordinates.lon,
                description,
                dates: dates.join(' - '),
                price: Number(price),
                followers: 0
            }).then(res => {
                socket.emit('add_vacation', res.data)
                dispatch(createVacation(res.data))
                toast.success("Vacation added!")
            })
            
            setAddVacation(false)
        } catch (err) {
            setIsOpenTooltip(true)
            if (err.response.data.message === 'Missing required parameter - file') {
                setError('Please upload an image')
            } else {
                setError(err.response.data.message)
            }
            setIsLoading(false)
        }
    }

    return (
        <div className={classes.root}>
            <ImageUpload setFile={setFile} />
            <CardContent className={classes.cardContent}>
                <div>
                    <TextField
                        label={!isDestination && destination?.length ? 'Destination - Country or City not found' : 'Destination'}
                        error={!isDestination && !!destination?.length}
                        onChange={e => setDestination(e.target.value)}
                        style={{ width: '100%' }}
                        inputProps={{ maxLength: 50 }}
                    />
                    <div className={classes.datePickers}>
                        <DatePicker dates={dates} setDates={setDates} />
                    </div>
                    <TextField label="Description" style={{ width: '100%' }} inputProps={{ maxLength: 210 }} onChange={e => setDescription(e.target.value)} />
                </div>
                <div>
                    <FormControl onFocus={() => { price === 0 && setPrice('') }} onBlur={() => { price === '' && setPrice(0) }} fullWidth className={classes.price}>
                        <InputLabel>Price</InputLabel>
                        <Input
                            type='number'
                            value={price}
                            startAdornment={<InputAdornment position="start" style={{ margin: 0, marginRight: 8 }}>$</InputAdornment>}
                            onChange={e => e.target.value.length < 6 && setPrice(e.target.value)}

                        />
                    </FormControl>
                    <div className={classes.buttons}>
                        <Tooltip title='Cancel'>
                            <IconButton onClick={() => setAddVacation(false)}>
                                <Undo style={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                        {isLoading ? <CircularProgress className={classes.circularProgress} color={'secondary'} size={20} /> : <ClickAwayListener onClickAway={() => setIsOpenTooltip(false)}>
                            <Tooltip title={error} open={isOpenTooltip}>
                                <IconButton onClick={addVacationHandler}>
                                    <Save color='primary' style={{ fontSize: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </ClickAwayListener>}
                    </div>
                </div>
            </CardContent>
        </div>
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        display: 'flex',
        position: 'relative',
        paddingTop: 1,
        borderTop: '1px solid lightgrey',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column'
        }
    },
    cardContent: {
        marginLeft: 10,
        padding: 4,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        '& *': {
            fontSize: 15
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
            paddingLeft: 0,
        }
    },
    circularProgress: {
        position: 'relative',
        right: 10,
        top: 5,
        marginLeft: 24,
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    datePickers: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 60,
        width: '100%',
        '& > *': {
            marginTop: 10,
            paddingTop: 10
        }
    },
    divider: {
        padding: '5px 0 10px',
        width: 113,
    },
    price: {
        marginTop: 12,
        width: '100px',
    },
    buttons: {
        position: 'absolute',
        bottom: 25,
        right: 2,
    }
}));

export default AddVacation