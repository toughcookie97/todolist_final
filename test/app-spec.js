const request = require("supertest")
const {
  app
} = require('../src/app')

describe("creat", () => {
  it("status should be 200", (done) => {
    request(app).get('/todo').expect(200).end((err, res) => {
      if (err) throw err
      done()
    })
  })
})

describe("getItem", () => {
  it("status should be 200", (done) => {
    request(app).get('/todo/3').expect(200).end((err, res) => {
      if (err) throw err
      done()
    })
  })

  it("status should be 404", (done) => {
    request(app).get('/todo/8').expect(404).end((err, res) => {
      if (err) throw err
      done()
    })
  })
})

describe("delete", () => {
  it("status should be 200", (done) => {
    request(app).delete('/todo/2').expect(200).end((err, res) => {
      if (err) throw err
      done()
    })
  })

  it("status should be 404", (done) => {
    request(app).delete('/todo/8').expect(404).end((err, res) => {
      if (err) throw err
      done()
    })
  })
})

describe("update", () => {
  it("status should be 404", (done) => {
    request(app).put('/todo/8').expect(404).end((err, res) => {
      if (err) throw err
      done()
    })
  })
})
