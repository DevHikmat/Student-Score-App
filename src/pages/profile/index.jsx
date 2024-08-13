import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FindUserStatus } from '../../utils/FindUserStatus';
import "./profile.scss";
import { UserService } from '../../services/user-service';
import { Button, Divider, Form, Input, Modal } from 'antd';
import { openNotification } from '../../utils/Messenger';
import { AuthActions } from '../../store/auth-slice';

let profileUrl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const Profile = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [modalOpen, setModalOpen] = useState(false);
    const dispatch = useDispatch();

    const [form] = Form.useForm();

    if (currentUser.profilePicture) profileUrl = currentUser.profilePicture.url;

    const profileImageUpload = async (e) => {
        let newImage = e.target.files[0];
        if (!newImage) return;
        try {
            const formdata = new FormData();
            formdata.append("profilePicture", newImage);
            if (currentUser.profilePicture?.public_id) {
                formdata.append("public_id", currentUser.profilePicture.public_id);
            }
            const data = await UserService.updUser(currentUser._id, formdata);
            dispatch(AuthActions.changeCurrentUser(data));
        } catch (error) {
            console.log(error);
        }
    }

    const openEditingModal = () => {
        setModalOpen(true);
        form.setFieldsValue({ firstName: currentUser.firstName, lastName: currentUser.lastName });
    }

    const updateInfoHandler = async () => {
        const { firstName, lastName } = form.getFieldsValue();
        if (!firstName || !lastName)
            return openNotification("warning", "Maydon bo'sh", "Iltimos barcha maydonni to'ldiring");
        try {
            const data = await UserService.updUser(currentUser._id, { firstName, lastName });
            dispatch(AuthActions.changeCurrentUser(data));
            setModalOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='profile'>
            <div className="profile-content">
                <div className="profile-left">
                    <div className="profile-picture">
                        <img src={profileUrl} alt="profile avatar" />
                        <input onChange={profileImageUpload} type="file" id="profile-image" />
                        <label htmlFor="profile-image">
                            <i className="fa-solid fa-camera"></i>
                        </label>
                    </div>
                    <div className="profile-info">
                        <h3>
                            {currentUser.firstName} {currentUser.lastName}
                            <button onClick={openEditingModal}><i className="fa-solid fa-pen"></i></button>
                        </h3>
                        <p>Status: <span>{FindUserStatus(currentUser.balls)}</span></p>

                        <Modal
                            title="Shaxsiy ma'lumotlarni o'zgartrish"
                            style={{
                                top: 20,
                            }}
                            footer={false}
                            open={modalOpen}
                            onOk={() => setModalOpen(false)}
                            onCancel={() => setModalOpen(false)}
                        >
                            <Form form={form} layout='vertical'>
                                <Divider></Divider>
                                <Form.Item name="firstName" label="Ism" style={{ marginBottom: "10px" }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="lastName" label="Familya">
                                    <Input />
                                </Form.Item>
                                <Button onClick={() => setModalOpen(false)} style={{ marginRight: "20px" }}>Bekor qilish</Button>
                                <Button onClick={updateInfoHandler} type='primary'>Saqlash</Button>
                            </Form>
                        </Modal>
                    </div>
                </div>
                <div className="profile-right">

                </div>
            </div>
        </div>
    )
}

export default Profile