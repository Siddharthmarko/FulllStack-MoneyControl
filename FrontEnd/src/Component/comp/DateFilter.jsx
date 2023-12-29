import React from "react";
import dayjs from "dayjs";
import { DatePicker, Space } from "antd";

// working with DatePicker 
const { RangePicker } = DatePicker;

const rangePresets = [
    {
        label: 'Last 7 Days',
        value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
        label: 'Last 14 Days',
        value: [dayjs().add(-14, 'd'), dayjs()],
    },
    {
        label: 'Last 30 Days',
        value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
        label: 'Last 90 Days',
        value: [dayjs().add(-90, 'd'), dayjs()],
    },
];

const DateFilter = ({setDateFilter, fetchData}) => {
    const onRangeChange = (dates, dateStrings) => {
        if(dates){
            setDateFilter({
                "startDate": dateStrings[0],
                "endDate": dateStrings[1]
            })
        } else {
            setDateFilter({
                "startDate": dayjs().startOf('month').format('YYYY-MM-DD'),
                "endDate": dayjs().endOf('month').format('YYYY-MM-DD')
            })
        }
    };
    return (
        <RangePicker presents={rangePresets} onChange={onRangeChange} />
    )
};
export default DateFilter;