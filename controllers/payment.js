const paypal = require('paypal-rest-sdk');
// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live 
    'client_id': 'AXl9LBIYufMtFbrvLncv6uYKa0614nU8oeBCKEAC-tFXv6BRunnr5L-1kEUGofjHmnmvd84hpWX9ifBC', // please provide your client id here 
    'client_secret': 'EPFthn7GxQfRGQ6KMUbc6A985SRheOcgWfPVtr_k7O4SVkTN9Ih7C3pybbolC-8zwY3zbgrwPyT85P5z' // provide your client secret here 
});

exports.create = async(req, res, next) => {
    try {
        //build PayPal payment request
        var payReq = JSON.stringify({
            'intent':'sale',
            'redirect_urls':{
                'return_url':'http://localhost:3000/process',
                'cancel_url':'http://localhost:3000/cancel'
            },
            'payer':{
                'payment_method':'paypal'
            },
            'transactions':[{
                'amount':{
                    'total':'7.47',
                    'currency':'USD'
                },
                'description':'This is the payment transaction description.'
            }]
        });

        paypal.payment.create(payReq, function(error, payment){
            
            //capture HATEOAS links
            var links = {};
            payment.links.forEach(function(linkObj){
                links[linkObj.rel] = {
                    'href': linkObj.href,
                    'method': linkObj.method
                };
            })
        
            //if redirect url present, redirect user
            if (links.hasOwnProperty('approval_url')){
                res.redirect(links['approval_url'].href);
            } 
            
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};

exports.process = async(req, res, next) => {
    try {
        var paymentId = req.query.paymentId;
        var payerId = { 'payer_id': req.query.PayerID };

        paypal.payment.execute(paymentId, payerId, function(error, payment){
            if (payment.state == 'approved'){
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        });
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
};
