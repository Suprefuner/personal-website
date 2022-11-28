"use strict"

import { Application } from "@splinetool/runtime"
gsap.registerPlugin(Flip)
// SECTION SELECT ELEMENTS -------------------------------------------------------
const nav = document.querySelector(".nav")
const navList = document.querySelector(".nav__list")
const navBtns = document.querySelectorAll(".nav__item")
const heroBtns = document.querySelectorAll(".hero__btn")
const activeNav = document.querySelector(".active-nav")
const progressBar = document.querySelector(".progress-bar")
const sections = document.querySelectorAll("section")
const indicatorLinks = document.querySelectorAll(".indicator__link")
const btnSubmit = document.querySelector(".btn--submit")

const canvasEmail = document.getElementById("canvasEmail")
const canvasAbout = document.getElementById("canvasAbout")
const canvasHero = document.getElementById("canvasHero")

const workList = document.querySelector(".work__list")
const workDetail = document.querySelector(".work__detail .work-container")

const modeController = document.querySelector(".mode-controller")

let diffXArray
const topFromBrowser = 10

// LOADING PAGE -------------------------------------------------------
const preventScroll = function (e) {
  e.preventDefault()
  e.stopPropagation()

  return false
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader")
  loader.addEventListener("wheel", preventScroll, { passive: false })
  document.body.style.overflowY = "hidden"

  setTimeout(() => {
    loader.classList.add("loader-hidden")
  }, 3000)

  loader.addEventListener("transitionend", () => {
    loader.remove()
    loader.removeEventListener("wheel", preventScroll, { passive: false })
    document.body.style = ""
  })
})

// CHECK USER'S DEVICE IS DESKTOP OR MOBILE ---------------------
const checkMediaQuery = function () {
  return window.matchMedia("(min-width: 1200px)")
}

const mql = checkMediaQuery()

// get all the horizontal position difference between hero buttons and nav buttons
const setNavBtnsPositions = function () {
  return [...navBtns].map(
    (btn, i) =>
      heroBtns[i].getBoundingClientRect().x - btn.getBoundingClientRect().x
  )
}

if (mql.matches) {
  diffXArray = setNavBtnsPositions()
  navBtns.forEach((btn) => {
    btn.classList.add("hidden")
    btn.classList.remove("btn")
  })

  // move nav buttons to hero buttons' x position
  navBtns.forEach((btn, i) => {
    btn.style.transform = `translateX(${diffXArray[i]}px)`
  })
}

// SECTION FUNCTIONS FOR MOBILE ----------------------------------
// toggle meun >>>>>>>>>>>>>>>>>>>>>
const showMobileMeun = function () {
  navList.classList.toggle("meun-show")
}

nav.addEventListener("click", (e) => {
  if (e.target.closest("div").classList.contains("burger-meun"))
    showMobileMeun()
})

// scroll progress bar >>>>>>>>>>>>>>>>>>>>>
let lastKnownScrollPostion = 0
let ticking = false

const renderScrollProgress = function (scrollPosition) {
  const height = document.body.scrollHeight - window.innerHeight
  const progress = Math.round((scrollPosition / height) * 100)
  progressBar.style.setProperty("--progress", `${progress}vw`)
}

document.addEventListener(
  "scroll",
  () => {
    lastKnownScrollPostion = scrollY

    if (!ticking) {
      window.requestAnimationFrame(() => {
        renderScrollProgress(lastKnownScrollPostion)
        ticking = false
      })
      ticking = true
    }
  },
  {
    passive: true,
  }
)

if (!mql.matches) {
  window.addEventListener("scroll", renderScrollProgress)
} else {
  window.removeEventListener("scroll", renderScrollProgress)
}

// const renderScrollProgress = function () {
//   const height = document.body.scrollHeight - window.innerHeight
//   const progress = Math.round((scrollY / height) * 100)
//   progressBar.style.setProperty("--progress", `${progress}vw`)
// }

// if (!mql.matches) {
//   window.addEventListener("scroll", renderScrollProgress)
// } else {
//   window.removeEventListener("scroll", renderScrollProgress)
// }

// SECTION FUNCTIONS FOR DEKSTOP ----------------------------------
const activateBtnAnimation = function (btn) {
  const state = Flip.getState(activeNav)
  btn.appendChild(activeNav)
  Flip.from(state, {
    duration: 2,
    absolute: true,
    ease: "elastic.out(1,.8)",
  })
}

navBtns.forEach((btn) => {
  btn.addEventListener("click", () => activateBtnAnimation(btn))
})

// hero buttons and nav buttons animation >>>>>>>>>>
const btnObserveFunc = function (entries) {
  entries.forEach((entry) => {
    const index = entry.target.dataset.index - 1
    const navTarget = navBtns[index]

    if (entry.intersectionRect.top <= topFromBrowser) {
      entry.target.classList.add("hidden")
      entry.target.style.transition = `opacity 0s`
      navTarget.classList.remove("hidden")
      navTarget.style.transition = `transform .2s`
      navTarget.style.transform = `translateX(0)`
    } else {
      entry.target.classList.remove("hidden")

      entry.target.style.transition = `opacity 0s .2s`
      navTarget.classList.add("hidden")
      navTarget.style.transition = `opacity 0s .2s, transform .2s`
      navTarget.style.transform = `translateX(${diffXArray[index]}px)`
    }
  })
}

const btnObserver = new IntersectionObserver(btnObserveFunc, {
  rootMargin: `-${topFromBrowser}px`,
  threshold: 1,
})

const showNavBtns = function () {
  navBtns.forEach((btn) => {
    btn.setAttribute("style", "")
    btn.classList.remove("hidden")
  })
}

heroBtns.forEach((btn) => {
  btnObserver.observe(btn)
  if (btn.dataset.link !== "resume") btn.addEventListener("click", showNavBtns)
})
// hero buttons and nav buttons change to active state >>>>>>>>>>

const btnActivate = function (e) {
  navBtns.forEach((btn) => btn.classList.remove("active"))
  if (+e.currentTarget.dataset.index !== navBtns.length)
    navBtns[e.currentTarget.dataset.index - 1].classList.add("active")
}

heroBtns.forEach((btn, i) => {
  btn.addEventListener("click", btnActivate)
  navBtns[i].addEventListener("click", btnActivate)
})

// page indicator >>>>>>>>>>>>>>>>>>>>>>>>>>>>

const sectionObserveFunc = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      indicatorLinks.forEach((link, i) => {
        link.classList.remove("active")
        navBtns[i].classList.remove("active")
        if (link.getAttribute("href").slice(1) === entry.target.id) {
          link.classList.add("active")
          navBtns[i].classList.add("active")
          activateBtnAnimation(navBtns[i])
        }
      })
    }
  })
}

const sectionObserver = new IntersectionObserver(sectionObserveFunc, {
  root: null,
  threshold: 0.5,
})

sections.forEach((section) => sectionObserver.observe(section))

// send email >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const SendMail = function () {
  const params = {
    from_name: document.querySelector("#name").value,
    email_id: document.querySelector("#email").value,
    message: document.querySelector("#message").value,
  }
  emailjs
    .send("service_umx3hnm", "template_j437mqf", params)
    .then((res) => alert("success"))
}

btnSubmit.addEventListener("click", SendMail)

// spline animation >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const splineEmail = new Application(canvasEmail)
splineEmail.load("https://prod.spline.design/Om6pYi9BCxhooOps/scene.splinecode")

const splineAbout = new Application(canvasAbout)
splineAbout.load("https://prod.spline.design/7y6lWF7bzX03eNQa/scene.splinecode")

const splineHero = new Application(canvasHero)
splineHero.load("https://prod.spline.design/iTtsvLEs7Lopz2bx/scene.splinecode")

// import work data from json file >>>>>>>>>>>>>>>>>>>>>>>>>>>>
let currentWork = 1

const getWorkDate = async function (url) {
  const res = await fetch(url)
  return await res.json()
}

const workArray = await getWorkDate("./data-work.json")

const renderWorkList = function () {
  const workName = workArray
    .map(
      (work) => `
    <li class="work__item">${work.projectName}</li>
  `
    )
    .join("")

  workList.innerHTML = ``
  workList.insertAdjacentHTML("beforeend", workName)
}

renderWorkList()

const showCurrentWork = function (workArray, target = undefined) {
  // get the index of the target project
  currentWork =
    target === undefined
      ? 0
      : workArray.map((work) => work.projectName).indexOf(target.innerHTML)

  const html = `
    ${workArray[currentWork].image
      .map(
        (img, i) =>
          `
        <div class="image-container--work-image ${
          i === 0 ? "image-desktop desktop" : ""
        }">
          <img src=${img} alt="work image" />
        </div>
      `
      )
      .join("")}
    <div class="work__description">
      ${workArray[currentWork].description}
    </div>
  `
  workDetail.innerHTML = ``
  workDetail.insertAdjacentHTML("beforeend", html)

  const imageArray = workDetail.querySelectorAll("img")

  // check if the image is vertical or horizontal
  imageArray.forEach((img) => {
    if (img.naturalWidth < img.naturalHeight)
      img.parentElement.classList.add("narrow")
  })
}

showCurrentWork(workArray)

workList.addEventListener("click", (e) => {
  if (e.target.classList.contains("work__item"))
    showCurrentWork(workArray, e.target)
})

// control dark light mode >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const toggleMode = function (e) {
  e.currentTarget.classList.toggle("dark")
  // console.log(e.currentTarget)
}

modeController.addEventListener("click", toggleMode)
