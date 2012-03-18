var twitter = require('ntwitter');
var twit = new twitter({
      consumer_key: 'Lr6Ju9elQrw67yAxuDiN8A',
      consumer_secret: 'JmcH699ceFMpDFEYCjrSBGRcCYiw8dj8b9cQDi9qWVI',
      access_token_key: '528389932-klNXWZ3dDUOzuWwVsW6sqs81k00M5Isx2SkGDrNe',
      access_token_secret: 'Za9Z4fRPWlc8L5XXRLMNkGinpjTTL2rA9lyk95lwe0'
    });
	
module.exports = {
  post: function (message, callback) {
	  twit.verifyCredentials(function (err, data) {
			console.log(data);
		  })
		  .updateStatus(message,
			function (err, data) {
			  console.log(data);
			  console.log('error');
			  console.log(err);
			  
			  callback(err);
			}
		  );
  }
};