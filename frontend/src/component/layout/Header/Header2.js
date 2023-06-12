import React from 'react'
import { Link } from 'react-router-dom'
import "./Header2.css"

const Header2 = () => {
    return (

        <nav class="navbar">
            <input
                type="checkbox"
                id="input-checkbox"
                class="input-checkbox" />

            <label for="input-checkbox" class="nav-button" >
                <span></span>
            </label>

        </nav>
    )
}

export default Header2
