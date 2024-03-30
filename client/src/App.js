import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect, useState   } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar/Navbar';
import AllRoutes from './AllRoutes';
import { fetchAllQuestions } from './actions/question.js';
import { fetchAllUsers } from './actions/user.js';
import { getAllPost } from './actions/posts.js';
import Chatbot from './components/ChatBot/Chatbot.jsx';
import './App.css';

function App() {
  const [isDaytime, setIsDaytime] = useState(0);
  const dispatch = useDispatch()

  const user = useSelector(state=>state.CurrentUserReducer)
  
  useEffect(() => {
    dispatch(fetchAllQuestions())
    dispatch(fetchAllUsers())
    dispatch(getAllPost())
  }, [dispatch ]);
  
  // useEffect(() => {
  //   localStorage.setItem('theme', isDaytime ? '1' : '0'); // Update theme in localStorage
  // }, [isDaytime]);
  
  // const themeChange = () => {
  //   setIsDaytime(prevIsDaytime => !prevIsDaytime);
  //   localStorage.setItem('theme', isDaytime ? '0' : '1');
  // };

  navigator.geolocation.getCurrentPosition(position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchWeather(latitude, longitude);
})

const fetchWeather = (latitude, longitude) => {
    const apikey = process.env.REACT_APP_WEATHER_API_KEY;
    const baseUrl = `http://api.weatherapi.com/v1/current.json?key=${apikey}&lat=${latitude}&long=${longitude}&q=India`
    fetch(baseUrl)
        .then(response => response.json())
        .then(data => setIsDaytime(data?.current.is_day));
}

  return (
    <div className="App" data-theme={
      isDaytime ? "" : "dark"}
    >
      <Router>
        <Navbar isDaytime={isDaytime} />
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          theme="light"
                                                                            />
        <AllRoutes isDaytime={isDaytime}/>
      </Router>
     { user && <Chatbot user={user} isDaytime={isDaytime}/>}
    </div>

  );
}


export default App;
