/**
 * Created by hippo-innovations on 12/1/16.
 */


var prompt = require("prompt");
var assert = require('assert');
var forEach = require('async-foreach').forEach;

var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin"
});

//todo test cases for checkdeliveryavailbility

//PROMPTING PINCODE
//CHECKING PINCODE LENGTH
//CHECKING DELIVERYAVAILABILITY ("both" or "COD not available")


describe('checkDeliveryAvailability for a given PINCODE', function () {

    this.timeout(1000000);

    before(function (done) {

        done();
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });


    //When version = 1.0
    /*it('Checking deliveryAvailability when version = 1.0', function (done) {
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

    });*/

    //WHEN version is not SET
    it('Checking deliveryAvailability when version is not set ', function (done) {
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


//todo test cases for shippo level 2 for different combintation of services like delhivery,aramex, fedex and combinations of three of them

//7 TEST-CASES for different combinations for services: DELHIVERY, ARAMEX and FEDEX

describe('ms.fulfillment Test Cases for different combination of services', function () {

    this.timeout(1000000);
    var getorder;
    var order;
    var getadd;
    var pickup;



    before(function (done) {

        getorder = {
            entity: "ms.orders",
            query  : {
                filters: [{field : "order_id", value : "OID258"}]
            }
        };

        storehippo.list(getorder, function (err, response) {
            if (err) throw err;
            //console.log(response);
            var orderList = JSON.parse(response.data);
            order = orderList.records[0];
            //console.log(order);

            getadd = {
                entity: "ms.orders"
            };

            storehippo.call("getAddresses", getadd, function (err, res) {
                if (err) throw err;
                //console.log(res);

                pickup = JSON.parse(res.data);

                done();
            });
        });
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });

    it("Checking for DELHIVERY", function(done){

        var services=['delhivery'];
        var expected_rates_titles = ['delhivery'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title

                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {

                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });

                    done();
                });

            });
        });
    });

    it("Checking for ARAMEX", function(done){
        var services=['aramex'];
        var expected_rates_titles = ['aramex'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title

                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {

                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });

                    done();
                });

            });
        });
    });

    it("Checking for FEDEX", function(done){
        var services=['fedex'];
        var expected_rates_titles = ['standard_overnight', 'fedex_express_saver'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title

                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {

                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });

                    done();
                });
            });
        });
    });

    it("Checking for DELHIVERY and ARAMEX", function(done){
        var services=['delhivery' , 'aramex'];
        var expected_rates_titles = ['delhivery', 'aramex'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as:", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title
                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {
                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });

                    done();
                });

            });
        });
    });

    it("Checking for DELHIVERY and FEDEX", function(done){
        var services=['delhivery', 'fedex'];
        var expected_rates_titles = ['delhivery', 'standard_overnight', 'fedex_express_saver'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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

                    assert.notEqual(services.indexOf(item), -1, "Available services does not match");

                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_titles from response
                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {
                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });
                    done();
                });
            });
        });
        //done();
    });

    it("Checking for ARAMEX and FEDEX", function(done){

        var services=['aramex', 'fedex'];
        var expected_rates_titles = ['aramex', 'standard_overnight', 'fedex_express_saver'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title

                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {

                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });
                    done();
                });

            });
        });
        //done();
    });

    it("Checking for DELHIVERY, ARAMEX and FEDEX", function(done){

        var services=['delhivery', 'aramex', 'fedex'];
        var expected_rates_titles = ['delhivery', 'aramex', 'standard_overnight', 'fedex_express_saver'];

        //upadate ms.fulfillments_methods here

        var updateFulfillment = {
            entity: "ms.fulfillment_methods",
            recordId: '552272ab24f621aa2373a5d8',
            data: {
                settings: {
                    services: services
                }
            }
        };

        console.log("Updating Services as: ", updateFulfillment.data.settings.services);

        storehippo.update(updateFulfillment, function (err, res) {
            if (err) throw err;
            assert.equal(res.data, 'updated successfully', "Services NOT updated");
            console.log(res);

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
                });

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

                    var available_rate_titles = [];

                    forEach(rates, function(item){
                        console.log(item);
                        available_rate_titles.push(item.title.toLowerCase()); //creating array of available rate_title

                        console.log("................................................................");
                    });
                    //console.log(service_title);

                    forEach(expected_rates_titles, function (item) {

                        //Checking if rates are available for each services
                        //Comparing available rates with expected array of rates titles rates_titles
                        assert.notEqual(available_rate_titles.indexOf(item), -1, "COD not available ");
                    });
                    done();
                });
            });
        });
    });
});

//todo check that rates are available for pincodes where delivery is available.

//Taking 10 ORDERS from ms.orders
//Retrieving zipcode of shipping_address for each order
//Checking deliveryAvailability for each zipcode
//Displaying rates for each corresponding order

describe('Test Cases for getting RATES when delivery at pincodes are available ', function () {

    this.timeout(1000000);

    before(function (done) {

        done();
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });

    it('Checking Delivery at PINCODES and printing corresponding RATES ', function (done) {

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