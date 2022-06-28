import React from 'react';
import {motion} from 'framer-motion';

const HeaderAp = (props) => {

    const goBack = () => {
        props.goBack(true);
    }

    const container = {
        hidden: { opacity: 0, x: -100},
        show: {
          opacity: 1,
          x: 0,
          transition: {
            type: 'spring', damping: 10, stifness: 100, duration: 1
        }
      }
    }

    return (
        <motion.div className='header' variants={container} initial="hidden" animate="show" >
            <button className="cssbuttons-io-button just-arrow" onClick={goBack}>
                <div className="icon">
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                </div>
            </button>
            <h1 className='noMargin noPadding'>{props.title}</h1>
        </motion.div>
    )

}

export default HeaderAp;