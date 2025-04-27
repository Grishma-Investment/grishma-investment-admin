import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type Article = {
  _id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
};

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch articles
  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:5000/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Delete article
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`http://localhost:5000/articles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete article');
      setArticles(articles.filter((article) => article._id !== id));
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Articles</h2>

      <Row>
        <Col className="mb-4">
          <Link to="/add/article">
            <Button variant="success">Add Article</Button>
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
              <Card className="shadow-sm rounded-4 border-0 h-100">
                <Card.Img variant="top" src={article.thumbnailUrl} alt={article.title} height={250} className='object-fit-cover' />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{article.title}</Card.Title>
                  <Card.Text className="text-muted mb-3">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </Card.Text>
                  <div className="mt-auto d-flex justify-content-between">
                    <Link to={`/edit/article/${article._id}`}>
                      <Button variant="warning">Edit</Button>
                    </Link>
                    <Button variant="danger" onClick={() => handleDelete(article._id)}>
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Articles;
