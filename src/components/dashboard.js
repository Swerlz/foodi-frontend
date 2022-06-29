import { useState, useEffect } from 'react';
import Receipe from './apRecipes';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const Dashboard = ({ user, userID }) => {
    const [display, setDisplay] = useState('');
    const [recip, setRecipes] = useState([]);
    const [oner, setOner] = useState([]);
    const [fetchRecipes, setFetchRecipes] = useState(true);

    useEffect(() => {
        if (fetchRecipes) {
            let cookie = Cookies.get('user');
            let user = JSON.parse(cookie);

            Axios.get('https://foodeii.herokuapp.com/api/get/recipes', { params: { uID: user.u_id } }).then((res) => {
                setRecipes(res.data);
                console.log(res.data);
            })

            setFetchRecipes(false);
        }

    }, [display, fetchRecipes])

    const backk = () => {
        setFetchRecipes(!fetchRecipes);
        setDisplay('');
    }

    const fetchRecipe = (val) => {
        Axios.get('https://foodeii.herokuapp.com/api/get/recipes', { params: { recipeID: val } }).then((res) => {
            setOner(res.data);
            setDisplay('show');
        })
    }

    const container = {
        hidden: { opacity: 0, y: -100},
        show: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring', damping: 10, stifness: 100, duration: 1
          }
        }
      }
      
      const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1 , transition: { delay: 0.4, duration: 0.7}}
      }

      const variants = {
        visible: i => ({
          y: 0,
          opacity: 1,
          transition: {
            delay: i * 0.4
          },
        }),
        hidden: { opacity: 0, y: 50 },
      }

    return (
        <>
            {display === '' ?
                <>
                    <motion.h1 variants={container} initial="hidden" animate="show" className='mb-15-o'>Hello, <span className='capitalize'>{user}</span></motion.h1>
                    {!recip.length ? <p>You don't have any recipes, why not add one?</p> : null}
                    <motion.button variants={item} initial="hidden" animate="show" className="cssbuttons-io-button btn-save" onClick={() => setDisplay('add')}> Add Recipe
                        <div className="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                        </div>
                    </motion.button>

                    <div className='recipes-cont'>
                        {recip.map((val, i) => (
                            <motion.div delay="2" initial="hidden" custom={i} animate="visible" variants={variants} className='recipe-box' key={i} data-ar={i} onClick={() => fetchRecipe(val.ID)}>
                                <h2 className="text-center">{val.NAME}</h2>
                                <img src={val.IMAGE} alt="dashboard" />
                                <div className='recipe-glass'></div>
                            </motion.div>
                        ))
                        }
                    </div>
                </>
                :
                <Receipe display={display} backk={backk} userID={userID} recipe={oner} />
            }
        </>
    )


}

export default Dashboard;