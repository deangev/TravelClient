import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { CardContent, Checkbox, Divider, IconButton } from '@material-ui/core';
import { Favorite, FavoriteBorder, Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { followVacation } from '../../redux/actions';
import EditVacation from '../edit_vacation/EditVacation';
import Tooltip from '../Tooltip';

const createMarkup = html => {
    return { __html: html }
}

const Vacation = (props) => {
    const { vacation } = props
    const classes = useStyles();
    const url = useSelector(state => state.url)
    const userData = useSelector(state => state.userData)
    const following = useSelector(state => state.following)
    const searchString = useSelector(state => state.searchString)
    const dispatch = useDispatch()

    const [edittedTitle, setEdittedTitle] = useState(props.vacation.destination)
    const [edit, setEdit] = useState(false);
    const [isVacationFollowed, setIsVacationFollowed] = useState(false)

    const handleFavorite = async () => {
        await Axios.post(`${url}/followers/follow`, {
            vacationId: vacation.id,
            followerId: userData.id,
        })
        dispatch(followVacation({ vacationIdToFollow: vacation.id, isFollowed: isVacationFollowed }))
        setIsVacationFollowed(!isVacationFollowed)
    }

    useEffect(() => {
        const isVacationFollowed = following.some(item => item === vacation.id)
        setIsVacationFollowed(isVacationFollowed)
    }, [following, vacation])

    useEffect(() => {
        setEdittedTitle()
    }, [searchString])

    return (
        <div className={`${classes.root} animate__animated animate__zoomIn animate__faster`}>
            {!edit ? <div className={classes.vacation}>
                <img src={vacation.image} className={classes.media} alt="" />
                <CardContent className={classes.cardContent}>
                    <div className={classes.vacationIcon}>
                        {userData.role === 1 ?
                            <Tooltip title={'Edit'}>
                                <IconButton onClick={() => setEdit(!edit)}>
                                    <Edit color={'secondary'} />
                                </IconButton>
                            </Tooltip> :
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div className={classes.followers}>{vacation.followers}</div>
                                <Tooltip title={isVacationFollowed ? 'Unlike' : 'Like'}>
                                    <Checkbox
                                        onChange={handleFavorite}
                                        checked={isVacationFollowed}
                                        icon={<FavoriteBorder />}
                                        checkedIcon={<Favorite />}
                                    />
                                </Tooltip>
                            </div>
                        }
                    </div>
                    <div className={classes.titleContainer}>
                        <div>
                            <h2 dangerouslySetInnerHTML={edittedTitle ? createMarkup(edittedTitle) : createMarkup(vacation.destination)}></h2>
                            <h5>{vacation.dates}</h5>
                        </div>
                    </div>
                    <div className={classes.divider}><Divider /></div>
                    <p>{vacation.description}</p>
                    <div className={classes.footer}>
                        <h4>${vacation.price.toLocaleString()}</h4>
                    </div>
                </CardContent></div> :
                <EditVacation className={classes.editVacation} vacation={vacation} setEdit={setEdit} setEdittedTitle={setEdittedTitle} />
            }
        </div >
    )
}

const useStyles = makeStyles(theme => ({
    root: {
        // animationDuration: '.4s',
        '& > *': {
            width: '100%',
            display: 'flex',
        },
    },
    media: {
        height: '200px',
        minWidth: '300px',
        width: '300px',
        borderRadius: 10,
        border: '1px solid lightgrey',
        [theme.breakpoints.down('xs')]: {
            width: '100%',
        }
    },
    cardContent: {
        marginLeft: 10,
        padding: 4,
        position: 'relative',
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {
            marginLeft: 0,
            marginTop: 10,
            paddingLeft: 0,
            paddingRight: 10,
        }
    },
    divider: {
        padding: '5px 0 10px',
        width: 150,
    },
    editVacation: {
        padding: '0',
    },
    followers: {
        height: '100%',
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
    },
    footer: {
        position: 'absolute',
        bottom: 5
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    vacation: {
        padding: '20px 0 32px',
        position: 'relative',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            paddingLeft: 0,
        }
    },
    vacationIcon: {
        position: 'absolute',
        right: -6,
        top: 0,
        zIndex: 1,
        [theme.breakpoints.down('xs')]: {
            right: 5,
            top: 5
        }
    }
}));

export default Vacation