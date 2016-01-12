

//7 TEST-CASES for different combinations for services: DELHIVERY, ARAMEX and FEDEX
//need to perform UPDATING for each test-case

var prompt = require("prompt");
var assert = require('assert');
var forEach = require('async-foreach').forEach;

var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin"
});

describe('ms.fulfillment Test Cases', function () {

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
