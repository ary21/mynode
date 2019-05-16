var express = require('express');
var router = express.Router();
var connection = require('../lib/db');

// Data in home page
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM customers', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('customers', { page_title: 'Mynode - Customers', data: '' });
        } else {
            res.render('customers', { page_title: 'Mynode - Customers', data: rows });
        }
    });
});

// form add
router.get('/add', function (req, res, next) {
    res.render('customers/add', {
        title: 'Add New Customers',
        name: '',
        email: '',
        phone: '',
        address: ''
    });
});

// action form add
router.post('/add', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('phone', 'Phone is required').notEmpty();
    req.assert('address', 'Address is required').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        var newCustomer = {
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim()
        }

        connection.query('INSERT INTO customers SET ?', newCustomer, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('customers/add', {
                    title: 'Add New Customers',
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address
                })
            } else {
                req.flash('success', 'Added data success.');
                res.redirect('/customers');
            }
        });
    } else {
        var err_msg = '';
        errors.forEach(function (error) {
            err_msg += error.msg + '<br/>'
        });

        req.flash('error', err_msg);
        res.render('customers/add', {
            title: 'Add New Customers',
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });
    }
});

// form edit
router.get('/edit/(:id)', function (req, res, next) {
    connection.query('SELECT * FROM customers WHERE id = ' + req.params.id, function (err, rows, fields) {
        if (rows.length <= 0) {
            req.flash('error', 'Customers not found.');
            res.redirect('/customers');
        } else {
            res.render('customers/edit', {
                title: 'Edit Customer',
                id: rows[0].id,
                name: rows[0].name,
                email: rows[0].email,
                phone: rows[0].phone,
                address: rows[0].address
            });
        }
    });
});

// action form edit
router.post('/update/(:id)', function (req, res, next) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('email', 'Email is required').notEmpty();
    req.assert('phone', 'Phone is required').notEmpty();
    req.assert('address', 'Address is required').notEmpty();

    var errors = req.validationErrors();

    if (!errors) {
        var editedCustomer = {
            name: req.sanitize('name').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            address: req.sanitize('address').escape().trim()
        }

        connection.query('UPDATE customers SET ? WHERE id = ' + req.params.id, editedCustomer, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.render('customers/edit', {
                    title: 'Edit Customers',
                    id: req.params.id,
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    address: req.body.address
                })
            } else {
                req.flash('success', 'Update data success.');
                res.redirect('/customers');
            }
        });
    } else {
        var err_msg = '';
        errors.forEach(function (error) {
            err_msg += error.msg + '<br/>'
        });

        req.flash('error', err_msg);
        res.render('customers/edit', {
            title: 'Edit Customers',
            id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        });
    }
});

// delete
router.get('/delete/(:id)', function (req, res, next) {
    var deletedCustomer = { id: req.params.id };

    connection.query('DELETE FROM customers WHERE id = ' + req.params.id, deletedCustomer, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/customers');
        } else {
            req.flash('success', 'Delete data success.');
            res.redirect('/customers');
        }
    });
});

module.exports = router;