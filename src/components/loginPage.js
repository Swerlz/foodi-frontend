/*eslint-disable eqeqeq*/

import { useState, Fragment } from 'react';
import HeaderAp from './apHeader';
import Cookies from 'js-cookie';
import Axios from 'axios';
import {motion} from 'framer-motion'

const LoginPage = (props) => {
    const [action, setAction] = useState('');
    const [maxDays, setMaxDay] = useState(0);
    const [user, setUser] = useState('');
    const [month, setMonth] = useState(0);
    const [day, setDay] = useState(0);
    const [warning, setWarning] = useState('');

    const Months = [{ month: 'Jan', days: 31 }, { month: 'Feb', days: 28 }, { month: 'Mar', days: 31 }, { month: 'Apr', days: 30 }, { month: 'May', days: 31 }, { month: 'Jun', days: 30 },
    { month: 'Jul', days: 31 }, { month: 'Aug', days: 31 }, { month: 'Sep', days: 30 }, { month: 'Oct', days: 31 }, { month: 'Nov', days: 30 }, { month: 'Dec', days: 31 },];

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    const submitUser = () => {

        console.log('http://localhost:3001/api/get');

        Axios.get('http://localhost:3001/api/get').then((res) => {

            let userExists = false;
            let rString = randomString(8, '0123456789');
            let nameMatch;
            let getUsers = res.data;

            if (getUsers != undefined) {
                nameMatch = getUsers.filter(e => e.USER.toLowerCase() == user.toLowerCase() && e.DAY == day && e.MONTH == month);

                nameMatch.length >= 1 ? userExists = true : console.log('User Exists.')
            }

            if (action == 'Sign Up') {

                if (!userExists) {
                    Axios.post('http://localhost:3001/api/insert', { userName: user, userDay: day, userMonth: month, userID: rString })

                    let userObj = { name: user, u_id: rString };
                    Cookies.set('user', JSON.stringify(userObj), { expires: 3700 });
                    props.checkUser(userObj);
                } else {
                    setWarning('User already exists.');
                    resetAll();
                }

            } else {
                // Log In
                if (userExists) {
                    //User Exists.
                    let userObj = { name: nameMatch[0].USER, u_id: nameMatch[0].U_ID };
                    Cookies.set('user', JSON.stringify(userObj), { expires: 3700 });
                    props.checkUser(userObj);
                } else {
                    setWarning('Incorrect details.');
                    resetAll();
                }
            }
        });
    }

    const resetAll = () => {
        setUser('');setMonth(0);setDay(0);setUser('');
    }

    const goBack = () => {
        setDay(0);setMonth(0);setAction('');
    }

    const loopNumbers = (data) => {
        let nr = data;
        let html = [];

        for (let i = 1; i <= nr; i++) {
            html.push(<div className={`days ${i === day ? "selectedMonth" : ''}`} onClick={() => setDay(i)} key={i}>{i}</div>);
        }

        return html
    }

    const warningShow = (t) => {
        setTimeout(() => {
            setWarning('');
        }, t * 1000)


        return <p>{warning}</p>
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
        <>
            {(action === '') ?
                <motion.div variants={container} initial="hidden" animate="show" className='flex-inline noMargin'>
                    <button className="cssbuttons-io-button btn-save" onClick={() => setAction('Log In')}>Log In
                        <div className="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                        </div>
                    </button>
                    <button className="cssbuttons-io-button btn-save" onClick={() => setAction('Sign Up')}>Sign Up
                        <div className="icon">
                            <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                        </div>
                    </button>
                </motion.div>
                :
                <>
                    <HeaderAp title={action} goBack={goBack} />

                    <motion.div variants={container} initial="hidden" animate="show">
                        <h3>Name</h3>
                        <input type="text" className='input-max mb-15' name="userCreate" value={user} onChange={(e) => { setUser(e.target.value) }} />


                        <h3>Select your Month</h3>
                        <div className='months-container mb-30'>
                            {
                                Months.map((val, i) => {
                                    return <div className={`months ${i + 1 === month ? "selectedMonth" : ''}`} onClick={() => { setDay(0); setMaxDay(val.days); setMonth(i + 1) }} key={i}>{val.month}</div>
                                })
                            }

                        </div>

                        {maxDays ?
                            <div className='mb-30'>
                                <h3>Select your Day</h3>
                                <div className='months-container'>
                                    {
                                        loopNumbers(maxDays)
                                    }
                                </div>
                            </div>
                            : null}

                        {warning != '' ? warningShow(2) : null}

                        <div className='flex-inline'>
                        {day > 0 ?
                            <button className="cssbuttons-io-button btn-save" onClick={submitUser}>{action}
                                <div className="icon">
                                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" fill="currentColor"></path></svg>
                                </div>
                            </button>
                            :
                            null
                        }
                        </div>
                    </motion.div>
                </>
            }
        </>
    )
};

export default LoginPage;
