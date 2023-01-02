"use strict"

import { Application } from "@splinetool/runtime"
gsap.registerPlugin(Flip)
// SECTION SELECT ELEMENTS -------------------------------------------------------

const sections = document.querySelectorAll("section")

// nav bar
const nav = document.querySelector(".nav")
const navList = document.querySelector(".nav__list")
const navBtns = document.querySelectorAll(".nav__item")
const modeController = document.querySelector(".mode-controller")

// hero section
const heroBtns = document.querySelectorAll(".hero__btn")
const activeNav = document.querySelector(".active-nav")
const progressBar = document.querySelector(".progress-bar")

// spline
const canvasEmail = document.getElementById("canvasEmail")
const canvasAbout = document.getElementById("canvasAbout")
const canvasHero = document.getElementById("canvasHero")

// work section
const workList = document.querySelector(".work__list")
const workDetail = document.querySelector(".work__detail")

// section--connect
const btnSubmit = document.querySelector(".btn--submit")

let diffXArray
const topFromBrowser = 10
const socialMediaGroup = `
  <div class="social-media-container">
      <ul class="social-media-list">
        <li class="social-media-item">
          <a
            href="https://github.com/Suprefuner"
            class="social-media-link"
            data-link="github"
            target="_blank"
          >
            <i class="fab fa-github"></i>
          </a>
        </li>
        <li class="social-media-item">
          <a
            href="https://www.instagram.com/suprefuner/"
            class="social-media-link"
            data-link="instagram"
            target="_blank"
          >
            <i class="fab fa-instagram"></i>
          </a>
        </li>
        <li class="social-media-item">
          <a
            href="https://www.linkedin.com/in/joe-chan-66b4bb125/"
            class="social-media-link"
            data-link="linkedin"
            target="_blank"
          >
            <i class="fab fa-linkedin"></i>
          </a>
        </li>
      </ul>
  </div>
`

// SECTION GENERAL FUNCTION -------------------------------------------
// LOADING PAGE -------------------------------------------------------
const preventScroll = function (e) {
  e.preventDefault()
  e.stopPropagation()

  return false
}

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader")
  // prevent scrolling by mouse
  loader.addEventListener("wheel", preventScroll, { passive: false })
  // hide scrollbar
  document.body.style.overflowY = "hidden"

  // loading animation disappear 3s later
  setTimeout(() => {
    loader.classList.add("hidden")
  }, 3000)

  // re-activate scrolling and scroll bar
  loader.addEventListener("transitionend", () => {
    loader.remove()
    loader.removeEventListener("wheel", preventScroll, { passive: false })
    document.body.style = ""
  })
})

// control dark light mode >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const toggleMode = function (e) {
  e.currentTarget.classList.toggle("dark")
  document.body.classList.toggle("dark")
}

modeController.addEventListener("click", toggleMode)

// CHECK USER'S DEVICE IS DESKTOP OR MOBILE ---------------------
const checkMediaQuery = () => window.matchMedia("(min-width: 1200px)")
const deviceWidth = checkMediaQuery()

// get all the horizontal position difference between hero buttons and nav buttons
const setNavBtnsPositions = () =>
  [...navBtns].map(
    (btn, i) =>
      heroBtns[i].getBoundingClientRect().x - btn.getBoundingClientRect().x
  )

// if user on desktop
const checkDeviceSize = function (deviceWidth) {
  // remove the existing social media icons firs
  const socialMediaContainer = document.body.querySelector(
    ".social-media-container"
  )
  if (socialMediaContainer) socialMediaContainer.remove()

  if (deviceWidth.matches) {
    diffXArray = setNavBtnsPositions()
    navBtns.forEach((btn, i) => {
      btn.classList.add("hidden")
      heroBtns[i].style.transition = "all 0.2s"
      // move nav buttons to hero buttons' x position (6px = 2side of border width)
      btn.style.transform = `translateX(${diffXArray[i] - 6}px)`
    })

    document.body.insertAdjacentHTML("beforeend", socialMediaGroup)
  } else {
    navList.insertAdjacentHTML("beforeend", socialMediaGroup)
  }
}

checkDeviceSize(deviceWidth)
console.log(diffXArray)

const mediaObserver = new ResizeObserver((entries) => {
  const [entry] = entries
  if (entry.contentRect.width >= 1200 || entry.contentRect.width <= 425) {
    checkDeviceSize(deviceWidth)
  }
})

mediaObserver.observe(document.body)

// SECTION FUNCTIONS FOR MOBILE ----------------------------------
// toggle menu >>>>>>>>>>>>>>>>>>>>>
const showMobileMenu = function () {
  navList.classList.toggle("menu-show")
}

nav.addEventListener("click", (e) => {
  if (e.target.closest("div").classList.contains("burger-menu"))
    showMobileMenu()
})

// scroll progress bar >>>>>>>>>>>>>>>>>>>>>
let lastKnownScrollPosition = 0
let ticking = false

const renderScrollProgress = function (scrollPosition) {
  const height = document.body.scrollHeight - window.innerHeight
  const progress = Math.round((scrollPosition / height) * 100)
  progressBar.style.setProperty("--progress", `${progress}vw`)
}

document.addEventListener(
  "scroll",
  () => {
    lastKnownScrollPosition = scrollY

    if (!ticking) {
      window.requestAnimationFrame(() => {
        renderScrollProgress(lastKnownScrollPosition)
        ticking = false
      })
      ticking = true
    }
  },
  {
    passive: true,
  }
)

if (!deviceWidth.matches) {
  window.addEventListener("scroll", renderScrollProgress)
} else {
  window.removeEventListener("scroll", renderScrollProgress)
}

// SECTION FUNCTIONS FOR DEKSTOP ----------------------------------
// spline animation >>>>>>>>>>>>>>>>>>>>>>>>>>>>
const splineEmail = new Application(canvasEmail)
splineEmail.load("https://prod.spline.design/Om6pYi9BCxhooOps/scene.splinecode")

const splineAbout = new Application(canvasAbout)
splineAbout.load("https://prod.spline.design/7y6lWF7bzX03eNQa/scene.splinecode")

const splineHero = new Application(canvasHero)
splineHero.load("https://prod.spline.design/iTtsvLEs7Lopz2bx/scene.splinecode")

// gsap button activation animation >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// hero buttons and nav buttons animation >>>>>>>>>>>>>>>>>
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
      entry.target.style.transition = `opacity 0s .2s, scale .2s`

      navTarget.classList.add("hidden")
      navTarget.style.transform = `translateX(${diffXArray[index]}px)`
      navTarget.style.transition = `opacity 0s .2s, transform .2s`
    }
  })
}

const btnObserver = new IntersectionObserver(btnObserveFunc, {
  rootMargin: `-${topFromBrowser}px`,
  threshold: 1,
})

const showNavBtns = function () {
  navBtns.forEach((btn) => {
    btn.style = ""
    btn.classList.remove("hidden")
  })
}

heroBtns.forEach((btn) => {
  btnObserver.observe(btn)
  // if resume button clicked download the CV
  if (btn.dataset.link !== "resume") btn.addEventListener("click", showNavBtns)
})

// hero buttons and nav buttons change to active state >>>>>>>>>>>>>
const btnActivate = function (e) {
  navBtns.forEach((btn) => btn.classList.remove("active"))
  // except the last button (resume download link)
  if (+e.currentTarget.dataset.index !== navBtns.length)
    navBtns[e.currentTarget.dataset.index - 1].classList.add("active")
}

heroBtns.forEach((btn, i) => {
  btn.addEventListener("click", btnActivate)
  navBtns[i].addEventListener("click", btnActivate)
})

// nav btns will switch to active when scroll the section >>>>>>>>>>>>>>>>>>>>
const sectionObserveFunc = function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navBtns.forEach((btn) => {
        btn.classList.remove("active")
        if (btn.dataset.link === entry.target.id.replace("section--", "")) {
          btn.classList.add("active")
          activateBtnAnimation(btn)
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

// send email >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// using emailJS
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
      // prettier-ignore
      (work) => `<li class="work__item">${work.projectName}</li>`
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
    <div class="work-container">
      ${workArray[currentWork].image
        .map(
          (img, i) =>
            `
          <div class="image-container--work-image ${
            i === 0 ? "" : "image-desktop desktop"
          }">
            <img src=${img} alt="work image" />
          </div>
        `
        )
        .join("")}
      <div class="work__description">
        ${workArray[currentWork].description}
         <p><a href=${
           workArray[currentWork].url
         } class="work__link" target="_blank">visit site</a></p>
        <div class="tech-group">
          ${workArray[currentWork].technical
            .map(
              (tech) => `
            <span class="tech-tag">${tech}</span>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `
  workDetail.innerHTML = ``
  workDetail.insertAdjacentHTML("beforeend", html)

  const imageArray = workDetail.querySelectorAll("img")

  // check if the image is vertical or horizontal, if vertical add narrow class
  imageArray.forEach((img) => {
    if (img.naturalWidth < img.naturalHeight)
      img.parentElement.classList.add("narrow")
  })
}

// render work detail when first load in
showCurrentWork(workArray)

workList.addEventListener("click", (e) => {
  const workItem = e.target.closest(".work__item")
  if (workItem) showCurrentWork(workArray, e.target)

  // for mobile version show the project details
  if (workItem && !deviceWidth.matches) workDetail.classList.add("active")
})

workDetail.addEventListener("click", (e) => {
  if (!deviceWidth.matches) e.currentTarget.classList.remove("active")
})
