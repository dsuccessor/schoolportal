import React, { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom';

function ProtectedRoute({ children}) {

    const navigate = useNavigate()

    useEffect(() => {

        const isLogin = localStorage.getItem('loginSession')
        if (isLogin) {
         
        }
        else{
            navigate('/login');
        }

      }, [navigate])


  return (
    <>

    <div>
    {children}
    </div>

    </>
  )
}

export default ProtectedRoute