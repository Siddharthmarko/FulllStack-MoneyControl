import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Button, message, Divider, Space, Tag } from 'antd';
import axios from 'axios';
import BASE_URL from './url'

const AddType = ({ handleOk, fetchData }) => {

    const [formData, setFormData] = useState({ "description": "", })
    const [paymentType, setPaymentType] = useState([])

    const handleOnChnage = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const fetchDataFunction = () => {
        axios.get(`${BASE_URL}/expense-data-type`)
            .then((response) => {
                setPaymentType(response.data)
                console.log(paymentType);
                fetchData()
            })
            .catch(e => message.error("Network Error"))
    }

    const onSubmit = () => {
        console.log(BASE_URL);
        axios.post(`${BASE_URL}/expense-data-type`, formData)
            .then((response) => {
                setFormData({ "description": "", })
                message.success("Type Added")
                fetchData()
                fetchDataFunction()
            })
            .catch(e => message.error("Network Error"))
        console.log("after url");

    }

    useEffect(() => { fetchDataFunction() }, [])

    const handleOnTypeDelete = (value) => {
        axios.delete(`${BASE_URL}/expense-data-type/${value}`)
            .then((response) => {
                message.success("Deleted")
                fetchData()
            })
            .catch(e => message.error("Network Error"))
    }

    useEffect(() => { }, [formData])
    return (<>
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <div style={{ padding: "5px", color: "gray" }}>
                    Payment Type <span className='text-danger'>*</span>
                </div>
                <Input size="large" autoComplete='off' name="description" placeholder="Add Payment Type" value={formData.description} onChange={handleOnChnage} />
            </Col>
            <Col span={24}>
                <Row justify="end" gutter={[8, 8]}>
                    <Col span={24}>
                        <Button type='primary' style={{ width: "100%" }} className='px-4' onClick={() => onSubmit()}>
                            Save
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Button style={{ width: "100%" }} onClick={() => {
                            onClear()
                            handleOk()
                        }}>
                            Cancel
                        </Button>
                    </Col>

                </Row>
            </Col>
        </Row >
        <Divider />
        <Row>
            <Space size={[0, 'small']} wrap>
                {paymentType[0] ?
                    paymentType.map(({ value, label }) => {
                        return (
                            <Tag bordered={false} closable key={value} onClose={() => { handleOnTypeDelete(value) }}>
                                {label}
                            </Tag>
                        )
                    })
                    : null}
            </Space>
        </Row >
    </>
    )
}

export default AddType