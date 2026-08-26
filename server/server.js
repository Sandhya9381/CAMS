require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const upload = require("./upload");

const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");

const app = express();

const JWT_SECRET = "cams_super_secret_key_change_later";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(cors());
app.use(express.json());
// ==================================================
// AUTHENTICATION & ADMIN AUTHORIZATION
// ==================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        req.user = user;

        next();
    });
}


function requireAdmin(req, res, next) {

    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
}

// ==================================================
// HOME ROUTE
// ==================================================

app.get("/", (req, res) => {
    res.send("CAMS Backend is running!");
});


// ==================================================
// DATABASE TEST ROUTE
// ==================================================

app.get("/test-db", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected!",
            time: result.rows[0].now
        });

    } catch (error) {

        console.error("Database error:", error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});


// ==================================================
// SIGNUP
// ==================================================

app.post("/api/auth/signup", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role,
            department
        } = req.body;


        // Check required fields

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }


        // Check whether email already exists

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                message: "Email already registered"
            });
        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Insert user

        const result = await pool.query(

            `INSERT INTO users
            (name, email, password, role, department)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, department, created_at`,

            [
                name,
                email,
                hashedPassword,
                role || "student",
                department || null
            ]
        );


        res.status(201).json({

            message: "User registered successfully",

            user: result.rows[0]
        });


    } catch (error) {

        console.error("Signup error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==================================================
// LOGIN
// ==================================================

app.post("/api/auth/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check required fields

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and password are required"
            });
        }


        // Find user

        const result = await pool.query(

            "SELECT * FROM users WHERE email = $1",

            [email]
        );


        // User doesn't exist

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        const user = result.rows[0];

console.log("LOGIN DEBUG:", {
    email: user.email,
    role: user.role,
    passwordHashPrefix: user.password ? user.password.substring(0, 7) : null
});
        // Compare password

        const passwordMatch = await bcrypt.compare(

            password,

            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }


        // Create JWT

        const token = jwt.sign(

            {
                id: user.id,
                email: user.email,
                role: user.role
            },

            JWT_SECRET,

            {
                expiresIn: "1h"
            }
        );


        // Send response

        res.json({

            message: "Login successful",

            token: token,

            user: {

                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        });


    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


// ==================================================
// ADD ASSET
// ==================================================
// ==================================================
// ADD ASSET WITH IMAGE
// ==================================================



// ==================================================
// GET ALL ASSETS
// ==================================================

app.get("/api/assets", async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT *
             FROM assets
             ORDER BY created_at DESC`
        );


        res.json({

            assets: result.rows
        });


    } catch (error) {

        console.error("Get assets error:", error);

        res.status(500).json({

            message: "Server error"
        });
    }
});
// -------------------------
// TEST IMAGE UPLOAD
// -------------------------

// ==================================================
// ADD ASSET - ADMIN ONLY
// ==================================================

app.post(
    "/api/assets",
    authenticateToken,
    requireAdmin,
    upload.single("image"),
    async (req, res) => {

    try {

        const {
            asset_name,
            asset_code,
            category,
            department,
            location,
            purchase_date,
            warranty,
            condition
        } = req.body;


        // ------------------------------------------
        // CHECK REQUIRED FIELDS
        // ------------------------------------------

        if (
            !asset_name ||
            !asset_code ||
            !category ||
            !department
        ) {

            return res.status(400).json({
                message:
                    "Asset name, asset code, category and department are required"
            });

        }


        // ------------------------------------------
        // UPLOAD IMAGE TO CLOUDINARY
        // ------------------------------------------

        let image_url = null;

        if (req.file) {

            const result = await new Promise(
                (resolve, reject) => {

                    const stream =
                        cloudinary.uploader.upload_stream(
                            {
                                folder: "cams/assets"
                            },

                            (error, result) => {

                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }

                            }
                        );

                    stream.end(req.file.buffer);

                }
            );

            image_url = result.secure_url;
        }


        // ------------------------------------------
        // INSERT ASSET INTO DATABASE
        // ------------------------------------------

        const result = await pool.query(

            `INSERT INTO assets
            (
                asset_name,
                asset_code,
                category,
                department,
                location,
                purchase_date,
                warranty,
                condition
                ${image_url ? ", image_url" : ""}
            )

            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
                ${image_url ? ", $9" : ""}
            )

            RETURNING *`,

            image_url
                ? [
                    asset_name,
                    asset_code,
                    category,
                    department,
                    location || null,
                    purchase_date || null,
                    warranty || null,
                    condition || "Good",
                    image_url
                ]
                : [
                    asset_name,
                    asset_code,
                    category,
                    department,
                    location || null,
                    purchase_date || null,
                    warranty || null,
                    condition || "Good"
                ]

        );


        // ------------------------------------------
        // SUCCESS
        // ------------------------------------------

        res.status(201).json({

            message: "Asset added successfully",

            asset: result.rows[0]

        });


    } catch (error) {

        console.error(
            "Add asset error:",
            error
        );


        // Duplicate asset code

        if (error.code === "23505") {

            return res.status(409).json({

                message:
                    "Asset code already exists"

            });

        }


        res.status(500).json({

            message:
                "Server error"

        });

    }

});
// ==================================================
// REQUEST AN ASSET
// ==================================================

app.post("/api/requests", async (req, res) => {

    try {

        const { user_id, asset_id } = req.body;

        // ------------------------------------------
        // Check required fields
        // ------------------------------------------

        if (!user_id || !asset_id) {

            return res.status(400).json({
                message: "User ID and Asset ID are required"
            });
        }


        // ------------------------------------------
        // Check whether asset exists
        // ------------------------------------------

        const assetResult = await pool.query(
            "SELECT * FROM assets WHERE id = $1",
            [asset_id]
        );

        if (assetResult.rows.length === 0) {

            return res.status(404).json({
                message: "Asset not found"
            });
        }


        const asset = assetResult.rows[0];


        // ------------------------------------------
        // Check whether asset is available
        // ------------------------------------------

        // ------------------------------------------
// Check asset condition and availability
// ------------------------------------------

// Asset under maintenance cannot be requested
if (
    asset.condition &&
    asset.condition.toLowerCase() === "under maintenance"
) {

    return res.status(400).json({
        message: "Asset is currently under maintenance"
    });
}

        // ------------------------------------------
        // Check if user already has a pending request
        // ------------------------------------------

        const existingRequest = await pool.query(
            `SELECT id
             FROM asset_requests
             WHERE user_id = $1
             AND asset_id = $2
             AND status = 'Pending'`,
            [user_id, asset_id]
        );

        if (existingRequest.rows.length > 0) {

            return res.status(409).json({
                message: "You already have a pending request for this asset"
            });
        }


        // ------------------------------------------
        // Create request
        // ------------------------------------------

        const result = await pool.query(

            `INSERT INTO asset_requests
            (user_id, asset_id)
            VALUES ($1, $2)
            RETURNING *`,

            [user_id, asset_id]
        );


        // ------------------------------------------
        // Send response
        // ------------------------------------------

        res.status(201).json({

    message:
        asset.status === "Borrowed"
            ? "Asset is currently held by another student. Your request has been added to the waiting queue."
            : "Asset request submitted successfully",

    request: result.rows[0]
});


    } catch (error) {

        console.error("Request asset error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }

});

// ==================================================
// GET ALL ASSET REQUESTS - ADMIN
// ==================================================

app.get("/api/requests", async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT
                asset_requests.id,
                asset_requests.status,
                asset_requests.requested_at,

                users.id AS user_id,
                users.name AS user_name,
                users.email AS user_email,
                users.department AS user_department,

                assets.id AS asset_id,
                assets.asset_name,
                assets.asset_code,
                assets.category,
                assets.department AS asset_department,
                assets.location,
                assets.image_url

             FROM asset_requests

             JOIN users
               ON asset_requests.user_id = users.id

             JOIN assets
               ON asset_requests.asset_id = assets.id

             ORDER BY asset_requests.requested_at DESC`
        );


        res.json({

            requests: result.rows

        });


    } catch (error) {

        console.error(
            "Get all requests error:",
            error
        );


        res.status(500).json({

            message: "Server error"

        });

    }

});

// ==================================================
// GET QUEUE POSITION FOR AN ASSET
// ==================================================

app.get(
    "/api/requests/queue-position/:assetId/:userId",
    async (req, res) => {

        try {

            const { assetId, userId } = req.params;


            // ------------------------------------------
            // Find user's pending request
            // ------------------------------------------

            const requestResult = await pool.query(

                `SELECT id, requested_at
                 FROM asset_requests
                 WHERE asset_id = $1
                 AND user_id = $2
                 AND status = 'Pending'
                 LIMIT 1`,

                [assetId, userId]

            );


            // ------------------------------------------
            // User has no pending request
            // ------------------------------------------

            if (requestResult.rows.length === 0) {

                return res.json({
                    in_queue: false
                });

            }


            const userRequest = requestResult.rows[0];


            // ------------------------------------------
            // Count requests ahead of this user
            // ------------------------------------------

            const positionResult = await pool.query(

                `SELECT COUNT(*) AS position
                 FROM asset_requests
                 WHERE asset_id = $1
                 AND status = 'Pending'
                 AND (
                     requested_at < $2
                     OR (
                         requested_at = $2
                         AND id <= $3
                     )
                 )`,

                [
                    assetId,
                    userRequest.requested_at,
                    userRequest.id
                ]

            );


            const position =
                parseInt(
                    positionResult.rows[0].position
                );


            // ------------------------------------------
            // Send queue position
            // ------------------------------------------

            res.json({

                in_queue: true,

                position: position,

                ahead: position - 1

            });


        } catch (error) {

            console.error(
                "Get queue position error:",
                error
            );


            res.status(500).json({

                message: "Server error"

            });

        }

    }
);
// ==================================================
// APPROVE ASSET REQUEST - ADMIN
// ==================================================

app.put("/api/requests/:requestId/approve", async (req, res) => {

    try {

        const { requestId } = req.params;


        // ------------------------------------------
        // Get request
        // ------------------------------------------

        const requestResult = await pool.query(
            `SELECT *
             FROM asset_requests
             WHERE id = $1`,
            [requestId]
        );


        if (requestResult.rows.length === 0) {

            return res.status(404).json({
                message: "Request not found"
            });

        }


        const request = requestResult.rows[0];


        // ------------------------------------------
        // Check request status
        // ------------------------------------------

        if (request.status !== "Pending") {

            return res.status(400).json({
                message: "Only pending requests can be approved"
            });

        }


        // ------------------------------------------
        // Get asset
        // ------------------------------------------

        const assetResult = await pool.query(
            `SELECT *
             FROM assets
             WHERE id = $1`,
            [request.asset_id]
        );


        if (assetResult.rows.length === 0) {

            return res.status(404).json({
                message: "Asset not found"
            });

        }


        const asset = assetResult.rows[0];


        // ------------------------------------------
        // Check asset status
        // ------------------------------------------

        if (asset.status !== "Available") {

            return res.status(400).json({
                message: "Asset is not currently available"
            });

        }


        // ------------------------------------------
        // Approve request
        // ------------------------------------------

        const updatedRequest = await pool.query(
            `UPDATE asset_requests
             SET status = 'Approved',
                 approved_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [requestId]
        );


        // ------------------------------------------
        // Change asset status
        // ------------------------------------------

        await pool.query(
            `UPDATE assets
             SET status = 'Borrowed'
             WHERE id = $1`,
            [request.asset_id]
        );


        // ------------------------------------------
        // Send response
        // ------------------------------------------

        res.json({

            message: "Request approved successfully",

            request: updatedRequest.rows[0]

        });


    } catch (error) {

        console.error(
            "Approve request error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });

    }

});

// ==================================================
// REJECT ASSET REQUEST - ADMIN
// ==================================================

app.put("/api/requests/:requestId/reject", async (req, res) => {

    try {

        const { requestId } = req.params;


        // ------------------------------------------
        // Get request
        // ------------------------------------------

        const requestResult = await pool.query(
            `SELECT *
             FROM asset_requests
             WHERE id = $1`,
            [requestId]
        );


        if (requestResult.rows.length === 0) {

            return res.status(404).json({
                message: "Request not found"
            });

        }


        const request = requestResult.rows[0];


        // ------------------------------------------
        // Check request status
        // ------------------------------------------

        if (request.status !== "Pending") {

            return res.status(400).json({
                message: "Only pending requests can be rejected"
            });

        }


        // ------------------------------------------
        // Reject request
        // ------------------------------------------

        const updatedRequest = await pool.query(
            `UPDATE asset_requests
             SET status = 'Rejected'
             WHERE id = $1
             RETURNING *`,
            [requestId]
        );


        // ------------------------------------------
        // Send response
        // ------------------------------------------

        res.json({

            message: "Request rejected successfully",

            request: updatedRequest.rows[0]

        });


    } catch (error) {

        console.error(
            "Reject request error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });

    }

});


// ==================================================
// RETURN ASSET
// ==================================================

app.put("/api/requests/:requestId/return", async (req, res) => {

    const client = await pool.connect();

    try {

        const { requestId } = req.params;


        // ------------------------------------------
        // START TRANSACTION
        // ------------------------------------------

        await client.query("BEGIN");


        // ------------------------------------------
        // GET CURRENT BORROWED REQUEST
        // ------------------------------------------

        const requestResult = await client.query(
            `SELECT *
             FROM asset_requests
             WHERE id = $1
             FOR UPDATE`,
            [requestId]
        );


        if (requestResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Request not found"
            });

        }


        const request = requestResult.rows[0];


        // ------------------------------------------
        // CHECK REQUEST STATUS
        // ------------------------------------------

        if (request.status !== "Approved") {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "Only borrowed assets can be returned"
            });

        }


        // ------------------------------------------
        // RETURN CURRENT ASSET
        // ------------------------------------------

        await client.query(
            `UPDATE asset_requests
             SET status = 'Returned'
             WHERE id = $1`,
            [requestId]
        );


        // ------------------------------------------
        // FIND NEXT PERSON IN QUEUE
        // ------------------------------------------

        const nextRequestResult = await client.query(
            `SELECT *
             FROM asset_requests
             WHERE asset_id = $1
               AND status = 'Pending'
             ORDER BY requested_at ASC
             LIMIT 1
             FOR UPDATE`,
            [request.asset_id]
        );


        // ------------------------------------------
        // SOMEONE IS WAITING
        // ------------------------------------------

        if (nextRequestResult.rows.length > 0) {

            const nextRequest =
                nextRequestResult.rows[0];


            // Approve the next person automatically

            await client.query(
                `UPDATE asset_requests
                 SET status = 'Approved',
                     approved_at = NOW()
                 WHERE id = $1`,
                [nextRequest.id]
            );


            // Asset immediately goes to next student

            await client.query(
                `UPDATE assets
                 SET status = 'Borrowed'
                 WHERE id = $1`,
                [request.asset_id]
            );


            await client.query("COMMIT");


            return res.json({

                message:
                    "Asset returned and automatically allocated to the next student",

                next_request_id:
                    nextRequest.id

            });

        }


        // ------------------------------------------
        // NOBODY IS WAITING
        // ------------------------------------------

        await client.query(
            `UPDATE assets
             SET status = 'Available'
             WHERE id = $1`,
            [request.asset_id]
        );


        await client.query("COMMIT");


        res.json({

            message:
                "Asset returned successfully and is now available"

        });


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "Return asset error:",
            error
        );


        res.status(500).json({

            message:
                "Server error while returning asset"

        });


    } finally {

        client.release();

    }

});



// ==================================================
// GET REQUESTS FOR A USER
// ==================================================

app.get("/api/requests/user/:userId", async (req, res) => {

    try {

        const { userId } = req.params;

        const result = await pool.query(
            `SELECT
                ar.id,
                ar.status,
                ar.requested_at,
                ar.approved_at,

                a.id AS asset_id,
                a.asset_name,
                a.asset_code,
                a.category,
                a.department,
                a.location,
                a.condition,
                a.status AS asset_status,
                a.image_url

             FROM asset_requests ar

             JOIN assets a
             ON ar.asset_id = a.id

             WHERE ar.user_id = $1

             ORDER BY ar.requested_at DESC`,
            [userId]
        );

        res.json({
            requests: result.rows
        });

    } catch (error) {

        console.error("Get user requests error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

});
// ==================================================
// START SERVER
// ==================================================
// ==================================================
// GET ALL BORROWED ASSETS - ADMIN
// ==================================================

app.get("/api/assets/borrowed", async (req, res) => {

    try {

        const result = await pool.query(

            `SELECT
                a.id,
                a.asset_name,
                a.asset_code,
                a.category,
                a.department,
                a.location,
                a.condition,
                a.image_url,

                u.id AS user_id,
                u.name AS user_name,
                u.email AS user_email,
                u.department AS user_department,

                ar.id AS request_id,
                ar.requested_at,
                ar.approved_at

             FROM assets a

             JOIN asset_requests ar
               ON ar.asset_id = a.id
              AND ar.status = 'Approved'

             JOIN users u
               ON ar.user_id = u.id

             WHERE a.status = 'Borrowed'

             ORDER BY ar.approved_at DESC`
        );


        res.json({
            assets: result.rows
        });


    } catch (error) {

        console.error(
            "Get borrowed assets error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ==================================================
// GET BORROWED ASSETS FOR USER
// ==================================================

app.get("/api/assets/borrowed/user/:userId", async (req, res) => {

    try {

        const { userId } = req.params;


        const result = await pool.query(

            `SELECT
                a.id,
                a.asset_name,
                a.asset_code,
                a.category,
                a.department,
                a.location,
                a.condition,
                a.image_url,

                ar.id AS request_id,
                ar.requested_at,
                ar.approved_at

             FROM assets a

             JOIN asset_requests ar
               ON ar.asset_id = a.id
              AND ar.status = 'Approved'

             WHERE ar.user_id = $1
             AND a.status = 'Borrowed'

             ORDER BY ar.approved_at DESC`,

            [userId]
        );


        res.json({
            assets: result.rows
        });


    } catch (error) {

        console.error(
            "Get user borrowed assets error:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });

    }

});


// ==================================================
// RETURN ASSET - ADMIN
// ==================================================

app.put("/api/assets/:assetId/return", async (req, res) => {

    const client = await pool.connect();

    try {

        const { assetId } = req.params;


        await client.query("BEGIN");


        // ------------------------------------------
        // Check asset
        // ------------------------------------------

        const assetResult = await client.query(

            `SELECT *
             FROM assets
             WHERE id = $1
             FOR UPDATE`,

            [assetId]
        );


        if (assetResult.rows.length === 0) {

            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Asset not found"
            });

        }


        const asset = assetResult.rows[0];


        if (asset.status !== "Borrowed") {

            await client.query("ROLLBACK");

            return res.status(400).json({
                message: "Asset is not currently borrowed"
            });

        }


        // ------------------------------------------
        // Find current approved request
        // ------------------------------------------

        const currentRequest = await client.query(

            `SELECT *
             FROM asset_requests
             WHERE asset_id = $1
             AND status = 'Approved'
             ORDER BY approved_at DESC
             LIMIT 1
             FOR UPDATE`,

            [assetId]
        );


        // ------------------------------------------
        // Mark current request as returned
        // ------------------------------------------

        if (currentRequest.rows.length > 0) {

            await client.query(

                `UPDATE asset_requests
                 SET status = 'Returned'
                 WHERE id = $1`,

                [currentRequest.rows[0].id]
            );

        }


        // ------------------------------------------
        // Find first person in queue
        // ------------------------------------------

        const nextRequest = await client.query(

            `SELECT *
             FROM asset_requests
             WHERE asset_id = $1
             AND status = 'Pending'
             ORDER BY requested_at ASC, id ASC
             LIMIT 1
             FOR UPDATE`,

            [assetId]
        );


        // ------------------------------------------
        // Someone is waiting
        // ------------------------------------------

        if (nextRequest.rows.length > 0) {

            const next = nextRequest.rows[0];


            // Approve first person in queue

            await client.query(

                `UPDATE asset_requests
                 SET status = 'Approved',
                     approved_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,

                [next.id]
            );


            // Asset immediately goes to that student

            await client.query(

                `UPDATE assets
                 SET status = 'Borrowed'
                 WHERE id = $1`,

                [assetId]
            );


            await client.query("COMMIT");


            return res.json({

                message:
                    "Asset returned and automatically allocated to the first student in the queue.",

                next_user_id: next.user_id,
                request_id: next.id

            });

        }


        // ------------------------------------------
        // Nobody waiting
        // ------------------------------------------

        await client.query(

            `UPDATE assets
             SET status = 'Available'
             WHERE id = $1`,

            [assetId]
        );


        await client.query("COMMIT");


        res.json({

            message:
                "Asset returned successfully and is now available."

        });


    } catch (error) {

        await client.query("ROLLBACK");


        console.error(
            "Return asset error:",
            error
        );


        res.status(500).json({
            message: "Server error"
        });


    } finally {

        client.release();

    }

});
const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `CAMS Backend running on http://localhost:${PORT}`
    );

});