const chai = require('chai');
const expect = chai.expect;
const { axios } = require('../../src/utils/imports');
const MockAdapter = require("axios-mock-adapter");
const { doGet,
  doPost,
  doPut,
  doDelete,
  doHead,
  doPatch,
  performRequest 
} = require('../../src/utils/apiHelper');

const mockHappyPathUrl = 'https://test-url/happy';
const mockBadPathUrl = 'https://test-url/bad';

describe("should perform API requests through apiHelper", () => {
  before(() => {
    var mock = new MockAdapter(axios);
    mock.onGet(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onGet(mockBadPathUrl).reply(404);

    mock.onPost(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onPost(mockBadPathUrl).reply(404);

    mock.onPut(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onPut(mockBadPathUrl).reply(404);

    mock.onDelete(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onDelete(mockBadPathUrl).reply(404);

    mock.onHead(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onHead(mockBadPathUrl).reply(404);

    mock.onPatch(mockHappyPathUrl).reply(200, { content: 'testing data' });
    mock.onPatch(mockBadPathUrl).reply(404);
  })

  it("should perform GET request through doGet method", async () => {
    let response = await doGet(mockHappyPathUrl)
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doGet(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should perform POST request through doPost method", async () => {
    let response = await doPost(mockHappyPathUrl, {})
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doPost(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should perform PUT request through doPut method", async () => {
    let response = await doPut(mockHappyPathUrl, {})
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doPut(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should perform PATCH request through doPatch method", async () => {
    let response = await doPatch(mockHappyPathUrl, {})
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doPatch(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should perform DELETE request through doDelete method", async () => {
    let response = await doDelete(mockHappyPathUrl)
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doDelete(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should perform HEAD request through doHead method", async () => {
    let response = await doHead(mockHappyPathUrl)
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await doHead(mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })
  it("should perform request using accurate parameters through performRequest method", async () => {
    let response = await performRequest("GET", mockHappyPathUrl, {})
    expect(response).to.not.empty
    expect(response).haveOwnProperty('status')
    expect(response).not.haveOwnProperty('error')
    expect(response.status).equal(200)

    response = await performRequest("GET", mockBadPathUrl)
    expect(response).haveOwnProperty('error')
    expect(response.error).haveOwnProperty('status')
    expect(response.error.status).equal(404)
  })

  it("should tag be in response of performRequest if it has a valid responseTag", async () => {
    let response = await performRequest("GET", mockHappyPathUrl, {}, "mockTag")
    expect(response).to.not.empty
    expect(response.status).equal(200)
    expect(response).haveOwnProperty('tag')
    expect(response.tag).equal("mockTag")

    response = await performRequest("GET", mockBadPathUrl, {}, "mockTag")
    expect(response).to.not.empty
    expect(response.error.status).equal(404)
    expect(response).haveOwnProperty('tag')
    expect(response.tag).equal("mockTag")
  })

  it("should not tag be in response of performRequest if it does not have a valid responseTag", async () => {
    let response = await performRequest("GET", mockHappyPathUrl, {})
    expect(response).to.not.empty
    expect(response.status).equal(200)
    expect(response).not.haveOwnProperty('tag')

    response = await performRequest("GET", mockBadPathUrl, {})
    expect(response).to.not.empty
    expect(response.error.status).equal(404)
    expect(response).not.haveOwnProperty('tag')
  })
})