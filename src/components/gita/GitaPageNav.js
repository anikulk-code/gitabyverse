import React from 'react';
import { Link } from 'react-router-dom';
import { GITA_HOME, gitaChapterPath, gitaVersePath } from '../../gitaPaths';

export function GitaUpNav({ withTeacherQuery, chapter = null }) {
  return (
    <nav
      className="gita-verse-up-nav"
      aria-label={chapter ? 'Back to home or chapter' : 'Back to home'}
    >
      <Link to={withTeacherQuery(GITA_HOME)} className="gita-nav-button">
        ← Home
      </Link>
      {chapter != null && (
        <Link
          to={withTeacherQuery(gitaChapterPath(chapter))}
          className="gita-nav-button"
        >
          ← Chapter {chapter}
        </Link>
      )}
    </nav>
  );
}

export function GitaBottomNav({
  withTeacherQuery,
  chapter = null,
  prevVerse = null,
  nextVerse = null,
}) {
  const showVerseNav = prevVerse != null || nextVerse != null;

  return (
    <div className="gita-verse-nav">
      <div className="gita-verse-nav-primary">
        <Link to={withTeacherQuery(GITA_HOME)} className="gita-nav-button">
          ← Home
        </Link>
        {chapter != null && (
          <Link
            to={withTeacherQuery(gitaChapterPath(chapter))}
            className="gita-nav-button"
          >
            ← Chapter {chapter}
          </Link>
        )}
      </div>
      {showVerseNav && (
        <div className="gita-verse-nav-verses">
          {prevVerse != null && (
            <Link
              to={withTeacherQuery(gitaVersePath(chapter, prevVerse))}
              className="gita-nav-button gita-nav-button-secondary"
            >
              ← {chapter}.{prevVerse}
            </Link>
          )}
          {nextVerse != null && (
            <Link
              to={withTeacherQuery(gitaVersePath(chapter, nextVerse))}
              className="gita-nav-button gita-nav-button-secondary"
            >
              {chapter}.{nextVerse} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
