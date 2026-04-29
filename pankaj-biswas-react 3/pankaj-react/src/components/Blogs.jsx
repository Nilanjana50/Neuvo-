import React, { useState, useEffect } from 'react';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `/wp-json/wp/v2/posts?per_page=${postsPerPage}&_embed=1&orderby=date&order=desc&page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();

        const totalPageCount = response.headers.get('X-WP-TotalPages');

        setPosts(data);
        setTotalPages(Number(totalPageCount) || 1);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section className="blogs-section">
        <div className="container">
          {loading ? (
            <p>Loading blog posts...</p>
          ) : error ? (
            <p>No more blog posts found.</p>
          ) : (
            posts.map((post) => {
              const image =
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                'https://via.placeholder.com/500x300';

              return (
                <div key={post.id} className="blog-card">
                  <img src={image} alt={post.title.rendered} />

                  <h2
                    dangerouslySetInnerHTML={{
                      __html: post.title.rendered,
                    }}
                  />

                  <div
                    dangerouslySetInnerHTML={{
                      __html: post.excerpt.rendered,
                    }}
                  />

                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    Read more
                  </a>
                </div>
              );
            })
          )}

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
    </>
  );
};

export default Blogs;