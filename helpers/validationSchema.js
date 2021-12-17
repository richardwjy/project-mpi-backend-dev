const Joi = require('joi');

const invoiceSchema = Joi.object({
    InvoiceNumber: Joi.string().required(),
    InvoiceCurrency: Joi.string().required(),
    InvoiceAmount: Joi.number().required(),
    InvoiceDate: Joi.date().required(),
    InvoiceType: Joi.string().required(),
    BusinessUnit: Joi.string().required(),
    Supplier: Joi.string().required(),
    SupplierSite: Joi.string().required(),
    InvoiceReceivedDate: Joi.date().required(),
    PaymentCurrency: Joi.string().required(),
    PaymentTerms: Joi.string().required(),
    TermsDate: Joi.date().required(),
    AccountingDate: Joi.date().required(),
    LegalEntity: Joi.string().required(),
    invoiceLines: Joi.array().required()
})

module.exports = { invoiceSchema }