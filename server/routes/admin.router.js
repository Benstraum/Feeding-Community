const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectNotAdmin } = require('../modules/admin-authentication-middleware');
const encryptLib = require('../modules/encryption');

// GET ROUTE for selecting all users
router.get('/', rejectNotAdmin, (req, res) => {
    const queryText = `SELECT * FROM "dependents"`;
    pool.query(queryText)
        .then((result) => {
            console.log(`GET Ratings database request successful`, result);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making GET Ratings for teas:`, error);
            res.sendStatus(500);
        });
});// END GET ROUTE

// GET ROUTE for selecting single user info
router.get('/:id', rejectNotAdmin, (req, res) => {
    const queryText = `SELECT * FROM "dependents"
                        WHERE "id" = $1`;
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log(`GET Ratings database request successful`, result);
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making GET Ratings for teas:`, error);
            res.sendStatus(500);
        });
});//END GET ROUTE

//POST ROUTE to create new Admin account
router.post('/register/', rejectNotAdmin, (req, res) => {

    const password = encryptLib.encryptPassword(req.body.password);
    const email_address = req.body.email_address;

    console.log("password:", password, "email_addresss:", email_address)

    const queryText = `INSERT INTO "user"
                            ("email_address", "password", "account_type")
                            VALUES
                            ($1, $2, 2)                  
                            ;`;
    const values = [email_address, password]

    pool.query(queryText, values)
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
});//END POST ROUTE to create account

//POST ROUTE add new dependent
router.post('/dependent/', rejectNotAdmin, (req, res) => {

    console.log('body:', req.body)
    const queryText = `WITH insert1 AS (
                        INSERT INTO "dependents"
                        ( "first_name", "last_name", "date_of_birth", 
                            "annual_income", "phone_number",
                            "building_address1", "building_address2", "zip_code", "county_id", "city",
                            "special_request", "dietary_restrictions",
                            "referral_id", "program_id")
                        VALUES
                        ( $1, $2, $3,
                        $4, $5,
                        $6, $7, $8, $9, $10,
                        $11, $12,
                        $13, $14
                        )
                        RETURNING id ), insert2 AS (
                        INSERT INTO "orders" ("dependent_id")
                        SELECT insert1.id
                        FROM   insert1 
                        )
                        INSERT INTO "current_meal"
                        ( "dependent_id", "number_of_meals", "meal_choice")
                        SELECT insert1.id, $15, $16
                        FROM insert1;  `;

    const values = [req.body.first_name, req.body.last_name, req.body.date_of_birth, req.body.annual_income, req.body.phone_number, req.body.building_address1, req.body.building_address2, req.body.zip_code, req.body.county_id, req.body.city, req.body.special_request, req.body.dietary_restrictions, req.body.referral_id, req.body.program_id, req.body.number_of_meals, req.body.meal_choice];
    console.log('put request, values:', values)
    pool.query(queryText, values)
        .then((results) => {
            res.send(results);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        })
});


//PUT ROUTE to adjust all account info
router.put('/user/:id', rejectNotAdmin, (req, res) => {
    
    console.log('body:', req.body)
    const queryText = `UPDATE dependents
                        SET("first_name", "last_name", "date_of_birth",
                                "annual_income", "phone_number",
                                "building_address1", "building_address2", "zip_code", "county_id", "city",
                                "special_request", "dietary_restrictions",
                                "referral_id", "program_id")
                                =
                                ($1, $2, $3,
                                $4, $5,
                                $6, $7, $8, $9, $10,
                                $11, $12,
                                $13, $14
                                )
                        WHERE "id" = $15;
                                `;

    const values = [req.body.first_name, req.body.last_name, req.body.date_of_birth, req.body.annual_income, req.body.phone_number, req.body.building_address1, req.body.building_address2, req.body.zip_code, req.body.county_id, req.body.city, req.body.special_request, req.body.dietary_restrictions, req.body.referral_id, req.body.program_id, req.params.id];
    console.log('put request, values:', values)
    pool.query(queryText, values)
        .then((results) => {
            res.send(results);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
    })
});

//PUT ROUTE to change menu
router.put('/menu/', rejectNotAdmin, (req, res) => {

    console.log('body:', req.body)
    const queryText = `UPDATE "menu" AS m
                            SET  "description" = c."description"
                            FROM (VALUES
                            (1, $1),(2, $2),(3, $3))
                            AS c("id", "description")
                            WHERE c."id" = m."id" ;`;

    const values = [req.body.option1, req.body.option2, req.body.veggie];
    console.log('put request, values:', values)
    pool.query(queryText, values)
        .then((results) => {
            res.send(results);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        })
}); //END PUT ROUTE


module.exports = router;