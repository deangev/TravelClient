import React from "react";
import { makeStyles } from "@material-ui/core";
import { DatePicker } from 'antd';
import moment from "moment";

const { RangePicker } = DatePicker;
export default function MaterialUIPickers({ dates, setDates }) {
    const classes = useStyles()

    let formattedDates = dates
    let formattedArray = []
    if (!Array.isArray(formattedDates)) {
        formattedDates = dates?.split(' - ')
        formattedArray.push(moment(formattedDates[0], ['MM/DD/YYYY']))
        formattedArray.push(moment(formattedDates[1], ['MM/DD/YYYY']))
    }
    return (
        <RangePicker
            className={classes.datePicker}
            onChange={(_dates, dateStrings) => setDates(dateStrings)}
            defaultValue={formattedArray}
            format={'MM/DD/YYYY'}
        />
    );
}

const useStyles = makeStyles(() => ({
    datePicker: {
        marginBottom: '5px !important',
        width: '100%',
        height: 40,
        padding: '4px 10px',
        marginTop: 10,
        '& *': {
            margin: '0 !important',
        },
    },
}));