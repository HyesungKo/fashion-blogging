import { useState } from "react";
import HeaderBar from './components/header';
import Posts from './components/posts';


function App() {

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <div>
      <HeaderBar handleSearch={handleSearch} />
      <Posts searchTerm={searchTerm} />
    </div>
  );
}

export default App;
