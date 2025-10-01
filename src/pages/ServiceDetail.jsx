import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
const ServiceDetail = () => {
    const { id } = useParams();
  return (
    <div>{id}</div>
  )
}

export default ServiceDetail