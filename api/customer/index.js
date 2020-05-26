var request = require('request');
var accessToken = require('../accessToken');
var Joi = require('joi');

module.exports = exports = {
    create: function (details) {
        if (!accessToken.isTokenSet()) return new Error("No Token Set Fot This Application. Please set a valid token");

        let schema = {
            "given_name": Joi.string().required(),
            "family_name": Joi.string().required(),
            "email_address": Joi.string().email().required(),
            "address": Joi.object().keys({
                "address_line_1": Joi.string(),
                "address_line_2": Joi.string(),
                "locality": Joi.string(),
                "postal_code": Joi.string(),
                "country": Joi.string()
            }).optional(),
            "phone_number": [Joi.number(), Joi.string()],
            "note": Joi.string().allow("")
        };

        let isValid = Joi.validate(details, schema);
        if (!isValid) return new Error("Please provide all required fields");

        return new Promise((resolve, reject) => {
            console.log('POST https://connect.squareup.com/v2/customers');
            request({
                method: 'POST',
                url: 'https://connect.squareup.com/v2/customers',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + accessToken.getAccessToken()
                },
                json: details
            }, function (error, response, body) {
                if (error || body.errors) reject(error || body.errors[0].detail);
                else {
                    if (typeof body == 'string') body = JSON.parse(body);
                    resolve(body);
                }
            });
        });
    },
    createCustomerCard: function (customerId, details) {
        if (!accessToken.isTokenSet()) return new Error("No Token Set Fot This Application. Please set a valid token");
        if (!customerId) return new Error('Please provide customer id');

        let schema = {
            "card_nonce": Joi.string().required(),
            "billing_address": Joi.object().keys({
                "address_line_1": Joi.string(),
                "address_line_2": Joi.string(),
                "locality": Joi.string(),
                "administrative_district_level_1": Joi.string(),
                "postal_code": Joi.string(),
                "country": Joi.string()
            }).optional(),
            "cardholder_name": Joi.string().required()
        };

        let isValid = Joi.validate(details, schema);
        if (!isValid) return new Error("Please provide all required fields");

        return new Promise((resolve, reject) => {
            console.log('POST ', `https://connect.squareup.com/v2/customers/${customerId}/cards`);
            request({
                method: 'POST',
                url: `https://connect.squareup.com/v2/customers/${customerId}/cards`,
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + accessToken.getAccessToken()
                },
                json: details
            }, function (error, response, body) {
                if (error || body.errors) reject(error || body.errors[0].detail);
                else {
                    if (typeof body == 'string') body = JSON.parse(body);
                    resolve(body);
                }
            });
        });
    },
    deleteCustomerCard: function (customerId, cardId) {
        if (!accessToken.isTokenSet()) return new Error("No Token Set Fot This Application. Please set a valid token");
        if (!customerId) return new Error('Please provide customer id');
        if (!cardId) return new Error('Please provide card id');

        return new Promise((resolve, reject) => {
            console.log('DELETE ', `https://connect.squareup.com/v2/customers/${customerId}/cards/${cardId}`);
            request({
                method: 'DELETE',
                url: `https://connect.squareup.com/v2/customers/${customerId}/cards/${cardId}`,
                headers: {
                    'Authorization': "Bearer " + accessToken.getAccessToken()
                }
            }, function (error, response, body) {
                if (error || body.errors) reject(error || body.errors[0].detail);
                else {
                    if (typeof body == 'string') body = JSON.parse(body);
                    resolve(body);
                }
            });
        });
    }
};
