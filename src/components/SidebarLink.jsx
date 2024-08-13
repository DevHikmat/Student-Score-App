import React, { memo } from 'react'
import { Link } from 'react-router-dom'

const SidebarLink = (props) => {
    const { to, text, active, setActiveIndex, index, icon } = props;
    return (
        <Link to={to} className={active ? "sidebar-link active" : "sidebar-link"} onClick={() => setActiveIndex(index)}>
            <span className="icon">
                <i className={`fa-solid ${icon}`}></i>
            </span>
            {text}
        </Link>
    )
}

export default memo(SidebarLink)