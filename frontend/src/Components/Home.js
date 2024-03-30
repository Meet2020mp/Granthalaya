import React, { useState,useEffect } from "react";
import Carousel from 'react-bootstrap/Carousel';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import './Home.css';
import axios from "axios";
import Figure from 'react-bootstrap/Figure';
import { Spinner } from 'react-bootstrap';

function Home(){
  const [demographics,setDemographics]= useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibraries = () => {
    try {
      axios.get('https://granthalaya.bsite.net/api/Customers/GetDemographics').then((response) => {
        console.log(response.data)
        setDemographics(response.data);
        setLoading(false);
      });
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }
  useEffect(()=>{
    fetchLibraries();
  },[])
    return(
        <>
<Carousel style={{"height":"500px"}}variant="dark">
      <Carousel.Item>
        <img
        style={{"height":"500px"}}
          className="d-block h-10 w-100"
          src="lib1.jpg"
          alt="First slide"
        />
        <Carousel.Caption>
          <h5 className="heading">Granthalaya</h5>
          <p className="disc">A library is the great gymnasium where we go to make our minds strong. </p>
          <p className="disc">-Swami Vivekananda</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
        style={{"height":"500px"}}
          className="d-block w-100"
          src="lib2.jpg"
          alt="Second slide"
        />
        <Carousel.Caption>
          <h5 className="heading"> Granthalaya</h5>
          <p className="disc">A library is a place vibrating with ideas. </p>
          <p className="disc">- Nancy Lodge</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
        style={{"height":"500px"}}
          className="d-block w-100"
          src="lib4.jpg"
          alt="Third slide"
        />
        <Carousel.Caption>
          <h5 className="heading">Granthalaya</h5>
          <p className="disc">
            I don't have to look far to find treasures. I discover them every time I visit a library. 
          </p>
          <p className="disc"> -Michael Embry</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    {loading ? (<Spinner animation="border" role="status" className="d-flex justify-content-center my-5">
                    <span className="sr-only"></span>
                </Spinner>) :
    <div className="my-5 container text-center">
    <Figure className="px-4">
      
      <Figure.Caption>
        <h1 className="numbers">
        Total libraries: {demographics.libraries}
        </h1>
      </Figure.Caption>
    </Figure>
    
    <Figure className="px-4">
      
      <Figure.Caption>
        <h1 className="numbers">
        Total Books: {demographics.books}
        </h1>
      </Figure.Caption>
    </Figure>
    <Figure className="px-4">
      
      <Figure.Caption>
      <h1 className="numbers">
        Total customers: {demographics.customers}
      </h1>
      </Figure.Caption>
    </Figure>
    </div>}
    </>        
    )
}
export default Home;