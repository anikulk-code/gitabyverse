import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  getChapterName,
  getChapterVerseCount,
  useGitaData,
  verseKey,
} from '../../context/GitaDataContext';
import { useGitaTeacherFilter } from '../../hooks/useGitaTeacherFilter';
import { usePageSeo } from '../../hooks/usePageSeo';
import { versePageSeo } from '../../siteSeo';
import { GITA_HOME, gitaChapterPath } from '../../gitaPaths';
import GitaLectureList from './GitaLectureList';
import { GitaBottomNav, GitaUpNav } from './GitaPageNav';
import './Gita.css';

function GitaVerse() {
  const { chapter: chapterParam, verse: verseParam } = useParams();
  const chapter = parseInt(chapterParam, 10);
  const verse = parseInt(verseParam, 10);
  const { data, loading, error } = useGitaData();
  const { withTeacherQuery } = useGitaTeacherFilter();
  const verseCount = data ? getChapterVerseCount(data, chapter) : 0;
  const entry = data?.verseMap?.[verseKey(chapter, verse)];
  const chapterName = data ? getChapterName(data, chapter) : '';

  usePageSeo(
    () => {
      if (
        Number.isNaN(chapter) ||
        Number.isNaN(verse) ||
        chapter < 1 ||
        chapter > 18 ||
        loading ||
        error ||
        !data ||
        verse < 1 ||
        verse > verseCount
      ) {
        return;
      }

      versePageSeo({
        chapter,
        verse,
        chapterName,
        translationText: entry?.translation?.text,
        mapped: Boolean(entry),
      });
    },
    [chapter, verse, chapterName, entry, loading, error, data, verseCount],
  );

  if (
    Number.isNaN(chapter) ||
    Number.isNaN(verse) ||
    chapter < 1 ||
    chapter > 18
  ) {
    return <Navigate to={withTeacherQuery(GITA_HOME)} replace />;
  }

  if (verse < 1 || verse > verseCount) {
    return <Navigate to={withTeacherQuery(gitaChapterPath(chapter))} replace />;
  }

  if (loading) {
    return <div className="gita-status">Loading verse…</div>;
  }

  if (error) {
    return <div className="gita-status gita-status-error">{error}</div>;
  }

  if (!entry) {
    return (
      <div className="gita-page">
        <GitaUpNav chapter={chapter} withTeacherQuery={withTeacherQuery} />
        <div className="gita-coming-soon">
          <h2>{chapter}.{verse}</h2>
          <p>
            Swamiji&apos;s lecture for this verse is not mapped yet. Check back
            as the series continues.
          </p>
          <Link
            to={withTeacherQuery(gitaChapterPath(chapter))}
            className="gita-nav-button"
          >
            ← Chapter {chapter}
          </Link>
        </div>
      </div>
    );
  }

  const {
    slok,
    transliteration,
    translation,
    translationSource,
    lecture,
    otherLectures,
  } = entry;

  return (
    <div className="gita-page">
      <GitaUpNav chapter={chapter} withTeacherQuery={withTeacherQuery} />
      <p className="gita-verse-location">
        Chapter {chapter} · Verse {verse}
      </p>

      <header className="gita-header gita-header-verse">
        <p className="gita-kicker">
          Chapter {chapter} · {chapterName}
        </p>
        <h2 className="gita-title gita-verse-ref">{chapter}.{verse}</h2>
      </header>

      {slok && (
        <section className="gita-verse-block">
          <h3 className="gita-section-label">Sanskrit</h3>
          <p className="gita-slok">{slok}</p>
        </section>
      )}

      {transliteration && (
        <section className="gita-verse-block">
          <h3 className="gita-section-label">Transliteration</h3>
          <p className="gita-transliteration">{transliteration}</p>
        </section>
      )}

      {translation?.text && (
        <section className="gita-verse-block">
          <h3 className="gita-section-label">English</h3>
          {translation.speaker && (
            <p className="gita-speaker">{translation.speaker}</p>
          )}
          <p className="gita-translation">{translation.text}</p>
          {translationSource?.translator && (
            <p className="gita-attribution">
              Translation: {translationSource.translator}
              {translationSource.work ? ` · ${translationSource.work}` : ''}
            </p>
          )}
        </section>
      )}

      <GitaLectureList
        primaryLecture={lecture}
        otherLectures={otherLectures}
      />

      <GitaBottomNav
        withTeacherQuery={withTeacherQuery}
        chapter={chapter}
        prevVerse={verse > 1 ? verse - 1 : null}
        nextVerse={verse < verseCount ? verse + 1 : null}
      />
    </div>
  );
}

export default GitaVerse;
