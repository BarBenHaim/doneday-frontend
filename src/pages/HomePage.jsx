// import { Logo } from '../../svgs/TaskSvg'
import { useEffect, useState } from 'react'

import {
  Announcement,
  CheckList,
  Code,
  Invite,
  MoveArrowRight,
  Settings,
  Team,
} from 'monday-ui-react-core/icons'
import { useLocation, useNavigate } from 'react-router'
// Import images

import Image1 from '../assets/img/project/1.png'
import Image2 from '../assets/img/project/2.png'
import Image3 from '../assets/img/project/3.png'
import Image4 from '../assets/img/project/4.png'
import Image6 from '../assets/img/project/6.png'

export function HomePage() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [homePage, setActiveHomePage] = useState(isHomePage)
  const [activeImage, setActiveImage] = useState(Image1)
  const [isImageActive, setIsImageActive] = useState(false)
  const navigate = useNavigate()
  console.log(homePage)

  useEffect(() => {
    const cards = document.querySelectorAll('.card')

    const handleCardClick = (event) => {
      const card = event.currentTarget
      const imageSrc = card.getAttribute('data-image')
      setActiveImage(imageSrc)
      setIsImageActive(true)

      setTimeout(() => {
        setIsImageActive(false)
      }, 300)
    }

    cards.forEach((card) => {
      card.addEventListener('click', handleCardClick)
    })

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('click', handleCardClick)
      })
    }
  }, [])

  function onGetStart() {
    navigate('/board')
  }

  function onLogIn() {
    navigate('/login')
  }

  return (
    <section className="home-page-body">
      <header className="basic-header">
        <div className="logo-header">
          <img
            className="app-logo"
            src="https://res.cloudinary.com/dkykllpf5/image/upload/v1721653904/wzvg1pialo9mpvjavwx1.png"
            alt="logo"
          />
          {/* <Logo /> */}
        </div>
        <div className="login-get-start-btns">
          <button className="login-btn" onClick={onLogIn}>
            Log in
          </button>
          <button className="fixed" onClick={onGetStart}>
            Get started
            <span className="arrow">
              <MoveArrowRight style={{ marginLeft: '8px', size: '14px' }} />
            </span>
          </button>
        </div>
      </header>
      <main className="main-container-page-home">
        <div className="text-content">
          <h1>Your go-to Work platform</h1>
          <p className="txt">
            Streamline workflows and gain clear visibility across teams to make
            strategic decisions with confidence.
          </p>
          <button className="get-start-btn" onClick={onGetStart}>
            Get started
            <span>
              <MoveArrowRight style={{ marginLeft: '8px', marginTop: '2px' }} />
            </span>
          </button>
          <p className="small-txt">
            No credit card needed ✦ Unlimited time on Free plan
          </p>
        </div>
        <div className="card-container">
          <h2 className="cards-title">What would you like to manage?</h2>
          <div className="cards">
            <div className="card" data-image={Image1}>
              <i className="fa-solid fa-bars-progress"></i> Projects
            </div>
            <div className="card" data-image={Image2}>
              <CheckList /> Tasks
            </div>
            <div className="card" data-image={Image3}>
              <Announcement />
              Marketing
            </div>
            <div className="card" data-image={Image4}>
              <i className="fa-regular fa-pen-to-square"></i>
              Design
            </div>
            <div className="card" data-image={Image1}>
              <Invite />
              CRM
            </div>
            <div className="card" data-image={Image2}>
              <Code />
              Product
            </div>
            <div className="card It" data-image={Image3}>
              <i className="fa-solid fa-laptop"></i>
              IT
            </div>
            <div className="card" data-image={Image2}>
              <Settings />
              Operations
            </div>
            <div className="card" data-image={Image4}>
              <Team />
              HR
            </div>
          </div>
        </div>
        <div className="image-container">
          <img
            id="dynamic-image"
            src={activeImage}
            alt="Dynamic Image"
            className={isImageActive ? 'active' : ''}
          />
        </div>
      </main>
      <div>
        <img style={{ marginBottom: '150px' }} src={Image6} alt="Project 6" />
        <h2 className="sponser-title">
          Trusted by 225,000+ customers, from startups to enterprises
        </h2>
        <div className="sponsers-imgs-container">
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/HoltCat.png"
              alt="HoltCat"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/canva.png"
              alt="Canva"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/coca_cola.png"
              alt="Coca Cola"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/oxy.png"
              alt="Oxy"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/lionsgate.png"
              alt="Lionsgate"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/carrefour.png"
              alt="Carrefour"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/bd.png"
              alt="BD"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/glossier.png"
              alt="Glossier"
            />
          </div>
          <div className="img">
            <img
              src="https://dapulse-res.cloudinary.com/image/upload/f_auto,q_auto/remote_mondaycom_static/img/customers/logos-v2/universal.png"
              alt="Universal"
            />
          </div>
        </div>
        <div className="boost-your-team">
          <div className="boost-text">
            <h1>The Work OS that lets you shape workflows, your way</h1>
          </div>
          <div className="boost-text">
            <p>
              Boost your team’s alignment, efficiency, and productivity by
              customizing any workflow to fit your needs.
            </p>
          </div>
        </div>
      </div>

      <section className="foter">
        <h2>Deliver your best work with doneday.com</h2>
        <p>No credit card needed ✦ Unlimited time on Free plan</p>
        <button className="get-start-btn" onClick={onGetStart}>
          Get started
          <span>
            <MoveArrowRight style={{ marginLeft: '8px', marginTop: '2px' }} />
          </span>
        </button>
      </section>
    </section>
  )
}
