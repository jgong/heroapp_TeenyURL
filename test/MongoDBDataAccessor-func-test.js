var expect  = require('expect.js');
var idgen = require('idgen');
var th = require('./helpers');
var tinyUrl = require('../app/lib/models/tinyurl');

var keyGen = function generate_key(dataObject, callback){
  callback(null, idgen())
};

th.when(process.env.MONGODB_CONN)
.describe("MongoDBDataAccessor.Functional", function () {
    var ORIGINALURL = "http://docs.cloudfoundry.com/services/mongodb/nodejs-mongodb.html" + idgen()

    it("#create and fetch tinyURL", function (done) {
      var mongodb_accessor;
      var dataObject;
      var MongoDBDataAccessor = require('../app/lib/MongoDBDataAccessor').MongoDBDataAccessor;
      mongodb_accessor = new MongoDBDataAccessor();
      var expireAt = new Date(Date.now() + 1000);
      var dataObject =  { originalUrl : ORIGINALURL, expiredAt : expireAt};
      mongodb_accessor.create(dataObject, keyGen, th.asyncExpect(function (err, createResult) {
        expect(err).to.be(null);
        expect(createResult.originalUrl).to.eql(ORIGINALURL);
        expect(createResult).to.have.property('key');
        expect(createResult.key).to.not.be.empty();
        mongodb_accessor.fetch(createResult.key, th.asyncExpect(function (err, fetchResult) {
          expect(err).to.be(null);
          expect(fetchResult).to.have.property('originalUrl');
          expect(fetchResult.originalUrl).to.eql(ORIGINALURL);
          var dataObjectTheSame =  {originalUrl : ORIGINALURL};
          mongodb_accessor.create(dataObject, keyGen, th.asyncExpect(function (err, createResult2) {
            expect(err).to.be(null);
            expect(createResult2.key).to.not.be.empty();
            expect(createResult2.key).to.eql(createResult.key);
            console.log('the deepest test pass, retrieved key=' + createResult.key + '.');
            }, done));
          }, done, true));
        }, done, true));
    });
});