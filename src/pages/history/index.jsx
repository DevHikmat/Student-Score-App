import { Divider, Table } from 'antd';
import React from 'react'
import { useSelector } from 'react-redux'

const History = () => {
    const historyList = useSelector(state => state.auth.currentUser.history.map((item, i) => ({ ...item, order: ++i })));
    console.log(historyList)

    const columns = [
        { key: "count", title: "#", dataIndex: "order" },
        { key: "title", title: "O'yin nomi", dataIndex: "title" },
        { key: "countQuiz", title: "O'yindagi savollar", dataIndex: "countQuiz" },
        { key: "correctCount", title: "To'g'ri javoblar", dataIndex: "correctCount" },
        { key: "stars", title: "Yulduz", dataIndex: "userStars" },
    ]
    return (
        <div className='history'>
            <Divider>Tarixlar</Divider>
            <Table pagination={{ pageSize: historyList.length, hideOnSinglePage: true }} dataSource={historyList} columns={columns}></Table>
        </div>
    )
}

export default History