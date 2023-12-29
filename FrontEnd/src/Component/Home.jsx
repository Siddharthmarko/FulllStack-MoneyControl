import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Breadcrumb, Modal, Button, Row, Col, Input, message, Card, Statistic, Drawer } from 'antd';
import axios from 'axios';

import AddExpense from './AddExpense';
import Trash from './Trash';
import AddType from './AddType';
import DateFilter from './comp/DateFilter';
import moment from 'moment/moment';
import { Method, Category } from './utils';
import TopCharts from './comp/TopCharts';
import Update from './Update';

/*  ----------- Icons ---------- */
import { TbEdit } from "react-icons/tb";
import { BiTrash } from "react-icons/bi";
import { FaRecycle } from "react-icons/fa";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { MdPayment } from "react-icons/md";
import dayjs from 'dayjs';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { FaChartLine } from "react-icons/fa";


import BASE_URL from './url'
const App = () => {
    const [dateFilter, setDateFilter] = useState({
        "startDate": dayjs().startOf('month').format('YYYY-MM-DD'),
        "endDate": dayjs().endOf('month').format('YYYY-MM-DD')
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [trashData, setTrashData] = useState(false);
    const [typeData, setTypeData] = useState([])
    const [updateOpen, setUpdateOpen] = useState(null);
    const [isDeleteModalOpen, setDeleteIsModalOpen] = useState(false);
    const [calculate, setCalculate] = useState({
        "Profit": 0,
        "Expense": 0
    })
    const [Details, setDetails] = useState([])

    const showDeleteModal = (id) => {
        axios.delete(`${BASE_URL}/expense-data/delete/${id}`)
            .then((response) => {

                fetchData();
                message.success("Deleted")
            }).catch((error) => {
                console.log(error)
                message.error("Network Error")
            })
    };
    const handleDeleteOk = () => setDeleteIsModalOpen(false);
    const handleDeleteCancel = () => setDeleteIsModalOpen(false);

    const showTrash = () => {
        setTrashData(trashData ? false : true)
    }

    const scroll = {};
    if (true) { scroll.y = '65vh' }
    const tableProps = { size: "small", scroll, };

    const showModal = () => setIsModalOpen(true);
    const showModalType = () => setIsTypeOpen(true);
    const showModalPay = () => setIsPayOpen(true);

    const handleOk = () => {
        setIsModalOpen(false);
        setIsPayOpen(false);
        setIsTypeOpen(false);
        setUpdateOpen(null)
    };

    const fetchData = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/expense-data-type`)
            .then((response) => setTypeData(response.data))
            .catch((error) => console.error(error))

        axios.post(`${BASE_URL}/expense-data-filter`, dateFilter)
            .then((response) => {
                const newObj = response.data;
                const updatedObj = newObj[0] ? newObj.map((e, i) => {
                    const obj = { ...e, "no": i + 1 }
                    return obj;
                }) : [];
                setData(updatedObj)
                const ChartLavel = updatedObj ? updatedObj.map(({ amount, category, type }) => {
                    // issue: if category, amount, type is null 
                    const selectedMethod = Category.find(item => item.value === Number(category));
                    // console.log("this is selected method",selectedMethod);
                    var data = {
                        value: Number(amount),
                        color: selectedMethod.type,
                        type: type,
                        category: Number(category),
                        label: selectedMethod.label
                    };

                    return type === 0 ? data : {};
                }) : [];

                const outputArray = ChartLavel[0] ? ChartLavel.reduce((accumulator, currentValue) => {
                    const category = currentValue.category;
                    const value = currentValue.value;
                    const color = currentValue.color;
                    const label = currentValue.label;
                    const index = accumulator.findIndex((element) => element.category === category);

                    if (index === -1) {
                        accumulator.push({ category: category, value: value, color: color, label: label });
                    } else {
                        accumulator[index].value += value;
                    }
                    return accumulator;
                }, []) : []

                const Details = outputArray[0] ? outputArray.map((e, i) => {
                    const data = {
                        ...e, id: i
                    }
                    return data
                }) : []
                setDetails(Details)

                const result = updatedObj.reduce((acc, cur) => {
                    if (cur.type === 1) {
                        acc.profit.push(cur);
                    } else {
                        acc.loss.push(cur);
                    }
                    return acc;
                }, { profit: [], loss: [] });

                const Profit = result.profit.reduce((acc, cur) => acc + parseInt(cur.amount), 0);
                const Expense = result.loss.reduce((acc, cur) => acc + parseInt(cur.amount), 0);

                setCalculate({
                    "Profit": Profit,
                    "Expense": Expense
                })
                setLoading(false)
            })
            .catch((error) => console.error(error))
    }

    const columns = [
        {
            title: '#',
            dataIndex: 'no',
            width: "40px",
            align: "center",
            key: 'no',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: "300px",
            render: (description) => (<Input value={description} bordered={false} />)
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            align: "center",
            width: "100px",
            render: (date) => <>{date ? <span className='text-primary fw-semibold'> {moment(date).format('ll')}</span> : <></>}</>
        },
        {
            title: 'Payment To',
            dataIndex: 'payto',
            key: 'payto',
            width: "100px",
            align: "center",
            ellipsis: true,
            render: (payto) => {
                const selectedMethod = typeData[0] ? typeData.find(item => item.value === payto) : null
                return (<>{selectedMethod && (<>{selectedMethod.label}</>)}</>)
            }
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: "100px",
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
            title: 'Amount ₹',
            dataIndex: 'amount',
            key: 'amount',
            width: "100px",
            align: "center",
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
            title: 'Action',
            width: "50px",
            align: "center",
            render: (e) => (<Row gutter={[8, 8]} justify="space-around">
                <Col>
                    <Button size='small' type='text' shape='circle' onClick={() => setUpdateOpen(e._id)}>
                        <TbEdit className='fs-6' />
                    </Button>
                </Col>
                <Col>
                    <Button size='small' type='text' shape='circle' onClick={() => {
                        console.log(e);
                        showDeleteModal(e._id)
                        }}>
                        <BiTrash className='fs-6' />
                    </Button>
                </Col>
            </Row>)
        },
    ];

    useEffect(() => fetchData(), [dateFilter])
    useEffect(() => { }, [data, isModalOpen, isTypeOpen, isPayOpen])


    return (
        <>
            <Row className='myNavbar px-5 shadow-md' justify="space-between" >
                <Col span={8} className='logoStyle'>
                    Cash
                </Col>
                <Col>
                    <Row justify="end" style={{ paddingTop: "1px" }} gutter={[16, 16]}>
                        <Col className=''>
                            <DateFilter setDateFilter={setDateFilter} />
                        </Col>
                        <Col>
                            <Button onClick={showModal} type="primary" className='fw-semibold' shape='circle' >
                                <MdOutlineAddToPhotos className='fs-5' />
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={showModalType} type="primary" className='fw-semibold' shape='circle' style={{ background: "#ff0054" }}>
                                <MdPayment className="fs-5" />
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={showModalPay} type="primary" className='fw-semibold' shape='circle' style={{ background: "#7b2cbf" }} >
                                <FaChartLine className='fs-5' />
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={showTrash} type="primary" className='fw-semibold' shape='circle' style={{ background: "#ffc300" }}>
                                <FaRecycle className='fs-5' />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div className='p-4 '>
                <Row gutter={[16]}>
                    <Col style={{ width: "200px" }}>
                        <div className='bg-white rounded-1 shadow-sm py-2 px-4 fs-4' style={{ color: "#16db65" }}>
                            <div style={{ color: "gray", fontSize: "14px" }}>
                                Income
                            </div>
                            + {calculate.Profit} ₹
                        </div>
                    </Col>
                    <Col style={{ width: "200px" }}>
                        <div className='bg-white rounded-1 shadow-sm py-2 px-4 fs-4 text-danger'>
                            <div style={{ color: "gray", fontSize: "14px" }}>
                                Expense
                            </div>
                            - {calculate.Expense} ₹
                        </div>
                    </Col>
                    <Col style={{ width: "200px" }}>
                        <div className='bg-white rounded-1 shadow-sm py-2 px-4 fs-4'>
                            <div style={{ color: "gray", fontSize: "14px" }}>
                                Average
                            </div>
                            {calculate.Profit > calculate.Expense ?
                                <span className='text-primary'>
                                    {calculate.Profit - calculate.Expense}
                                </span>
                                :
                                <span className='text-danger'>
                                    -{calculate.Expense - calculate.Profit} <ArrowDownOutlined />
                                </span>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
            <div className='px-4' >
                <Table
                    scroll={scroll}
                    {...tableProps}
                    columns={columns}
                    bordered
                    loading={loading}
                    size='small'
                    dataSource={data}
                    className='shadow-sm bg-white'
                    pagination={{
                        position: ["bottomCenter"],
                    }} />
            </div>
            <Drawer
                title="Add Expense"
                placement={"right"}
                closable={false}
                onClose={handleOk}
                open={isModalOpen}
                key={'add-expense-drawer'}
            >
                <AddExpense handleOk={handleOk} fetchData={fetchData} typeData={typeData} />
            </Drawer>
            <Drawer
                title="Payment To "
                placement={"right"}
                closable={false}
                onClose={handleOk}
                open={isTypeOpen}
                key={'payment-to-drawer'}
            >
                <AddType handleOk={handleOk} fetchData={fetchData} />
            </Drawer>
            <Modal
                title="Expense View"
                open={isPayOpen}
                footer={null}
                onCancel={handleOk}
                width="700px"
            >
                <TopCharts calculate={calculate} Details={Details} />
            </Modal>
            <Modal title="Delete" open={isDeleteModalOpen} onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
                <span className='text-danger fs-6'>
                    Are you sure to delete
                </span>
            </Modal>

            <Drawer
                placement={"bottom"}
                closable={false}
                onClose={showTrash}
                open={trashData}
                key={'bottom'}
            >
                <Trash value={trashData} />
            </Drawer>
            <Modal title="Update Expense" open={updateOpen ? true : false} footer={null} onCancel={handleOk}>
                <Update handleOk={handleOk} fetchData={fetchData} id={updateOpen} />
            </Modal>
        </>
    )
}

export default App;