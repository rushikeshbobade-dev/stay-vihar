const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming app.js exports the Express app
const Listing = require('../models/listing');
const Review = require('../models/review');

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        const dbUrl = 'mongodb://127.0.0.1:27017/stayVihar_test';
        await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Listings Routes', () => {
    let listingId;

    test('GET /listings/:id - redirect if listing not found', async () => {
        const res = await request(app).get('/listings/64b7f9f9f9f9f9f9f9f9f9f9');
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/listings');
    });

    test('POST /listings - create new listing', async () => {
        const res = await request(app)
            .post('/listings')
            .send({ listing: { title: 'Test Listing', description: 'Test description' } });
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe('/listings');
        const listing = await Listing.findOne({ title: 'Test Listing' });
        expect(listing).not.toBeNull();
        listingId = listing._id;
    });

    test('GET /listings/:id - show listing', async () => {
        const res = await request(app).get(`/listings/${listingId}`);
        expect(res.status).toBe(200);
        expect(res.text).toContain('Test Listing');
    });
});

describe('Reviews Routes', () => {
    let listingId;
    let reviewId;

    beforeAll(async () => {
        const listing = new Listing({ title: 'Review Test Listing', description: 'Desc' });
        await listing.save();
        listingId = listing._id;
    });

    test('POST /listings/:id/reviews - create review', async () => {
        const res = await request(app)
            .post(`/listings/${listingId}/reviews`)
            .send({ review: { rating: 5, comment: 'Great!' } });
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe(`/listings/${listingId}`);
        const listing = await Listing.findById(listingId).populate('reviews');
        expect(listing.reviews.length).toBe(1);
        reviewId = listing.reviews[0]._id;
    });

    test('DELETE /listings/:id/reviews/:reviewId - delete review', async () => {
        const res = await request(app)
            .delete(`/listings/${listingId}/reviews/${reviewId}`);
        expect(res.status).toBe(302);
        expect(res.headers.location).toBe(`/listings/${listingId}`);
        const listing = await Listing.findById(listingId).populate('reviews');
        expect(listing.reviews.length).toBe(0);
    });
});
