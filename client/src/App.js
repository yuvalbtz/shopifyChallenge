import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/Home'
import OrderItemsPage from './pages/OrderItemsPage'

function App() {
  return (
    <div className="App">
     <Router>
         <Route exact path="/" component={Home} />
         <Route exact path="/:orderNumber" component={OrderItemsPage} />
       </Router>
       
    </div>
  );
}

export default App;
