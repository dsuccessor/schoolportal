import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom"

function PublicRoute({children}) {

    const navigate = useNavigate()

    useEffect(() => {

        const isLogin = localStorage.getItem('loginSession')
        if (isLogin) {
          navigate("/");
        }
      }, [navigate])

    
  return (

    <div>
      {children}
    </div>

  )

}

export default PublicRoute
