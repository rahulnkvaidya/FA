import React, { Component } from 'react'

function App() {
  const shouldPrintBox = false;

  return (
    <div>

      <div className='p-2'>
        <button onClick={() => window.print()}>PRINT</button>
        <p>Click above button opens print preview with these words on page</p>
      </div>

    </div>
  )

}

export default App;