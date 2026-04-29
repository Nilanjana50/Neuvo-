import React, { useState, useEffect } from 'react';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    cat: 'Enterprise',
    title: 'Enterprise Digital Transformation',
    desc: 'Full digital overhaul for a mid-sized enterprise, resulting in 500% growth in 18 months through strategic tech adoption and process automation.',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    result: '500% Growth',
    duration: '18 Months',
    tags: ['Strategy', 'Automation', 'CRM'],
  },
  {
    id: 2,
    cat: 'Startup',
    title: 'Tech Startup Scaling',
    desc: 'Helped a tech startup go from MVP to $10M ARR through product-led growth strategy, digital marketing, and platform optimization.',
    img: 'https://images.unsplash.com/photo-1460925895917-adf4e565db8d?w=600&h=400&fit=crop',
    result: '$10M ARR',
    duration: '12 Months',
    tags: ['Growth', 'Marketing', 'Product'],
  },
  {
    id: 3,
    cat: 'SaaS',
    title: 'SaaS Platform Development',
    desc: 'Built and launched a full SaaS platform from scratch, achieving 10K+ active users within the first 6 months of launch.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    result: '10K+ Users',
    duration: '6 Months',
    tags: ['Development', 'SaaS', 'Launch'],
  },
];

const categories = ['All', 'Enterprise', 'Startup', 'SaaS', 'E-Commerce', 'Marketing'];

const Projects = () => {
  const [projectList, setProjectList] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);

      try {
        const endpoints = [
          '/wp-json/wp/v2/case_study?per_page=12&_embed=1',
          '/wp-json/wp/v2/case-study?per_page=12&_embed=1',
          '/wp-json/wp/v2/posts?per_page=12&_embed=1',
        ];

        let finalData = null;

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint);

            if (!res.ok) {
              console.warn(`API failed: ${endpoint}. Status: ${res.status}`);
              continue;
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
              finalData = data;
              break;
            }
          } catch (apiError) {
            console.warn(`Fetch failed for endpoint: ${endpoint}`, apiError);
          }
        }

        if (finalData) {
          setProjectList(finalData);
        } else {
          setProjectList(FALLBACK_PROJECTS);
        }
      } catch (err) {
        console.warn('Falling back to static case studies:', err);
        setProjectList(FALLBACK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const getTitle = (project) => {
    return project.title?.rendered || project.title || 'Untitled Project';
  };

  const getDescription = (project) => {
    return project.excerpt?.rendered || project.desc || '';
  };

  const getImage = (project) => {
    return (
      project._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
      project._image ||
      project.img ||
      'https://via.placeholder.com/600x400'
    );
  };

  const getCategory = (project) => {
    return project._cat || project.cat || 'Project';
  };

  const filteredProjects =
    activeFilter === 'All'
      ? projectList
      : projectList.filter((project) => getCategory(project) === activeFilter);

  return (
    <>
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #1a472a 100%)',
          padding: '6rem 0',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          }}
        />

        <div className="container-fluid px-5">
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '3rem',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '1rem',
              }}
            >
              Case Studies
            </h1>

            <p
              style={{
                fontSize: '1.2rem',
                color: '#b8b8b8',
                maxWidth: '700px',
                margin: '0 auto 3rem',
              }}
            >
              Real results from real projects — see how strategic consulting transforms businesses
            </p>
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', padding: '3rem 0' }}>
        <div className="container-fluid px-5">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: '2px solid #d4af37',
                  background: activeFilter === cat ? '#d4af37' : 'transparent',
                  color: activeFilter === cat ? '#0d0d0d' : '#d4af37',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#1a1a1a', padding: '5rem 0' }}>
        <div className="container-fluid px-5">
          {loading ? (
            <p style={{ color: '#fff', textAlign: 'center' }}>Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p style={{ color: '#fff', textAlign: 'center' }}>No projects found.</p>
          ) : (
            <div className="row g-4">
              {filteredProjects.map((project) => (
                <div className="col-lg-4 col-md-6" key={project.id}>
                  <div
                    style={{
                      background: 'rgba(42,65,20,0.3)',
                      border: '1px solid rgba(212,175,55,0.2)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.4s',
                    }}
                  >
                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                      <img
                        src={getImage(project)}
                        alt={getTitle(project)}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        padding: '1.5rem',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.4rem 0.8rem',
                          background: 'rgba(212,175,55,0.1)',
                          color: '#d4af37',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          borderRadius: '4px',
                          marginBottom: '1rem',
                          width: 'fit-content',
                        }}
                      >
                        {getCategory(project)}
                      </span>

                      <h3
                        style={{
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.3rem',
                          color: '#fff',
                          marginBottom: '0.75rem',
                        }}
                        dangerouslySetInnerHTML={{ __html: getTitle(project) }}
                      />

                      {project.excerpt?.rendered ? (
                        <div
                          className="wp-excerpt"
                          style={{
                            color: '#b8b8b8',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            flexGrow: 1,
                          }}
                          dangerouslySetInnerHTML={{ __html: getDescription(project) }}
                        />
                      ) : (
                        <p
                          style={{
                            color: '#b8b8b8',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            flexGrow: 1,
                          }}
                        >
                          {getDescription(project)}
                        </p>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: '1.5rem',
                          margin: '1rem 0',
                          padding: '1rem 0',
                          borderTop: '1px solid rgba(212,175,55,0.2)',
                          borderBottom: '1px solid rgba(212,175,55,0.2)',
                        }}
                      >
                        <span style={{ color: '#d4af37', fontWeight: 600, fontSize: '0.85rem' }}>
                          {project._result || project.result || 'View Case Study'}
                        </span>

                        <span style={{ color: '#d4af37', fontWeight: 600, fontSize: '0.85rem' }}>
                          {project._duration || project.duration || 'Ongoing'}
                        </span>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          gap: '0.5rem',
                          flexWrap: 'wrap',
                          marginTop: '1rem',
                        }}
                      >
                        {(project._tags || project.tags || []).map((tag) => (
                          <span
                            key={tag}
                            style={{
                              padding: '0.35rem 0.7rem',
                              background: 'rgba(212,175,55,0.05)',
                              color: '#b8b8b8',
                              fontSize: '0.75rem',
                              border: '1px solid rgba(212,175,55,0.15)',
                              borderRadius: '4px',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Projects;