import React, { useState, Fragment } from "react"
import { GetStaticProps } from "next"
import db  from '../firebase.config'
import "tailwindcss/tailwind.css";
import { delBasePath } from "next/dist/next-server/lib/router/router";
import NumberPicker from 'react-widgets/lib/NumberPicker'
import simpleNumberLocalizer from 'react-widgets-simple-number';
simpleNumberLocalizer();

const Main = (props) => {
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);

  const [inSecs, setInSecs] = useState(null);
  const [secs, setSecs] = useState(0)

  const [sSpins, setSSpins] = useState(0)
  const [mSpins, setMSpins] = useState(0)

  const [mSpinsTimes, setMSpinTimes] = useState([])
  const [sSpinsTimes, setsSpinTimes] = useState([])
  
  const [initialHour, setInitialHour] = useState(1)
  const [finalHour, setFinalHour] = useState(1)
  
  const startTimer = () => {
    setTimer(setInterval(() => {
      setTime(prevTime => prevTime + 1)
    },10))
    setInSecs(setInterval(() => {
      setSecs(prevTime => prevTime + 1)
    }, 1000))
  }

  const stopTimer = () => {
    clearInterval(timer)
    clearInterval(inSecs)
    setTimer(null)
    setTime(0)
    setInSecs(null)
    setSecs(0)
    setMSpins(0)
    setSSpins(0)
  }

  const sumSpin = (stateSetter, array, stateArraySetter) => {
    if (timer !== null) {
      stateSetter(spins => spins + 1)
      let newTimes = []
      if (array.length > 0) {
        const sum = array.reduce((a, b) => a + b, 0)
        newTimes = [...array, time - sum] 
      } else {
        newTimes = [time]
      }
      stateArraySetter(newTimes)
    }
  }

  const saveSession = () => {
      if (timer != null) {
        const session = {
          tiempo: time,
          hora_incial: initialHour,
          hora_final: finalHour,
          minutero: {
            n_vueltas: mSpins,
            tiempo_vueltas: mSpinsTimes
          },
          segundero: {
            n_vueltas: sSpins,
            tiempo_vueltas: sSpinsTimes
          }

        }
      db.collection('session').doc(new Date().toLocaleString()).set(session)
      .then(() => {
        console.log('added session')
      })
      .catch((error) => {
        console.log('Error adding in firebase', error)
      })
      stopTimer()
      }
  }
  
  const renderTime = (time) => {
    let minutes = Math.trunc(time/60)
    let seconds = time - minutes*60
    let minutesText = minutes.toString()
    minutesText = (minutesText.length == 1) ? '0' + minutesText : minutesText
    let secondsText = seconds.toString()
    secondsText = (secondsText.length == 1) ? '0' + secondsText : secondsText

    return minutesText + ':' + secondsText
  }

  const renderPicker = (setter) => {
    return Array(12).map((e,i) => (
    <button className='mt-6 px-6 py-1 text-white rounded-md bg-green-400' onClick={() => setter(i+1)}>
      {i+1}
    </button>
    ))
  }
  const picker = (value, setter) => {
    return [1,2,3,4,5,6,7,8,9,10,11,12].map((e) => { 
        return (
          <button key={e} className={ 
            (e != value) ? 'bg-green-400 my-2 mx-1 px-4 py-1 text-white rounded-md' : 
            'bg-blue-500 my-2 mx-1 px-4 py-1 text-white rounded-md'
          } onClick={() => setter(e)}>
            {e}
          </button>)
         }) 
  }
  return (

    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className=' my-6 text-6xl'>O'clock</h1>
      <div className="grid grid-cols-2 gap-6">
      <div  className=' p-6 rounded-xl shadow-md'>
          <h2 className='text-4xl mb-3'>Segundero</h2>
          <h3 className='text-3xl'>{renderTime(secs)}</h3>
          <h3 className='text-3xl'>Vueltas: {sSpins}</h3>
          <button className=' mt-6 px-6 py-1 text-white hover:text-green-400 hover:bg-white rounded-md bg-green-400 ' onClick={() => sumSpin(setSSpins, sSpinsTimes,  setsSpinTimes)}>
            <h3>Vuelta</h3>
          </button>
        </div>	

        <div className=' p-6 rounded-xl shadow-md'>
          <h2 className='text-4xl mb-3'>Minutero</h2>
          <h3 className='text-3xl'>{renderTime(secs)}</h3>
          <h3 className='text-3xl'>Vueltas: {mSpins}</h3>
          <button className='mt-6 px-6 py-1 text-white rounded-md bg-green-400' onClick={() => sumSpin(setMSpins, mSpinsTimes, setMSpinTimes)}>
            <h3>Vuelta</h3>
          </button>
        </div>
        
      </div>	

      <br/>
      <div>
        <h3>Hora inicial: {initialHour}</h3>
        <div>
          {picker(initialHour, setInitialHour)} 
        </div> 
      </div> 
      <div>
        <h3>Hora final: {finalHour}</h3>
        <div>
          {picker(finalHour, setFinalHour)}
        </div>
      </div>
      <br/>
      <button onClick={() => (timer == null) ? startTimer() : stopTimer()} className=' mx-auto mt-6 px-6 py-1 text-white rounded-md bg-blue-500'>
          <h3>{timer == null ? 'Iniciar' : 'Parar'}</h3>
      </button>
      <button className=' mt-6 px-6 py-1 mx-6 text-white rounded-md bg-blue-500' onClick={() => saveSession()}>
          <h3>Guardar sesión</h3>
      </button>
    </div>
  )
}


export default Main
