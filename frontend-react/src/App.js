import logo from './logo.svg';
import './App.css';
import Toby from './test-toby';
import Hamzah from './test-hamzah';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from 'react-router-dom';

//         <header className="App-header">
// <div className="App-body">
function App() {
  return (
    <Router>
      <div className="App">
        <ul>
          <li>
            <Link to="/test-toby">Test Toby</Link>
          </li>
          <li>
            <Link to="/test-hamzah">Test Hamzah</Link>
          </li>
        </ul>
        <Routes>
          <Route exact path='/test-toby' element={< Toby />}></Route>
          <Route exact path='/test-hamzah' element={< Hamzah />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
