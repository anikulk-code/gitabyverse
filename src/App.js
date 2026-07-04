import React from 'react';
import './App.css';
import GitaRoutes from './components/gita/GitaRoutes';
import {
  CONTACT_EMAIL,
  contactMailto,
  featureRequestMailto,
} from './siteContact';

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

      <footer className="App-footer">
        <section className="App-contact">
          <h2 className="App-contact-title">Contact</h2>
          <p className="App-contact-text">
            Questions, feedback, or ideas for the site? Send an email — we read
            every message.
          </p>
          <div className="App-contact-links">
            <a className="App-contact-link" href={contactMailto()}>
              Email us
            </a>
            <a className="App-contact-link" href={featureRequestMailto()}>
              Suggest a feature
            </a>
          </div>
          <p className="App-contact-email">{CONTACT_EMAIL}</p>
        </section>
      </footer>
    </div>
  );
}

export default App;
