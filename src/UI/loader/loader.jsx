import React from 'react'
import "./Loader.scss"

export const Loader = () => {
    return (
        <div className="custom-loader">
            <div className="cssload-loader">

                <div className="cssload-inner cssload-one"></div>
                <div className="cssload-inner cssload-two"></div>
                <div className="cssload-inner cssload-three"></div>
            </div>

            <div className="loading-text">
                <h3>
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </h3>
            </div>
        </div>
    )
}
