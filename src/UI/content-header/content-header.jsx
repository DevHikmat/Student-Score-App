import { PlusOutlined } from '@ant-design/icons'
import { Button, Divider } from 'antd'
import React from 'react'
import { useLocation } from 'react-router-dom'

const ContentHeader = ({ section, openDrawer }) => {
    const { pathname } = useLocation();
    return (
        <>
            {pathname.includes("admin") && <div className="every-content-header d-flex justify-content-between">
                <h3 style={{ textTransform: "uppercase" }}>{section} bo'limi</h3>
                <Button onClick={openDrawer} icon={<PlusOutlined />}>yangi {section} qo'shish</Button>
            </div>}
            <Divider></Divider>
        </>
    )
}

export default ContentHeader