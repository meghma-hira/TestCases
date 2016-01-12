/**
 * Created by hippo-innovations on 11/1/16.
 */

//todo check that rates are available for pincodes where delivery is available.

//Taking 10 ORDERS from ms.orders
//Retrieving zipcode of shipping_address for each order
//Checking deliveryAvailability for each zipcode
//Displaying rates for each corresponding order

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

    it('Checking ', function (done) {

        var getOrder = {
            entity : "ms.orders",

            query  : {
                start: 0,
                limit: 10
            }

        };
        var limit = 9;

        storehippo.list(getOrder, function(err, response) {
            if (err) throw err;
            //console.log(response);
            var orderList = JSON.parse(response.data);
            //var order = orderList.records[0];
            //console.log(order);

            var getadd = {
                entity: "ms.orders"
            };

            storehippo.call("getAddresses", getadd, function (err, res) {
                if (err) throw err;
                //console.log(res);

                var pickup = JSON.parse(res.data);

                var getmethod = {
                    entity: "ms.fulfillment"
                    //command : "getMethods"
                };

                storehippo.call("getMethods", getmethod, function (err, res) {
                    if (err) throw err;
                    //console.log(res) //response from getMethods
                    var methods = JSON.parse(res.data);
                    //console.log(methods);
                    /*console.log("........................")
                     console.log(methods[0].settings.services[1]);*/

                    forEach(orderList.records, function(item, index){

                        var getrate = {
                            entity: "ms.fulfillment",
                            data: {
                                level: methods[0].shipping_level,
                                method: methods[0].provider,
                                orderDetail: item,
                                pickupAddress: pickup[0]
                            }
                        };

                        var request = {
                            entity : "ms.fulfillment",
                            data: {pincode: item.billing_address.zip}
                        };


                        storehippo.call("checkDeliveryAvailability", request, function(err, response) {
                            if (err) throw err;
                            //console.log(response);
                            //var res = JSON.parse(response.data);


                            assert.equal(200, response.status, "ERROR");

                            assert.equal("both", response.data, "COD SERVICE NOT AVAILABLE");


                            storehippo.call("getRates", getrate, function (err, res) {
                                if (err) throw err;

                                console.log("");
                                console.log("SERVICE AVAILABLE for Pin Code ", item.shipping_address.zip, ": ", response.data);
                                console.log("Order Index: ", index);
                                console.log("RATES")
                                console.log(JSON.parse(res.data));


                                if(index==limit){
                                    done();
                                }

                            });
                        });


                    });
                });
            });

        });

    });

});

