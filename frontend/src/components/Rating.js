import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as fasFaStar } from '@fortawesome/free-solid-svg-icons'
import { faStar as farFaStar } from '@fortawesome/free-regular-svg-icons'
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core'
library.add(fasFaStar, farFaStar, faStarHalfAlt)

const Rating = ({ value, text, color, caption }) => {
    return (
        <div className='rating'>
            <span>
                {
                    value >= 1
                        ? <FontAwesomeIcon icon={fasFaStar} style={{ color }} />
                        : value >= 0.5
                            ? <FontAwesomeIcon icon={faStarHalfAlt} style={{ color }} />
                            : <FontAwesomeIcon icon={farFaStar} style={{ color }} />
                }
            </span>
            <span>
                {
                    value >= 2
                        ? <FontAwesomeIcon icon={fasFaStar} style={{ color }} />
                        : value >= 1.5
                            ? <FontAwesomeIcon icon={faStarHalfAlt} style={{ color }} />
                            : <FontAwesomeIcon icon={farFaStar} style={{ color }} />
                }
            </span>
            <span>
                {
                    value >= 3
                        ? <FontAwesomeIcon icon={fasFaStar} style={{ color }} />
                        : value >= 2.5
                            ? <FontAwesomeIcon icon={faStarHalfAlt} style={{ color }} />
                            : <FontAwesomeIcon icon={farFaStar} style={{ color }} />
                }
            </span>
            <span>
                {
                    value >= 4
                        ? <FontAwesomeIcon icon={fasFaStar} style={{ color }} />
                        : value >= 3.5
                            ? <FontAwesomeIcon icon={faStarHalfAlt} style={{ color }} />
                            : <FontAwesomeIcon icon={farFaStar} style={{ color }} />
                }
            </span>
            <span>
                {
                    value >= 5
                        ? <FontAwesomeIcon icon={fasFaStar} style={{ color }} />
                        : value >= 4.5
                            ? <FontAwesomeIcon icon={faStarHalfAlt} style={{ color }} />
                            : <FontAwesomeIcon icon={farFaStar} style={{ color }} />
                }
            </span>
            {caption ? <span>{caption}</span> : <span>{text && text}</span>}
        </div>
    )
}

Rating.defaultProps = {
    color: '#ffc107',
}
export default Rating

// #6667ab abi sal
// #ab8866 kerem
// #abab66 limoei
// #ab66ab banafsh
// #66abaa nili

