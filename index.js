var accessToken = require('./api/accessToken');
var customer = require('./api/customer');
var transaction = require('./api/transaction');

var SquareUp = function (ACCESS_TOKEN) {
	accessToken.setAccessToken(ACCESS_TOKEN);

	//Initializing transaction to set location Id for all transactions
	transaction.init();
};

SquareUp.prototype.createCustomer = customer.create;
SquareUp.prototype.createCustomerCard = customer.createCustomerCard;
SquareUp.prototype.deleteCustomerCard = customer.deleteCustomerCard;
SquareUp.prototype.charge = transaction.charge;
SquareUp.prototype.refund = transaction.refund;
SquareUp.prototype.getPayment = transaction.getPayment;

module.exports = SquareUp;
