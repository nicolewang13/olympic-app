import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { updateEvent, fetchEventDetails, retrieveEvents, resetForTesting } from './routes';


describe('routes', function() {

  it('updateEvent', function() {
    // First branch, straight-line code, error case
    const req1 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {content: 'some info'}});
    const res1 = httpMocks.createResponse();
    updateEvent(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'missing "name" parameter');

    // First branch, straight-line code, error case
    const req2 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 913, content: 'more info'}});
    const res2 = httpMocks.createResponse();
    updateEvent(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'missing "name" parameter');

    // Second branch, straight-line code, error case
    const req3 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 'Nicole'}});
    const res3 = httpMocks.createResponse();
    updateEvent(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(), 'missing "value" parameter');

    // Second branch, straight-line code, error case
    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 'Hongzhen'}});
    const res4 = httpMocks.createResponse();
    updateEvent(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(), 'missing "value" parameter');

    // Third branch, straight-line code
    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 'Nicole', content: 'some info'}});
    const res5 = httpMocks.createResponse();
    updateEvent(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: false});

    // Third branch, straight-line code
    const req6 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 'Nicole', content: 'update'}});
    const res6 = httpMocks.createResponse();
    updateEvent(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {saved: true});

    resetForTesting();
  });

  it('fetchEventDetails', function() {
    // First branch, straight-line code, error case
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {}});
    const res1 = httpMocks.createResponse();
    fetchEventDetails(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(), 'missing "name" parameter');

    // First branch, straight-line code, error case
    const req2 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {name: 913}});
    const res2 = httpMocks.createResponse();
    fetchEventDetails(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(), 'missing "name" parameter');

    // Second branch, straight-line code, error case
    const req3 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {name: 'Nicole'}});
    const res3 = httpMocks.createResponse();
    fetchEventDetails(req3, res3);
    assert.deepStrictEqual(res3._getStatusCode(), 404);
    assert.deepStrictEqual(res3._getData(), 'there was no event of this name');

    // Second branch, straight-line code, error case
    const req4 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {name: 'Hongzhen'}});
    const res4 = httpMocks.createResponse();
    fetchEventDetails(req4, res4);
    assert.deepStrictEqual(res4._getStatusCode(), 404);
    assert.deepStrictEqual(res4._getData(), 'there was no event of this name');

    // Third branch, straight-line code
    const load_req1 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: 'Nicole', content: 'needs a job'}});
    const load_res1 = httpMocks.createResponse();
    updateEvent(load_req1, load_res1);

    const req5 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {name: 'Nicole'}});
    const res5 = httpMocks.createResponse();
    fetchEventDetails(req5, res5);
    assert.deepStrictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {name: 'Nicole', content: 'needs a job'});

    // Third branch, straight-line code
    const load_req2 = httpMocks.createRequest({method: 'POST', url: '/api/update', body: {name: '122', content: 'Cynthia and Katharine'}});
    const load_res2 = httpMocks.createResponse();
    updateEvent(load_req2, load_res2);

    const req6 = httpMocks.createRequest({method: 'GET', url: '/api/fetch', query: {name: '122'}});
    const res6 = httpMocks.createResponse();
    fetchEventDetails(req6, res6);
    assert.deepStrictEqual(res6._getStatusCode(), 200);
    assert.deepStrictEqual(res6._getData(), {name: '122', content: 'Cynthia and Katharine'});

    resetForTesting();
  });

  it('retrieveEvents', function() {
    // Straight-line code
    const req1 = httpMocks.createRequest({method: 'GET', url: '/api/names', body: {name: 'Nicole', content: 'Taiwan'}});
    const res1 = httpMocks.createResponse();
    updateEvent(req1, res1);
    retrieveEvents(req1, res1);
    assert.deepStrictEqual(res1._getStatusCode(), 200);
    assert.deepStrictEqual(res1._getData(), {names: ['Nicole'], events: ['Taiwan']});

    // Straight-line code
    const req2 = httpMocks.createRequest({method: 'GET', url: '/api/names', body: {name: 'Hannah', content: 'loves corgis'}});
    const res2 = httpMocks.createResponse();
    updateEvent(req2, res2);
    retrieveEvents(req2, res2);
    assert.deepStrictEqual(res2._getStatusCode(), 200);
    assert.deepStrictEqual(res2._getData(), {names: ['Nicole', 'Hannah'], events: ['Taiwan', 'loves corgis']});

    resetForTesting();
  });

});
