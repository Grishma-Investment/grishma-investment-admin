import React from 'react';
import { Container, Row, Col, Form, Button, Card, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsAuthorized }) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredKey = (e.target as HTMLFormElement).securityKey.value;
    const envKey = import.meta.env.VITE_SECURITY_KEY;

    if (enteredKey === envKey) {
      localStorage.setItem('authorized_user', 'true');
      setIsAuthorized(true); // 👈 Update App state
      navigate('/'); // Redirect
    } else {
      alert('Invalid Security Key!');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="p-4 border-0 rounded-4" style={{boxShadow: "1px 1px 2px 1px gray"}}>
            <Card.Body>
              <div className="text-center mb-4">
                <h3 className="fw-bold">Login</h3>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="securityKey" className="mb-4">
                  <Form.Label className="fw-semibold">Security Key</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="fas fa-lock"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      placeholder="Enter your secure key"
                      required
                      className="py-2"
                      name="securityKey"
                    />
                  </InputGroup>
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 py-2 fw-semibold rounded-3">
                  <i className="fas fa-sign-in-alt me-2"></i>Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
