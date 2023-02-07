import React, { useRef } from 'react'
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

  const spinner = useRef()
  const btnLoader = useRef()

  const navigate = useNavigate()

  const login = () => {
    setTimeout(() => navigate('/'), 1000)
  }

  const loader = () => {
    return (
      <>
        <div ref={spinner} style={{ zIndex: 2 }} className="d-none">
          <div
            style={{
              width: '10rem',
              height: '10rem',
              position: 'absolute',
              bottom: 335,
              right: 640,
              zIndex: 2,
            }}
            className="d-flex justify-content-center text-success spinner-border opacity-100"
            role="status"
          ></div>
          <span
            style={{
              position: 'absolute',
              bottom: 400,
              right: 665,
            }}
            className="text-bg-success text-white fw-bolder rounded py-1 px-2"
          >
            Processing...
          </span>
        </div>
      </>
    )
  }

  const handleOnChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setLoginUser({ ...loginUser, [name]: value })
  }

  const handleOnSubmit = async (e) => {
    spinner.current.className = 'd-flex'
    btnLoader.current.className = 'spinner-border spinner-border-sm me-4'
    e.preventDefault()
    const { email, password } = loginUser
    if (email === '' || password === '') {
      console.log('Fields cannot be empty')
      toast.error('Fields cannot be empty')
      spinner.current.className = 'd-none'
      btnLoader.current.className = 'd-none'
    } else {
      await axios
        .post('https://kaycad-v2.onrender.com/Login', loginUser)
        .then((res) => {
          console.log(res?.data)
          toast.success(res?.data?.msg)
          const result = JSON.stringify(res.data)
          localStorage.setItem('loginSession', result)
          navigate('/profile')
          login()
        })
        .catch((err) => {
          console.log(err?.response)
          spinner.current.className = 'd-none'
          btnLoader.current.className = 'd-none'
          toast.error(err?.response?.data?.msg)
        })
    }
  }

  return (
    <div className="mybody text-center">
      {loader()}
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
          <button
            className="w-50 btn btn-sm btn-primary mx-2 fw-bolder"
            type="submit"
          >
            <i
              ref={btnLoader}
              class="d-none spinner-border spinner-border-sm me-4"
              role="status"
              aria-hidden="true"
            ></i>
            Sign in
          </button>
          <button
            className="w-50 btn btn-sm btn-danger mx-2 fw-bolder my-2"
            type="reset"
          >
            Clear
          </button>
        </form>
        <p className="mt-5 mb-3 text-muted">&copy; 2022</p>
      </main>
      <ToastContainer />
    </div>
  )
}

export default Login
