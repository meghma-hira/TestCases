/**
 * Created by hippo-innovations on 11/1/16.
 */

var prompt = require("prompt");
var assert = require('assert');
var forEach = require('async-foreach').forEach;

var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin"
});

describe('ms.fulfillment Test Cases', function () {

    this.timeout(1000000);

    before(function (done) {

        done();
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });

    it('Checking Shippo Level2 services ', function (done) {
        var services=['delhivery', 'aramex', 'fedex'];
        var rates_titles = ['delhivery', 'aramex', 'standard_overnight', 'fedex_express_saver'];
        /*var titles = {
            delhivery: ['delhivery'],
            aramex: ['aramex'],
            fedex: ['standard_overnight', 'fedex_express_saver']
        };*/


        var getOrder = {
            entity: "ms.orders",
            query  : {
                filters: [{field : "order_id", value : "OID258"}]
            }
        };

        storehippo.list(getOrder, function (err, response) {
            if (err) throw err;
            //console.log(response);
            var orderList = JSON.parse(response.data);
            var order = orderList.records[0];
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
                };

                storehippo.call("getMethods", getmethod, function (err, res) {
                    if (err) throw err;

                    var methods = JSON.parse(res.data);

                    console.log("PROVIDER: ", methods[0].provider);
                    console.log("SERVICES available under", methods[0].provider, ":");
                    forEach(methods[0].settings.services, function (item) {

                        console.log(item);

                        assert.notEqual(services.indexOf(item), -1, "ERRORS>>>>");


                        var getrate = {
                            entity: "ms.fulfillment",

                            data: {
                                level: methods[0].shipping_level,
                                method: methods[0].provider,
                                orderDetail: order,
                                pickupAddress: pickup[0]
                            }
                        };


                        //console.log('====================',getrate.data); //working fine till here getrate.data.method = [ 'fedex' ]

                        storehippo.call("getRates", getrate, function (err, res) {
                            if (err) throw err;
                            console.log("---------------------------------------------------------------");
                            console.log("RATES: ");
                            var rates = JSON.parse(res.data);
                            //console.log(rates[3].name.toLowerCase());

                            forEach(rates, function(item){
                                console.log(item);
                                assert.notEqual(rates_titles.indexOf(item.title.toLowerCase()), -1, "COD not available ");
                                console.log("................................................................");
                            });

                            done();
                        });
                    });

                });
            });
        });
    });
});

