import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editor = useRef<JoditEditor>(null);
  const SERVER_IP = import.meta.env.VITE_SERVER_IP;

  const [formData, setFormData] = useState({
    title: '',
    thumbnailUrl: '',
    content: '',
    category: '',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        const data = await response.json();
        setFormData({
          title: data.title,
          thumbnailUrl: data.thumbnailUrl,
          content: data.content,
          category: data.category || '',
        });
      } catch (error: any) {
        setError('Error fetching article: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, SERVER_IP]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (newContent: string) => {
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  const validateForm = (): boolean => {
    const { title, thumbnailUrl, content, category } = formData;
    if (!title || !thumbnailUrl || !content || !category) {
      setError('All fields are required.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`${SERVER_IP}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update article');

      setSuccess(true);
      setTimeout(() => navigate('/articles'), 2000);
    } catch (error: any) {
      setError('Error updating article: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center fw-bold">Edit Article</h2>

      {success && (
        <Alert variant="success" className="text-center">
          Article updated successfully! Redirecting...
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Title */}
        <Form.Group controlId="title" className="mb-3">
          <Form.Label className="fw-bold">Article Title</Form.Label>
          <InputGroup>
            <InputGroup.Text><i className="fas fa-heading"></i></InputGroup.Text>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Thumbnail */}
        <Form.Group controlId="thumbnailUrl" className="mb-3">
          <Form.Label className="fw-bold">Thumbnail URL</Form.Label>
          <InputGroup>
            <InputGroup.Text><i className="fas fa-image"></i></InputGroup.Text>
            <Form.Control
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              placeholder="Enter article thumbnail URL"
              required
            />
          </InputGroup>
        </Form.Group>

        {/* Category */}
        <Form.Group controlId="category" className="mb-3">
          <Form.Label className="fw-bold">Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Stock & Indices">Stock & Indices</option>
            <option value="Management & Skills">Management & Skills</option>
            <option value="Research & Analysis">Research & Analysis</option>
            <option value="Innovation & Technology">Innovation & Technology</option>
            <option value="Trade & Business">Trade & Business</option>
            <option value="Compliance & Regulations">Compliance & Regulations</option>
            <option value="Opinions & Impact">Opinions & Impact</option>
          </Form.Select>
        </Form.Group>

        {/* Content */}
        <Form.Group controlId="content" className="mb-3">
          <Form.Label className="fw-bold">Article Content</Form.Label>
          <div
            style={{
              border: '1px solid #ced4da',
              borderRadius: '0.375rem',
              overflow: 'hidden',
              padding: '10px',
              backgroundColor: '#fafafa',
            }}
          >
            <JoditEditor
              ref={editor}
              value={formData.content}
              onChange={handleEditorChange} // ✅ Fixed: Changed from onBlur
              config={{
                readonly: false,
                placeholder: 'Edit your article content here...',
                height: 500,
              }}
            />
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-3" disabled={submitting}>
          {submitting ? <Spinner animation="border" size="sm" /> : 'Update Article'}
        </Button>
      </Form>
    </Container>
  );
};

export default EditArticle;
