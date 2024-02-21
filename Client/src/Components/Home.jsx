import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { RxDropdownMenu } from "react-icons/rx";
import "../Styles/Home.css"
import GetID from './Hooks/GetId';
import { IoHeartSharp } from "react-icons/io5";
import {  toast,Flip} from 'react-toastify';
import { useCookies } from "react-cookie";
export default function Home() {
  const [Liked,setLiked] = useState([])
  const [Cookies] = useCookies(["token"]);
  const [allproducts,setallProducts] = useState([])
  const [reportstatement,setReportstatement] = useState("")
  const [toggle,setToggle] = useState(0)
  console.log("liked",Liked)
  const [dateandtime,] = useState(new Date());
  const dt = dateandtime.toLocaleString()
  const userID = GetID()
  console.log("allproducts",allproducts)

  useEffect(()=>{
 
      fetchProduct()
      fetchliked()
    

  },[])
  const fetchProduct = async() =>{
    try{
      const response = await axios.get(`http://localhost:5000/Product/getProduct/idforstat/${userID}`,{
        headers :{
          Authorization:`${Cookies.token}`
        }
      })
      setallProducts(response.data.products)
     
    }
 catch(error)
 {
  toast(error.response.data.message,{
    transition: Flip
  })
 }
  }
  const fetchliked = async() =>{
    try{
      const response = await axios.get(`http://localhost:5000/User/Liked/${userID}`,{
        headers:{
          Authorization:`${Cookies.token}`
        }
      })
      fetchProduct()
      setLiked(response.data.likedlist)
    }
    catch(error){
      toast(error.response.data.message,{
        transition: Flip,
        toastId:"only one"
      })
    }

  }
  const checkLike = async(itemid) =>{

    if(Liked.includes(itemid))
    {
      try{
  const response = await axios.put(`http://localhost:5000/User/Liked/delete/${userID}`,{itemid},{
    headers:{
      Authorization:`${Cookies.token}`
    }
  })
  fetchProduct()
  toast.success(response.data.message,{
    transition: Flip
  })
  fetchliked()
}
catch(error)
{
  toast(error.response.data.message,{
    transition: Flip
  })
}
    }
    else{
      
      try{
        console.log("dsbfmdvmvf")
        const response = await axios.put(`http://localhost:5000/User/Liked/add/${userID}`,{itemid},{
          headers:{
            Authorization:`${Cookies.token}`
          }
        })
        toast.success(response.data.message,{
          transition: Flip
        })
        fetchliked()
      }
      catch(error)
      {
        toast(error.response.data.message,{
          transition: Flip
        })
      }
   
    }

 
  }
  const ToggleInput = () =>{
setToggle(1)
  }
  const ToggleCancel = () =>{
    setToggle(0)
  }
  const Reportproceed = async() =>{
    try{
 const response = await axios.post("http://localhost:5000/Report/reports",{userID:userID,reportstatement,dt},{
  headers:{
    Authorization:`${Cookies.token}`
  }
})
 setToggle(0)
 setReportstatement("")
 toast.success(response.data.message,{
  transition: Flip
})
    }
    catch(error){
      toast(error.response.data.message,{
        transition: Flip
      })
    }
  }
  return (
    <>
     <div className="avail-hd">
            <label className='it'>Available  <RxDropdownMenu className='icon-avail' /></label>
            <ul className="avail-ul">
            <li className='avail-li'><Link className='avail-ln' to="/Titan">Titan</Link></li> 
             <li className='avail-li'><Link className='avail-ln' to="/Casio">Casio</Link></li>
             <li className='avail-li'><Link className='avail-ln' to="/Fastrack">Fastrack</Link></li>
             <li className='avail-li'><Link className='avail-ln' to="/Sonata">Sonata</Link></li>
            </ul>
       </div>
    <div className='home-parent'>
     <div className='side-menu'>
      <ul className='side-ul'>
        <li className='side-li'><Link to="/Titan" className='side-lnk'>Titan</Link></li>
        <li className='side-li'><Link to="/Casio" className='side-lnk'>Casio</Link></li>
        <li className='side-li'><Link to="/Fastrack" className='side-lnk'>Fastrack</Link></li>
        <li className='side-li'><Link to="/Sonata" className='side-lnk'>Sonata</Link></li>
      </ul>
      </div> 
{allproducts.map((product)=>(
 
<div key={product._id} className='home-child'>
 <Link className='homelink' to={`/Details/${product._id}`} >
<button onClick={(e)=>{checkLike(product._id);e.preventDefault()}} className='like'>{Liked.includes(product._id) ? <IoHeartSharp className='likeicons'/>:<IoHeartSharp className='likeicon'/>}</button>
{/* <div className="prof-id">{product.loginid}</div> */}
<div className='imgs-container'><img className='imgs' src={product.photourl} /></div>
<div className='pnames'><mark className='pname'>{product.brandname}</mark></div>
<div className='pnam'>{product.productname}</div>
<div className='pprice'>₹ {product.price}</div>
 </Link>
  </div>
 
))}
</div>
<div className='report-parent'>
 
  {toggle === 1 ? 
  <div className='report-child'> 
     <input
     value={reportstatement}
     onChange={(e)=>setReportstatement(e.target.value)}
     className='input-report'
     placeholder='Specify your report... '
     />
     <button className='report-btn-Proceed'  onClick={Reportproceed} >Proceed</button>
  <button className='report-btn-cancel'  onClick={ToggleCancel} >Cancel</button>
  </div>
  :
  <div><button className='report-btn-invoke' onClick={ToggleInput}>Report</button></div>}

</div>
   </>
  )
}
