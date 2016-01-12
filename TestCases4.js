/**
 * Created by hippo-innovations on 11/1/16.
 */

//UPDATING and LISTING from ms.fulfillment_methods

var prompt = require("prompt");
var assert = require('assert');
var forEach = require('async-foreach').forEach;

var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin"
    //version: "1.0"
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

    it('Updating ', function (done) {

        var checking_for_services = ['delhivery', 'fedex', 'aramex'];

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {

                    settings: {
                        services: checking_for_services
                    }

            }
        };

        //console.log("Request Data: ", updateFulfillment.data.records[0].settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;

            console.log(res);
            done();
        });
    });

    it('Listing', function (done) {

        var getFulfillment = {
            entity: "ms.fulfillment_methods"
        };


        storehippo.list(getFulfillment, function (err, response) {
            if (err) throw err;
            var fulfillment_methods = JSON.parse(response.data);
            console.log("Listing ID and SERVICES from ms.fulfillment_methods");
            console.log("ID: ", fulfillment_methods.records[0]);
            console.log("SERVICES", fulfillment_methods.records[0].settings.services);
            done();
        });
    });
});