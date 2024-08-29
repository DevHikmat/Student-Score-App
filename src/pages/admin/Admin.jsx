import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import SidebarLink from '../../components/SidebarLink'
import Student from '../user'
import Group from '../group'
import Quiz from '../quiz'
import Profile from '../profile'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../../store/auth-slice'
import Teachers from '../teacher'
import QuizView from '../quiz-view'

const sidebarItems = [
    { to: "/admin", text: "Quizlar", icon: "fa-layer-group" },
    { to: "/admin/groups", text: "guruhlar", icon: "fa-users-rectangle" },
    { to: "/admin/students", text: "o'quvchilar", icon: "fa-users" },
    { to: "/admin/teachers", text: "Ustozlar", icon: "fa-person-chalkboard" },
    { to: "/admin/profile", text: "Sozlamalar", icon: "fa-gear" },
]
let profileUrl = "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png";

const Admin = () => {
    const currentUser = useSelector(state => state.auth.currentUser);
    const [activeIndex, setActiveIndex] = useState(+localStorage.getItem("activeindex"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        localStorage.setItem("activeindex", activeIndex);
    }, [activeIndex])

    const handleLogout = () => {
        localStorage.removeItem("activeindex")
        localStorage.removeItem("myId")
        localStorage.removeItem("token")
        navigate("/auth");
        dispatch(AuthActions.logout());
    }

    if (currentUser.profilePicture) profileUrl = currentUser.profilePicture.url;


    return (
        <div className="admin">
            <div className="bg-gray-200">
                <div className="sidebar">
                    <div>
                        <Link to="/admin" className="link brand-logo">Webstar Game</Link>
                        <div className="sidebar-links">
                            {sidebarItems.map((item, index) => (
                                <SidebarLink
                                    icon={item.icon}
                                    key={String(Math.random())}
                                    index={index}
                                    setActiveIndex={setActiveIndex}
                                    to={item.to}
                                    text={item.text}
                                    active={index === activeIndex ? "active" : ""}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="logout">
                        <Button onClick={handleLogout} block danger><i className="fa-solid fa-arrow-left"></i> chiqish</Button>
                    </div>
                </div>
                <div className="main">
                    <div className="top-bar">
                        <ul className="menu-items">
                            <li>
                                <Link to="profile" className="action">
                                    <div className="user-info">
                                        <div
                                            className="user-icon"
                                            style={{ background: `url(${profileUrl}) no-repeat center center / cover` }}
                                        ></div>
                                        {currentUser.firstName} {currentUser.lastName}
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="content">
                        <div className="flex flex-wrap">
                            <div className="w-full lg:w-8/12">
                                <div className="p-4">
                                    <div className="bg-white rounded-sm shadow">
                                        <div className="route-wrapper p-4">
                                            <Routes>
                                                <Route path='/' element={<Quiz />} />
                                                <Route path='students' element={<Student />} />
                                                <Route path='groups' element={<Group />} />
                                                <Route path='profile' element={<Profile />} />
                                                <Route path='teachers' element={<Teachers />} />
                                                <Route path='quiz/:id' element={<QuizView />} />
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin