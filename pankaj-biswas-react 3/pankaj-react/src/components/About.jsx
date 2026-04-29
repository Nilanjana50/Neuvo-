import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FALLBACK_ABOUT = {
  title: 'About Me',
  subtitle: '12+ Years of Digital Excellence & Strategic Innovation',
  updated: null,
};

const About = () => {
  const [pageData, setPageData] = useState(FALLBACK_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAboutPage = async () => {
      setLoading(true);

      try {
        const res = await fetch('/wp-json/wp/v2/pages?slug=about', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`WordPress API failed: ${res.status}`);
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setPageData({
            title: data[0]?.title?.rendered || FALLBACK_ABOUT.title,
            subtitle: FALLBACK_ABOUT.subtitle,
            updated: data[0]?.modified || null,
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('About API failed. Showing fallback content:', error.message);
          setPageData(FALLBACK_ABOUT);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();

    return () => controller.abort();
  }, []);

  const lastUpdated = pageData.updated
    ? new Date(pageData.updated).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null;

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #1a472a 100%)',
          padding: '6rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container-fluid px-5" style={{ textAlign: 'center' }}>
          {loading && (
            <p style={{ color: '#d4af37' }}>Loading page data...</p>
          )}

          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '3rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '1rem',
            }}
            dangerouslySetInnerHTML={{ __html: pageData.title }}
          />

          <p
            style={{
              fontSize: '1.2rem',
              color: '#b8b8b8',
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            {pageData.subtitle}
          </p>

          {lastUpdated && (
            <p
              style={{
                fontSize: '0.85rem',
                color: '#d4af37',
                marginTop: '1rem',
                opacity: 0.8,
              }}
            >
              Updated: {lastUpdated}
            </p>
          )}
        </div>
      </div>

      <section style={{ background: '#111', padding: '5rem 0' }}>
        <div className="container-fluid px-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <p
                style={{
                  color: '#d4af37',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                Digital Transformation Expert
              </p>

              <h2
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2.6rem',
                  fontWeight: 800,
                  color: '#fff',
                  lineHeight: 1.2,
                  marginBottom: '1.5rem',
                }}
              >
                Turn Your Business Vision Into Digital Reality
              </h2>

              <p
                style={{
                  color: '#b8b8b8',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  marginBottom: '2rem',
                }}
              >
                I help ambitious companies accelerate growth, improve operations,
                and dominate their market through strategic digital innovation and execution.
              </p>

              <Link to="/contact" className="btn btn-gold btn-lg">
                Schedule Strategy Call
              </Link>
            </div>

            <div className="col-lg-6" style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src="/images/pankaj-about-image.jpg"
                alt="Pankaj Biswas"
                style={{
                  width: '420px',
                  maxWidth: '100%',
                  borderRadius: '4px',
                  border: '3px solid rgba(212,175,55,0.3)',
                }}
                onError={(e) => {
                  e.currentTarget.src = '/images/pankaj-biswas-hero-image.jpg';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#1a1a1a', padding: '6rem 0' }}>
        <div className="container-fluid px-5">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                color: '#fff',
                fontWeight: 800,
                fontSize: '2.5rem',
              }}
            >
              Why Clients Choose Me
            </h2>
          </div>

          <div className="row g-4">
            {[
              {
                icon: '🎯',
                title: 'Laser-Focused Results',
                desc: 'Every strategy, every line of code, every marketing campaign is focused on your business goals.',
              },
              {
                icon: '🤝',
                title: 'True Partnership',
                desc: 'I become an extension of your team and stay invested in your long-term success.',
              },
              {
                icon: '💡',
                title: 'Innovation + Strategy',
                desc: 'I combine modern technology with proven business strategy.',
              },
            ].map((item) => (
              <div key={item.title} className="col-lg-4 col-md-6">
                <div
                  style={{
                    background: 'rgba(26,71,42,0.15)',
                    border: '1px solid rgba(212,175,55,0.15)',
                    padding: '2rem',
                    height: '100%',
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                    {item.icon}
                  </div>

                  <h4
                    style={{
                      color: '#fff',
                      fontFamily: 'Playfair Display, serif',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.title}
                  </h4>

                  <p style={{ color: '#b8b8b8', lineHeight: 1.7 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services-offered"
        style={{
          background: 'linear-gradient(180deg, #1a472a 0%, #1a1a1a 100%)',
          padding: '6rem 0',
        }}
      >
        <div className="container-fluid px-5">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2
              style={{
                fontFamily: 'Playfair Display, serif',
                color: '#fff',
                fontWeight: 800,
                fontSize: '2.5rem',
              }}
            >
              How I Help Businesses Grow
            </h2>
          </div>

          <div className="row g-4">
            {[
              'Digital Strategy & Consulting',
              'Software & Web Development',
              'Digital Marketing & Growth',
            ].map((title) => (
              <div key={title} className="col-lg-4">
                <div
                  style={{
                    background: 'rgba(13,13,13,0.6)',
                    border: '1px solid rgba(212,175,55,0.2)',
                    padding: '2.5rem',
                    height: '100%',
                  }}
                >
                  <h4
                    style={{
                      color: '#fff',
                      fontFamily: 'Playfair Display, serif',
                      marginBottom: '1rem',
                    }}
                  >
                    {title}
                  </h4>

                  <p style={{ color: '#b8b8b8', lineHeight: 1.7 }}>
                    Strategic solutions designed to help businesses grow faster.
                  </p>

                  <Link
                    to="/contact"
                    style={{
                      color: '#d4af37',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Contact Me →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-luxury">
        <div className="container-fluid px-5">
          <div className="cta-content">
            <h2>Ready to Transform Your Business?</h2>
            <p>
              Let&apos;s discuss your vision and create a strategic roadmap for growth.
            </p>

            <Link to="/contact" className="btn btn-gold btn-lg">
              Schedule Strategy Call
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;