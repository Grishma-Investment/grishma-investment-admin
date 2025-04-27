import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type Article = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  category: string;
};

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const SERVER_IP = import.meta.env.VITE_SERVER_IP;
  const CLIENT_IP = import.meta.env.VITE_CLIENT_IP;

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${SERVER_IP}/articles`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`${SERVER_IP}/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete article');
      setArticles((prev) => prev.filter((article) => article._id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const truncateTitle = (title: string, maxWords: number) => {
    const words = title.split(' ');
    if (words.length <= maxWords) return title;
    return words.slice(0, maxWords).join(' ') + '...';
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Articles</h2>

      <Row>
        <Col className="mb-4">
          <Link to="/add/article">
            <Button variant="success">
              <i className="fa-solid fa-plus me-2"></i> Add Article
            </Button>
          </Link>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : (
        <Row>
          {articles.map((article) => (
            <Col md={4} key={article._id} className="mb-4">
              <Card className="shadow-sm rounded-4 border-0 h-100 d-flex flex-column">
                <Link
                  to={`${CLIENT_IP}/article/${article._id}`}
                  className="text-decoration-none text-dark flex-grow-1 d-flex flex-column"
                >
                  <Card.Img
                    variant="top"
                    src={article.thumbnailUrl}
                    alt={article.title}
                    height={250}
                    className="object-fit-cover"
                  />
                  <Card.Body className="d-flex flex-column flex-grow-1">
                    <div className="mb-2">
                      <span className="badge bg-primary">{article.category}</span>
                    </div>
                    <Card.Title className="flex-grow-1">
                      {truncateTitle(article.title, 10)} {/* Max 10 words */}
                    </Card.Title>
                    <Card.Text className="text-muted mb-3">
                      <i className="fa-solid fa-calendar-days me-2"></i> {formatDate(article.createdAt)}
                    </Card.Text>
                  </Card.Body>
                </Link>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between mt-auto">
                  <Link to={`/edit/article/${article._id}`}>
                    <Button variant="warning" size="sm">
                      <i className="fa-solid fa-pen-to-square me-1"></i> Edit
                    </Button>
                  </Link>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(article._id)}>
                    <i className="fa-solid fa-trash me-1"></i> Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Articles;
