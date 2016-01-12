var storehippo = require('storehippo-nodejs-sdk')({
    storename : "atishaydemo2",
    access_key : "admin"
    //version:'1.0'
});

var forEach = require('async-foreach').forEach;

var getOrder = {
    entity : "ms.orders",

    query  : {
        start: 0,
        limit: 1
    }

};

storehippo.list(getOrder, function(err, response) {
    if (err) throw err;
    //console.log(response);
    var orderList = JSON.parse(response.data);
    var order = orderList.records[0];
    //console.log(orderList);

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

            console.log("PROVIDER: ", methods[0].provider);

            console.log("Services Available : ")

            forEach(methods[0].settings.services, function(item){
                console.log(item);
            });

            forEach(orderList.records, function(item){

                //console.log(".........................................")
                console.log(item.billing_address.zip);

                var getrate = {
                    entity: "ms.fulfillment",

                    data: {
                        level: methods[0].shipping_level,
                        method: methods[0].provider,
                        orderDetail: item,
                        pickupAddress: pickup[0]
                    }
                };

                //console.log(getrate);

                storehippo.call("getRates", getrate, function (err, res) {
                    if (err) throw err;
                    console.log("RATES: ");
                    console.log(JSON.parse(res.data));

                });
            });


        });
    });

});

/*
var prompt = require('prompt');

prompt.start();

prompt.get(['pincode'], function (err, result) {
    //
    // Log the results.
    //


    var request = {
        entity : "ms.fulfillment",
        data: {pincode: result.pincode}
    };


    storehippo.call("checkDeliveryAvailability", request, function(err, response) {
        if (err) throw err;
        console.log(response);
        //console.log(response.data);

        //var res = JSON.parse(response.data);
        console.log(response.data);
    });

});
*/




