import React from 'react';
import './App.css';
import GitaRoutes from './components/gita/GitaRoutes';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p className="App-domain">gitabyverse.com</p>
        <h1>Gita by Verse</h1>
        <p>
          Bhagavad Gita lectures mapped verse by verse — Swami Sarvapriyananda
          and other teachers
        </p>
        <a
          className="App-source-link"
          href="https://www.youtube.com/playlist?list=PLDqahtm2vA72IzPW1nuJohTvoTGCJUKGR"
          target="_blank"
          rel="noopener noreferrer"
        >
          Swami Sarvapriyananda — full Gita playlist on YouTube
        </a>
      </header>

      <main className="App-main">
        <GitaRoutes />
      </main>
    </div>
  );
}

export default App;
