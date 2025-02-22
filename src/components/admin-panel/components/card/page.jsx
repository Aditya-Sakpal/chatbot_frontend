
import {Link} from 'react-router-dom'

import './index.css'

const page = ({ title, description, link }) => {
    return (
        <>
            <div className='card-container' >
                <Link to={link} className='card-link' >
                    <div className='card-title' >
                        {title}
                    </div>
                    <div className='card-description' >
                        {description}
                    </div>
                </Link>
            </div>
        </>
    )
}

export default page