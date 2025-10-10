import React, { useState } from 'react';

function App() {
  const [name, setName] = useState(''); 

  const handleNameChange = (event) => {
    setName(event.target.value); 
  };

  return (
    <div>
      <h1>Hello, {name || '[nama]'}!</h1> 

      <p>Masukkan nama Anda:</p>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Ketik nama di sini"
      />
    </div>
  );
}

export default App;