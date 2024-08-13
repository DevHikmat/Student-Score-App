import { SettingOutlined } from '@ant-design/icons';
import { Button, Card, Col } from 'antd';
import React from 'react'
const { Meta } = Card;


const TeacherCard = ({ teacher, handleOpenModal, teacherAvatar }) => {
    const { _id, firstName, lastName, email, profilePicture } = teacher;

    return (
        <Col span={6}>
            <Card hoverable cover={<img height={200} src={teacherAvatar} alt='teacher image' />}>
                <Meta title={`${firstName} ${lastName}`} description={email} />
                <div className="teacher-action">
                    <Button onClick={() => handleOpenModal(teacher)} ghost icon={<SettingOutlined />}></Button>
                </div>
            </Card>
        </Col>
    )
}

export default TeacherCard