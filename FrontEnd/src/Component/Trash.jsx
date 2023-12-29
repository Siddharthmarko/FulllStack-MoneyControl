import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Tag, Input, message } from 'antd';
import axios from 'axios';
import moment from 'moment/moment';
import { BiTrash } from "react-icons/bi";
import { Method, Category } from './utils';
import { BiRevision } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";

import BASE_URL from './url';
const Trash = ({ value }) => {

    const [typeData, setTypeData] = useState([])
    const [trash, setTrash] = useState([])
    const [loading, setLoading] = useState(false)

    const handleRecycle = (e) => {
        axios.delete(`${BASE_URL}/expense-data/recycle/${e._id}`)
            .then((response) => {
                fetchData()
                message.success("Deleted")
            }).catch((error) => {
                console.log(error)
                message.error("Network Error")
            })
    };

    const handleHardDelete = (e) => {
        axios.delete(`${BASE_URL}/expense-data/hard-delete/${e._id}`)
            .then((response) => {
                fetchData()
                message.success("Deleted")
            }).catch((error) => {
                console.log(error)
                message.error("Network Error")
            })
    };


    const fetchData = () => {
        setLoading(true)
        console.log("I am Here")
        axios.get(`${BASE_URL}/expense-data-type`)
            .then((response) => setTypeData(response.data))
            .catch((error) => console.error(error))

        axios.get(`${BASE_URL}/expense-data-trash`)
            .then((response) => {
                const newObj = response.data;
                const updatedObj = newObj[0] ? newObj.map((e, i) => {
                    const obj = { ...e, "no": i + 1 }
                    return obj;
                }) : [];
                setTrash(updatedObj)
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
                console.error(error)
            })
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'no',
            width: "40px",
            key: 'no',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: "auto",
            render: (description) => (<Input value={description} bordered={false} />)
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: "100px",
            render: (date) => <>{date ? <span className='text-primary fw-semibold'> {moment(date).format('ll')}</span> : <></>}</>
        },

        {
            title: 'Payment To',
            dataIndex: 'payto',
            key: 'payto',
            width: "200px",
            align: "center",
            render: (payto) => {
                const selectedMethod = typeData[0] ? typeData.find(item => item.value === Number(payto)) : null
                return (<>{selectedMethod && (<>{selectedMethod.label}</>)}</>)
            }
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: "200px",
            align: "center",
            render: (category) => {
                const selectedMethod = Category.find(item => item.value === Number(category));
                return (<span style={{ "color": selectedMethod.type, fontWeight: "600" }}>
                    <Tag color={selectedMethod.type} bordered={false}> {selectedMethod && (<>{selectedMethod.label}</>)}</Tag>
                </span>)
            }
        },

        {
            title: 'Method',
            dataIndex: 'method',
            key: 'method',
            width: "100px",
            align: "center",
            render: (method) => {
                const selectedMethod = Method.find(item => item.value === Number(method));
                return (<>{selectedMethod && (<>{selectedMethod.label}</>)}</>)
            }
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: "center",
            width: "100px",
            render: (amount, e) => {
                return (
                    <Row justify="center">
                        <Col className=' fw-semibold'>
                            <span style={{ color: e.type === 0 ? "red" : "#16db65", }}>{e.type === 0 ? "-" : "+"} {amount} ₹</span>
                        </Col>
                    </Row >
                )
            }
        },
        {
            title: '',
            width: "80px",
            align: "center",
            render: (id) => (<Row gutter={[8, 8]} justify="space-around">
                <Col>
                    <Button size='small' type='text' shape='circle' onClick={() => handleRecycle(id)}>
                        <BiRevision className='fs-6' />
                    </Button>
                </Col>
                <Col>
                    <Button size='small' type='text' shape='circle' onClick={() => handleHardDelete(id)}>
                        <BiTrash className='fs-6' />
                    </Button>
                </Col>
            </Row>)
        },
    ];

    useEffect(() => fetchData(), [value])

    return (<>
        <Row justify="space-between" >
            <Col className='fw-semibold fs-5'>
                Recycle Bin
            </Col>
            <Col className='px-4'>
                <Button onClick={() => fetchData()} type="primary" shape='circle' size='small' >
                    <MdRefresh className='fs-6 mb-1' />
                </Button>
            </Col>
        </Row>
        <div className='pt-4'>
            <Table
                columns={columns}
                loading={loading}
                size='small'
                dataSource={trash}
            />
        </div>
    </>
    )
};
export default Trash;