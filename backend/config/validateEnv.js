/**
 * Validates that all required environment variables are present at boot.
 * If any required variable is missing, lists them and exits with status code 1.
 */
function validateEnv() {
    const required = ["DB_CONNECT", "JWT_SECRET", "MAPBOX_TOKEN"];
    const missing = required.filter(name => !process.env[name]);

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }
}

module.exports = validateEnv;
