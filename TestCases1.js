/**
 * Created by hippo-innovations on 11/1/16.
 */

//todo test cases for checkdeliveryavailbility

//PROMPTING PINCODE
//CHECKING PINCODE LENGTH
//CHECKING DELIVERYAVAILABILITY ("both" or "COD not available")

var prompt = require("prompt");
var assert = require('assert');
var forEach = require('async-foreach').forEach;

var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin",
    version: "1.0"
});

describe('checkDeliveryAvailability Test Cases', function () {

    this.timeout(1000000);

    before(function (done) {

        done();
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });


    //using PROMPT
    it('Checking deliveryAvailability when version = 1.0', function (done) {
        prompt.start();

        prompt.get(['pincode'], function (err, result) {

            var request = {
                entity: "ms.fulfillment",
                data: {pincode: result.pincode}
            };

            //console.log(request.data.pincode.length);
            assert.equal(request.data.pincode.length, 6, "PINCODE is INVALID")


            storehippo.call("checkDeliveryAvailability", request, function (err, response) {
                if (err) throw err;
                //console.log(response);
                var res = JSON.parse(response.data);
                console.log("SERVICE AVAILABLE at ", request.data.pincode, "is: ", res.data);

                assert.equal(200, response.status, "ERROR");

                assert.equal("both", res.data, "COD SERVICE NOT AVAILABLE");

                done();

            });
        });

    });


    //WHEN version is not SET
    it.skip('Checking deliveryAvailability when version is not set ', function (done) {
        prompt.start();

        prompt.get(['pincode'], function (err, result) {

            var request = {
                entity: "ms.fulfillment",
                data: {pincode: result.pincode}
            };

            //console.log(request.data.pincode.length);
            assert.equal(request.data.pincode.length, 6, "PINCODE is INVALID")


            storehippo.call("checkDeliveryAvailability", request, function (err, response) {
                if (err) throw err;
                //console.log(response);
                //var res = JSON.parse(response.data);
                console.log("SERVICE AVAILABLE at ", request.data.pincode, "is: ", response.data);

                assert.equal(200, response.status, "ERROR");

                assert.equal("both", response.data, "COD SERVICE NOT AVAILABLE");

                done();

            });
        });

    });
});