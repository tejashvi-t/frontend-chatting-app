import { Route } from 'react-router-dom';
import './App.css';
import Chatpage from './component/Chatpage';
import Homepage from './component/Homepage';

function App() {
  return (
    <div className="App">
      <Route path='/' component={Homepage} exact />
      <Route path='/chats' component={Chatpage} />
    </div>
  );
}

export default App;
