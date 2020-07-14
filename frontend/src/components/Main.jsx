import React from 'react'
import { useState, useRef } from 'react'
import axios from 'axios'
import Typed from 'react-typed'
import { useEffect } from 'react'
import FadeInSection from './FadeInSection'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import copy from 'copy-to-clipboard'

const Main = () => {
  const [image, setImage] = useState()
  const [response, setResponse] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [tags, setTags] = useState()
  const [qoutes, setQoutes] = useState([])
  const [alert, setAlert] = useState(false)
  const [scroll, setScroll] = useState(false)
  const textAreaRef = useRef(null)

  let winHeight = 0

  useEffect(() => {
    winHeight = window.innerHeight
  }, [])

  console.log(
    `https://api.paperquotes.com/apiv1/quotes/?tags=${tags}&order=-likes%limit=10`,
  )

  const showAlert = () => {
    setTimeout(() => {
      setAlert(!alert)
    }, 20000)

    return (
      <div
        style={{
          position: 'fixed',
          bottom: `${winHeight + 40}px`,
          left: '10px',
        }}
        className="alert"
        role="alert"
      >
        Copied to Clipboard!
      </div>
    )
  }

  const getQoutes = () => {
    axios({
      method: 'GET',
      url: `https://api.paperquotes.com/apiv1/quotes/?tags=${tags}&order=-likes%limit=5  `,
      headers: {
        Authorization: 'Token c7465bf9395d41e40bd0fe9a4174bc73def5234b',
      },
    })
      .then((response) => {
        console.log(response.data.results)
        var array = qoutes,
          result = response.data.results.map((o) =>
            Object.keys(o).map((k) => o[k]),
          )

        console.log(result)
        setQoutes(result)
      })
      .catch((resp) => console.log(resp))
  }

  const scrollIndicator = () => {
    setTimeout(() => {
      setScroll(false)
    }, 4000)
    return (
      <div
        className="scroll"
        style={{ bottom: `${winHeight + 42}px`, right: '35px' }}
      >
        <svg
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          class="bi bi-arrow-down-circle-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 5a.5.5 0 0 0-1 0v4.793L5.354 7.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 9.793V5z"
          />
        </svg>
      </div>
    )
  }

  var loadFile = function (event) {
    setUploaded(true)
    setImage(event.target.files[0])
    var reader = new FileReader()
    reader.onload = function () {
      var output = document.getElementById('output')
      output.src = reader.result
    }
    reader.readAsDataURL(event.target.files[0])
  }

  const sendFile = () => {
    let formdata = new FormData()
    console.log(image)
    formdata.append('image', image)
    console.log(formdata)

    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/predict',
      data: formdata,
      headers: { 'Content-Type': 'application/json' },
    })
      .then(function (response) {
        setResponse(response.data.msg)
        setTags(response.data.tags)
        setScroll(true)
        console.log(response)
      })
      .catch(function (response) {
        console.log(response)
      })
  }

  return (
    <>
      <div>
        <center>
          <FadeInSection>
            <div className="text-muted cap font-weight-lighter container">
              CaptionGenerator is tool which allows you to generate caption for
              your next image you gonna throw up on social media.
              <br />
              <p className="text-danger">
                Note: The model is trained on lesser dataset so be ready for
                weird Results!
              </p>
            </div>
          </FadeInSection>
        </center>
        <div className="container mt-5" style={{ textAlign: 'center' }}>
          {uploaded ? (
            <img
              className="card-5 img-fade img-fluid"
              width="300px"
              height="300px"
              id="output"
            />
          ) : (
            <center id="upload">Choose an image to generate caption</center>
          )}
          {uploaded ? (
            <></>
          ) : (
            <div className="input-group mb-3 mt-3">
              <div className="input-group-prepend"></div>
              <div className="custom-file">
                <input
                  onChange={loadFile}
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose Image
                </label>
              </div>
            </div>
          )}
          <br />
          {uploaded ? (
            <button onClick={sendFile} className="mt-3 card-5 btn">
              Generate Caption
            </button>
          ) : (
            <></>
          )}
          <br />
          {response ? (
            <>
              <br />
              <span className="text-success font-weight-light font-italic">
                Prediction:{' '}
                <Typed
                  className="text-success"
                  style={{ fontSize: '2vh' }}
                  strings={[response]}
                  typeSpeed={40}
                />
              </span>
            </>
          ) : (
            <></>
          )}
          <br />
          {response ? (
            qoutes === undefined || qoutes.length === 0 ? (
              <center>
                <div className="spinner-border text-primary mt-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </center>
            ) : (
              qoutes.map((q, index) => {
                return (
                  <>
                    <FadeInSection>
                      <div
                        onClick={(e) => {
                          copy(q[0])
                          setAlert(true)
                        }}
                        class="card card-5 mt-3 mb-2"
                      >
                        <div class="card-header">Quote</div>
                        <div class="card-body">
                          <blockquote class="blockquote mb-0">
                            <p ref={textAreaRef}>{q[0]}</p>
                            <footer class="blockquote-footer">{q[1]}</footer>
                          </blockquote>
                        </div>
                      </div>
                    </FadeInSection>
                  </>
                )
              })
            )
          ) : (
            <></>
          )}
        </div>
        {/* <div
          onClick={() => {
            setAlert(!alert)
          }}
          class="card container  mt-3 mb-2"
        >
          <div class="card-header">Quote</div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p>Ji</p>
              <footer class="blockquote-footer">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
                voluptas iure debitis cupiditate nihil fugit dolores eum ipsum
                voluptates reprehenderit.
              </footer>
            </blockquote>
          </div>
        </div> */}
        {alert ? showAlert() : <></>}
        {scroll ? scrollIndicator() : <></>}
      </div>
      <br />
      <br />
      <footer
        className="footer text-muted"
        style={{ position: uploaded ? 'relative' : 'absolute' }}
      >
        Copyright &copy; {new Date().getFullYear()} Developed by Ubaid Kolad
      </footer>
    </>
  )
}

export default Main
