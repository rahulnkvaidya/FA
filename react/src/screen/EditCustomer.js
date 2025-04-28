import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function EditCustomer() {
  const { id } = useParams();
  console.log(id)
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/customer/${id}`);
        setCustomer(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch customer', error);
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log('submit')
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3005/api/customer/${id}`, customer);
      navigate('/customer'); // Save hone ke baad customers list pe wapas bhej dena
    } catch (error) {
      console.error('Failed to update customer', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Edit Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={customer.name} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="phone" className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" name="phone" value={customer.phone} onChange={handleChange} required />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={customer.email} onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="address" className="mt-3">
          <Form.Label>Address</Form.Label>
          <Form.Control type="text" name="address" value={customer.address} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-4">
          Update Customer
        </Button>
      </Form>
    </div>
  );
}

export default EditCustomer;
