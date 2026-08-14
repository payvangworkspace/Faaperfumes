import { Link } from 'react-router-dom'

export default function PolicyPage({ eyebrow, title, summary, updated, sections }) {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container page-hero__content page-hero__content--plain">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{summary}</p>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>{title}</span>
          </nav>
        </div>
      </section>

      <section className="section policy">
        <div className="container policy__inner">
          <p className="policy__updated">Last updated: {updated}</p>
          {sections.map((section) => (
            <article key={section.heading} className="policy__block">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
          <div className="policy__links">
            <Link className="text-link" to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="text-link" to="/refund-policy">
              Refund Policy
            </Link>
            <Link className="text-link" to="/">
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
