import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { initialSetFollows, initialUpdateVacations, updateUserData } from './redux/actions';
import Auth from './pages/authentication/Auth'
import Home from './pages/home/Home';
import Stats from './pages/stats/Stats';
import url from './service'

function App() {
  const dispatch = useDispatch()
  const history = useHistory()
  const userData = useSelector(state => state.userData)

  useEffect(() => {
    const getInitialData = async () => {
      let token = localStorage.getItem('auth-token')
      if (token === null) {
        localStorage.setItem('auth-token', "")
        token = ""
      }
      const tokenRes = await Axios.post(
        `${url}/users/tokenIsValid`,
        null,
        { headers: { "x-auth-token": token } }
      )
      if (tokenRes.data) {
        const userRes = await Axios.get(
          `${url}/users/`,
          { headers: { "x-auth-token": token } }
        )

        dispatch(
          updateUserData({
            token,
            firstName: userRes.data.firstName,
            lastName: userRes.data.lastName,
            id: userRes.data.id,
            role: userRes.data.role,
          })
        )
      }
    }
    getInitialData()
  }, [history, dispatch])

  useEffect(() => {
    const getInitialData = async () => {
      await Axios.post(`${url}/followers/getFollowing`, {
        followerId: userData.id
      }).then(res => {
        dispatch(initialSetFollows(res.data || []))
      }).then(async () => {
        await Axios.get(`${url}/vacations/getVacations`).then(async (res) => {
          dispatch(initialUpdateVacations(res.data))
        })
      })
    }
    getInitialData()
  }, [userData, dispatch])

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Auth} />
          <Route exact path="/stats" component={Stats} />
        </Switch>
      </div>
    </BrowserRouter >
  );
}

export default App;