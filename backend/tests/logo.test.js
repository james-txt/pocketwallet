const request = require('supertest');
const express = require('express');
const getLogo = require('../src/routes/logo.js');

const app = express();
app.get('/logo', getLogo);

describe('GET /logo', () => {
  it('should return 200 and the image if it exists', async () => {
    const response = await request(app).get('/logo?symbol=eth');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
  });

  it('should return 404 if the image does not exist', async () => {
    const response = await request(app).get('/logo?symbol=nonexistent');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Image not found');
  });
});
