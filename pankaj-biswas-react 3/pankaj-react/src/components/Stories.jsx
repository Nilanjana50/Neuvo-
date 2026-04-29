import React, { useState, useEffect } from 'react';

const FALLBACK_STORIES = [
  {
    id: 1,
    title: { rendered: 'The Summit Mindset' },
    excerpt: {
      rendered:
        '<p>Every challenging trek teaches me that sustained effort, strategic planning, and unwavering focus are the only paths to greatness.</p>',
    },
    date: '2024-02-01',
    link: 'https://pankajbiswas.com',
    _image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  },
];

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const postsPerPage = 12;
  const category = 'travel';

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(false);

      try {
        let categoryId = '';

        if (category) {
          const catRes = await fetch(`/wp-json/wp/v2/categories?slug=${category}`);

          if (catRes.ok) {
            const catData = await catRes.json();

            if (catData.length > 0) {
              categoryId = catData[0].id;
            }
          }
        }

        const categoryQuery = categoryId ? `&categories=${categoryId}` : '';

        const response = await fetch(
          `/wp-json/wp/v2/posts?per_page=${postsPerPage}&_embed=1${categoryQuery}&orderby=date&order=desc&page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stories. Status: ${response.status}`);
        }

        const data = await response.json();
        const totalPageCount = response.headers.get('X-WP-TotalPages');

        setStories(data);
        setTotalPages(Number(totalPageCount) || 1);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories(FALLBACK_STORIES);
        setTotalPages(1);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="stories-section">
        <div className="container">
          {loading && <p>Loading stories...</p>}

          {!loading && error && (
            <p>Error loading stories. Displaying fallback content.</p>
          )}

          {!loading &&
            stories.map((story) => {
              const image =
                story._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                story._image ||
                'https://via.placeholder.com/600x400';

              return (
                <div key={story.id} className="story-card">
                  <img src={image} alt={story.title?.rendered || 'Story image'} />

                  <h2
                    dangerouslySetInnerHTML={{
                      __html: story.title?.rendered || '',
                    }}
                  />

                  <div
                    dangerouslySetInnerHTML={{
                      __html: story.excerpt?.rendered || '',
                    }}
                  />

                  <a href={story.link} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </div>
              );
            })}

          {totalPages > 1 && (
            <nav className="pagination-nav">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ‹ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => goToPage(pg)}
                  style={{
                    background: currentPage === pg ? '#d4af37' : 'transparent',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: currentPage === pg ? '#0d0d0d' : '#d4af37',
                    padding: '0.5rem 0.9rem',
                    cursor: 'pointer',
                  }}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
            </nav>
          )}
        </div>
      </section>

      <section className="cta-luxury">
        <div className="container-fluid px-5">
          <div className="cta-content">
            <h2>Ready to Transform Your Digital Future?</h2>
            <p>
              Let’s discuss your vision and create a strategic roadmap for
              unprecedented growth.
            </p>
            <a href="/contact" className="btn btn-gold btn-lg">
              Schedule Free Strategy Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stories;