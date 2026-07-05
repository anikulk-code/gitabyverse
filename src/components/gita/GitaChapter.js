import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  getChapterName,
  getChapterOtherLectures,
  getChapterVerseCount,
  isVerseMapped,
  useGitaData,
} from '../../context/GitaDataContext';
import { useGitaTeacherFilter } from '../../hooks/useGitaTeacherFilter';
import { usePageSeo } from '../../hooks/usePageSeo';
import { chapterPageSeo } from '../../siteSeo';
import { GITA_HOME, gitaVersePath } from '../../gitaPaths';
import {
  formatLectureHeading,
  GitaLectureCard,
} from './GitaLectureList';
import { GitaBottomNav, GitaUpNav } from './GitaPageNav';
import './Gita.css';

function GitaChapterOtherLectures({ chapter, lectures }) {
  const { showAllTeachers } = useGitaTeacherFilter();

  if (!showAllTeachers || !lectures?.length) return null;

  return (
    <section className="gita-lecture-block gita-chapter-other-block">
      <h3 className="gita-section-label">Chapter-level lectures</h3>
      <p className="gita-lecture-note">
        Talks covering Chapter {chapter} as a whole from other teachers in the
        Ramakrishna Order.
      </p>
      <div className="gita-lecture-list">
        {lectures.map((lecture) => (
          <GitaLectureCard
            key={`${lecture.videoId}-${lecture.swami}`}
            lecture={lecture}
            heading={formatLectureHeading(lecture)}
          />
        ))}
      </div>
    </section>
  );
}

function GitaChapter() {
  const { chapter: chapterParam } = useParams();
  const chapter = parseInt(chapterParam, 10);
  const { data, loading, error } = useGitaData();
  const { withTeacherQuery } = useGitaTeacherFilter();
  const verseCount = data ? getChapterVerseCount(data, chapter) : 0;
  const chapterName = data ? getChapterName(data, chapter) : '';

  usePageSeo(
    () => {
      if (
        Number.isNaN(chapter) ||
        chapter < 1 ||
        chapter > 18 ||
        loading ||
        error ||
        !data
      ) {
        return;
      }

      chapterPageSeo(chapter, chapterName, verseCount);
    },
    [chapter, chapterName, verseCount, loading, error, data],
  );

  if (Number.isNaN(chapter) || chapter < 1 || chapter > 18) {
    return <Navigate to={withTeacherQuery(GITA_HOME)} replace />;
  }

  if (loading) {
    return <div className="gita-status">Loading chapter…</div>;
  }

  if (error) {
    return <div className="gita-status gita-status-error">{error}</div>;
  }

  const chapterOtherLectures = getChapterOtherLectures(data, chapter);
  const verses = Array.from({ length: verseCount }, (_, index) => index + 1);

  return (
    <div className="gita-page">
      <GitaUpNav withTeacherQuery={withTeacherQuery} />
      <p className="gita-verse-location">Chapter {chapter}</p>

      <header className="gita-header">
        <p className="gita-kicker">Chapter {chapter}</p>
        <h2 className="gita-title">{chapterName}</h2>
        <p className="gita-subtitle">{verseCount} verses</p>
      </header>

      <div className="gita-verse-grid">
        {verses.map((verse) => {
          const mapped = isVerseMapped(data, chapter, verse);

          if (mapped) {
            return (
              <Link
                key={verse}
                to={withTeacherQuery(gitaVersePath(chapter, verse))}
                className="gita-verse-tile gita-verse-tile-mapped"
              >
                {verse}
              </Link>
            );
          }

          return (
            <span
              key={verse}
              className="gita-verse-tile gita-verse-tile-unmapped"
              title="Coming soon"
            >
              {verse}
            </span>
          );
        })}
      </div>

      <GitaChapterOtherLectures
        chapter={chapter}
        lectures={chapterOtherLectures}
      />

      <GitaBottomNav withTeacherQuery={withTeacherQuery} />
    </div>
  );
}

export default GitaChapter;
