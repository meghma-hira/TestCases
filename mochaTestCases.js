var storehippo = require('storehippo-nodejs-sdk')({
    storename: "atishaydemo2",
    access_key: "admin"
});

var assert = require('assert');

describe('Shipping test cases', function () {

    this.timeout(1000000);

    before(function (done) {

        done();
    });

    beforeEach(function (done) {
        //An action to be performed before each test case
        done();
    });


    it('Checking Order Status', function (done) {
        var request = {
            entity: "ms.orders"

        };
        storehippo.list(request, function (err, response) {
            if (err) throw err;
            //console.log(response);
            response.data = JSON.parse(response.data);
            var order = response.data.records[0];

            assert.equal(200, response.status, "ERROR");



            var getadd = {
                entity: "ms.orders",
                query: {
                    filters: [{field: 'order_id', value: 'OID170'}],
                    limit: 1
                }
            };

            storehippo.call("getAddresses", getadd, function (err, res) {
                if (err) throw err;
                //console.log(res);
                var pickup = JSON.parse(res.data);

                assert.equal(200, res.status, "ERROR")



                var getmethod = {
                    entity: "ms.fulfillment"
                    //command : "getMethods"
                };

                storehippo.call("getMethods", getmethod, function (err, res) {
                    if (err) throw err;
                    //console.log(res)
                    var methods = JSON.parse(res.data);
                    //console.log(methods[1].settings.services);

                    assert.equal(200, res.status, "ERROR");
                    done();
                });

            });

        });
    });

    //todo test cases for checkdeliveryavailbility
    //todo test cases for shippo level 2 for different combintation of services like delhivery,aramex, fedex and combinations of three of them
    //todo check that rates are available for pincodes where delivery is available.


    //todo checkeliveryavailability when delivery pincodes app is installed.

});