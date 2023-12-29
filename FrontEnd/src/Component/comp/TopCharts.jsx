
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

const TopCharts = ({ Details, calculate }) => {

    return (

        <div className='px-2'>
            <PieChart
                label={false}
                series={[
                    {
                        data: Details ? Details : [],
                    },
                ]}
                width={600}
                height={400}
            />
            <div className='fs-6 p-2'>
                Total Expense : ₹ {calculate.Expense}
            </div>
        </div>
    )
}

export default TopCharts