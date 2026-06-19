/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const up = async (db, client) => {
    await db.collection("users").updateMany(
        { isEmailVerified: { $exists: false } },
        {
            $set: {
                isEmailVerified: true,
            },
        }
    );

    await db.collection("users").updateMany(
        { isActive: { $exists: false } },
        {
            $set: {
                isActive: true,
            },
        }
    );
};

/**
 * @param db {import('mongodb').Db}
 * @param client {import('mongodb').MongoClient}
 * @returns {Promise<void>}
 */
export const down = async (db, client) => {
    await db.collection("users").updateMany(
        {},
        {
            $unset: {
                isEmailVerified: "",
                isActive: "",
            },
        }
    );
};