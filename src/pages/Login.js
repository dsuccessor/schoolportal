import React from 'react'
import { useState } from 'react'
import './signin.css'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import kcLogo from '../images/kcLogo.png'

function Login() {
  const [loginUser, setLoginUser] = useState({
    email: '',
    password: '',
  })

  const navigate = useNavigate()

  const login = () => {
    setTimeout(() => navigate('/'), 1000)
  }

  const handleOnChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setLoginUser({ ...loginUser, [name]: value })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = loginUser
    if (email === '' || password === '') {
      console.log('Fields cannot be empty')
      toast.error('Fields cannot be empty')
    } else {
      await axios
        .post('http://localhost:3001/Login', loginUser)
        .then((res) => {
          const result = JSON.stringify(res.data)
          localStorage.setItem('loginSession', result)
          console.log(res.data.msg)
          toast.success(res.data.msg)
          navigate('/profile')
          login()
        })
        .catch((err) => {
          console.log(err?.response)
          toast.error(err?.response?.data?.msg)
        })
    }
  }

  return (
    <div className="mybody text-center">
      <main className="form-signin w-100 m-auto">
        <form onSubmit={handleOnSubmit}>
          <img
            className="mb-4 rounded-5"
            src={kcLogo}
            alt=""
            width="70"
            height="70"
          ></img>
          <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

          <div className="form-floating">
            <input
              type="email"
              name="email"
              value={loginUser.email}
              onChange={handleOnChange}
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
            ></input>
            <label>Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              name="password"
              value={loginUser.password}
              onChange={handleOnChange}
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            ></input>
            <label>Password</label>
          </div>
          <button className="w-100 btn btn-lg btn-primary" type="submit">
            Sign in
          </button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </main>
      <ToastContainer />
    </div>
  )
}

export default Login
