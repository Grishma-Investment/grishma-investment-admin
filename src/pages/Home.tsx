import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Container className="py-4">
      <div className="mx-auto w-100" style={{ maxWidth: '500px', marginTop:'100px' }}>
        <Card className="rounded-4 border-0" style={{boxShadow: "1px 1px 2px 1px gray"}}>
          <Card.Body>
            <Card.Title className="fw-bold mb-3">
              <i className="fas fa-newspaper me-2 text-secondary"></i>
              Manage Articles
            </Card.Title>
            <Card.Text className="text-muted">
              Add, edit, or delete articles that appear on the public website homepage.
            </Card.Text>
            <Link to="/articles">
              <Button variant="primary">
                <i className="fas fa-arrow-right me-2"></i>
                Go to Article Management
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Home;
