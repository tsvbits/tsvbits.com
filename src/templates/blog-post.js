import React from 'react';
import { Link } from 'gatsby';
import map from 'lodash/map';
import loadable from '@loadable/component';

import '../fonts/fonts-post.css';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import Panel from '../components/Panel';
import { formatPostDate, formatReadingTime } from '../utils/helpers';
import { rhythm, scale } from '../utils/typography';
import {
  codeToLanguage,
  createLanguageLink,
  loadFontsForCode,
} from '../utils/i18n';

const Reddit = loadable(() => import('../components/Reddit'));

const GITHUB_USERNAME = 'tsvbits';
const GITHUB_REPO_NAME = 'tsvbits.com';
const systemFont = `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
    "Droid Sans", "Helvetica Neue", sans-serif`;

class Translations extends React.Component {
  render() {
    let { translations, lang, languageLink, editUrl } = this.props;

    let readerTranslations = translations.filter((lang) => lang !== 'ru');
    let hasRussianTranslation = translations.indexOf('ru') !== -1;

    return (
      <div className="translations">
        <Panel style={{ fontFamily: systemFont }}>
          {translations.length > 0 && (
            <span>
              {hasRussianTranslation && (
                <span>
                  Originally written in:{' '}
                  {'en' === lang ? (
                    <b>{codeToLanguage('en')}</b>
                  ) : (
                    <Link to={languageLink('en')}>English</Link>
                  )}
                  {' • '}
                  {'ru' === lang ? (
                    <b>Русский (авторский перевод)</b>
                  ) : (
                    <Link to={languageLink('ru')}>
                      Русский (авторский перевод)
                    </Link>
                  )}
                  <br />
                  <br />
                </span>
              )}
              <span>Translated by readers into: </span>
              {readerTranslations.map((l, i) => (
                <React.Fragment key={l}>
                  {l === lang ? (
                    <b>{codeToLanguage(l)}</b>
                  ) : (
                    <Link to={languageLink(l)}>{codeToLanguage(l)}</Link>
                  )}
                  {i === readerTranslations.length - 1 ? '' : ' • '}
                </React.Fragment>
              ))}
            </span>
          )}
          {lang !== 'en' && (
            <>
              <br />
              <br />
              {lang !== 'ru' && (
                <>
                  <Link to={languageLink('en')}>Read the original</Link>
                  {' • '}
                  <a href={editUrl} target="_blank" rel="noopener noreferrer">
                    Improve this translation
                  </a>
                  {' • '}
                </>
              )}
              <Link to={`/${lang}`}>View all translated posts</Link>{' '}
            </>
          )}
        </Panel>
      </div>
    );
  }
}

function discussProps({ enSlug, reddit }) {
  if (reddit) {
    return {
      url: reddit,
      label: 'Discuss on Reddit',
    };
  }
  const q = encodeURIComponent(`https://tsvbits.com${enSlug}`);
  return {
    url: `https://mobile.twitter.com/search?q=${q}`,
    label: 'Discuss on Twitter',
  };
}

const BlogPostTemplate = ({ pageContext }) => {
  let {
    html,
    timeToRead,
    title,
    date,
    spoiler,
    previous,
    next,
    slug,
    translations,
    translatedLinks,
    tags,
    reddit,
    langKey: lang,
  } = pageContext;

  // Replace original links with translated when available.
  translatedLinks.forEach((link) => {
    // jeez
    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    let translatedLink = '/' + lang + link;
    html = html.replace(
      new RegExp('"' + escapeRegExp(link) + '"', 'g'),
      '"' + translatedLink + '"'
    );
  });

  translations = translations.slice();
  translations.sort((a, b) => {
    return codeToLanguage(a) < codeToLanguage(b) ? -1 : 1;
  });

  loadFontsForCode(lang);
  // TODO: this curried function is annoying
  const languageLink = createLanguageLink(slug, lang);
  const enSlug = languageLink('en');
  const editUrl = `https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO_NAME}/edit/dev/src/pages/${enSlug.slice(
    1,
    enSlug.length - 1
  )}/index${lang === 'en' ? '' : '.' + lang}.md`;

  const discuss = discussProps({ enSlug, reddit });

  return (
    <Layout>
      <SEO lang={lang} title={title} description={spoiler} slug={slug} />
      <main>
        <article>
          <header>
            <h1 style={{ color: 'var(--textTitle)' }}>{title}</h1>
            <div className="tags">
              {map(tags, (t, i) => (
                <a key={i} href={`/tags/${t}`}>
                  {t}
                </a>
              ))}
            </div>
            <p
              style={{
                ...scale(-1 / 5),
                display: 'block',
                marginBottom: rhythm(1),
              }}
            >
              {formatPostDate(date, lang)}
              {` • ${formatReadingTime(timeToRead)}`}
            </p>
            {translations.length > 0 && (
              <Translations
                translations={translations}
                editUrl={editUrl}
                languageLink={languageLink}
                lang={lang}
              />
            )}
          </header>
          <div dangerouslySetInnerHTML={{ __html: html }} />
          <footer>
            <Reddit reddit={reddit} />
            <p>
              <a href={discuss.url} target="_blank">
                {discuss.label}
              </a>
              {` • `}
              <a href={editUrl} target="_blank">
                Edit on GitHub
              </a>
            </p>
          </footer>
        </article>
      </main>
      <aside>
        <h3
          style={{
            fontFamily: 'Montserrat, sans-serif',
            marginTop: rhythm(0.25),
          }}
        >
          <Link
            style={{
              boxShadow: 'none',
              textDecoration: 'none',
            }}
            to={'/'}
          >
            tsvbits
          </Link>
        </h3>
        <nav>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              listStyle: 'none',
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link
                  to={previous.fields.slug}
                  rel="prev"
                  style={{ marginRight: 20 }}
                >
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={next.fields.slug} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </Layout>
  );
};

export default BlogPostTemplate;
