const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const { rejectNotEditor } = require('../modules/editor-authentication-middleware');
const { rejectNotDriver } = require('../modules/driver-authentication-middleware');

// GET ROUTE for selecting all users
router.get('/', rejectNotEditor, (req, res) => {
    const queryText = `SELECT "dependents"."id", "first_name", "last_name", "date_of_birth", "annual_income", "phone_number", "building_address1", "building_address2", "zip_code", "county_id", "county_name", "city", "special_request", "document_signed", "dietary_restrictions", "referral_id", "program_id", "menu_description", "referral_name", "program_name", "number_of_meals", "meal_choice", "menu_description", "route_id", "route_name" FROM "dependents"
                                JOIN "county" ON "dependents"."county_id" = "county"."id"
                                JOIN "referral" ON "dependents"."referral_id" = "referral"."id"
                                JOIN "program" ON "dependents"."program_id" = "program"."id"
                                JOIN "current_meal" ON "dependents"."id" = "current_meal"."dependent_id"
                                JOIN "menu" ON "current_meal"."meal_choice" = "menu"."id"
                                JOIN "route" ON "dependents"."route_id" = "route"."id"
                                ORDER BY "dependents"."id" ASC
                                ;`;
    pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making GET Request:`, error);
            res.sendStatus(500);
        });
});// END GET ROUTE

// GET ROUTE for selecting single user info
router.get('/:id', rejectNotEditor, (req, res) => {
    const queryText = `SELECT "dependents"."id", "first_name", "last_name", "date_of_birth", "annual_income", "phone_number", "building_address1", "building_address2", "zip_code", "county_id", "county_name", "city", "special_request", "document_signed", "dietary_restrictions", "referral_id", "program_id", "referral_name", "program_name", "number_of_meals", "meal_choice", "menu_description" FROM "dependents"
                                JOIN "county" ON "dependents"."county_id" = "county"."id"
                                JOIN "referral" ON "dependents"."referral_id" = "referral"."id"
                                JOIN "program" ON "dependents"."program_id" = "program"."id"
                                JOIN "current_meal" ON "dependents"."id" = "current_meal"."dependent_id"
                                JOIN "menu" ON "current_meal"."meal_choice" = "menu"."id"
                        WHERE "dependents"."id" = $1`;
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log(`Error making GET Request:`, error);
            res.sendStatus(500);
        });
});//END GET ROUTE

//POST ROUTE add new dependent
router.post('/', rejectNotDriver, (req, res) => {
    const b = req.body

    const queryText = `WITH insert1 AS (
                        INSERT INTO "dependents"
                        ( "first_name", "last_name", "date_of_birth", 
                            "annual_income", "phone_number",
                            "building_address1", "building_address2", "zip_code", "county_id", "city",
                            "special_request", "dietary_restrictions",
                            "referral_id", "program_id", "document_signed", "route_id")
                        VALUES
                        ( $1, $2, $3,
                        $4, $5,
                        $6, $7, $8, $9, $10,
                        $11, $12,
                        $13, $14, $15, $16
                        )
                        RETURNING id )
                        INSERT INTO "current_meal"
                        ( "dependent_id", "number_of_meals", "meal_choice")
                        SELECT insert1.id, $17, $18
                        FROM insert1;  `;
    const values = [b.first_name, b.last_name, b.date_of_birth, b.annual_income, b.phone_number, b.building_address1, b.building_address2, b.zip_code, b.county_id, b.city, b.special_request, b.dietary_restrictions, b.referral_id, b.program_id, b.document_signed, b.route_id, b.number_of_meals, b.meal_choice];
    pool.query(queryText, values)
        .then((results) => {
            res.send(results);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        })
});

//PUT ROUTE to adjust all account info
router.put('/:id', rejectNotEditor, async (req, res) => {
    const b = req.body;
    const connection = await pool.connect();
    try {
        await connection.query('BEGIN;');
        const sqlText1 = `UPDATE dependents
                            SET("first_name", "last_name", "date_of_birth",
                                "annual_income", "phone_number",
                                "building_address1", "building_address2", "zip_code", "county_id", "city",
                                "special_request", "dietary_restrictions",
                                "referral_id", "program_id", "document_signed", "route_id")
                                =
                                ($1, $2, $3,
                                $4, $5,
                                $6, $7, $8, $9, $10,
                                $11, $12,
                                $13, $14, $15, $16
                                )
                            WHERE "id" = $17;`
        const values1 = [b.first_name, b.last_name, b.date_of_birth, b.annual_income, b.phone_number, b.building_address1, b.building_address2, b.zip_code, b.county_id, b.city, b.special_request, b.dietary_restrictions, b.referral_id, b.program_id, b.document_signed, b.route_id, req.params.id];
        const sqlText2 = `UPDATE "current_meal"
                            SET("number_of_meals", "meal_choice") = ($1, $2)
                            WHERE "id" = $3;
                            `;
        const values2 = [b.number_of_meals, b.meal_choice, req.params.id];
        await connection.query(sqlText1, values1);
        await connection.query(sqlText2, values2);
        await connection.query('COMMIT;');
        res.sendStatus(200);
    }
    catch (error) {
            await connection.query('ROLLBACK;');
            console.log('Error with updating dependent info', error)
            res.sendStatus(500);
    } finally {
            connection.release();
    }
});
module.exports = router;
