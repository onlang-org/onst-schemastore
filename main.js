const { distance } = require('fastest-levenshtein');

/**
 * Retrieves the catalog from the schemastore.org and returns an array of schemas.
 *
 * @return {Array} an array of schemas
 */
const getCatalog = async () => {
    const catalog = await getFileContent('https://www.schemastore.org/api/json/catalog.json');

    return JSON.parse(catalog).schemas;
}

/**
 * Retrieves the content of a file from the provided download URL.
 *
 * @param {string} download_url - The URL from which to download the file content
 * @return {Promise<string>} The text content of the downloaded file
 */
async function getFileContent(download_url) {
    try {
        const fileContent = await fetch(download_url, {
            method: 'GET',
        }
        );

        return fileContent.text();
    }
    catch (error) {
        throw new Error(`Error fetching file content: ${error.message}`);
    }
}

/**
 * Asynchronously categorizes schemas based on groups.
 *
 * @return {Array} The categorized schemas sorted by name.
 */
async function categorizeSchemas() {
    const catalog = await getCatalog();
    const categorizedSchemas = [];

    await Promise.all(
        catalog.map(async schema => {
            const groups = new Set(tokenize(schema.name).concat(tokenize(schema.description)));

            groups.forEach(group => {
                let category = categorizedSchemas.find(cat => cat.name === group);

                if (!category) {
                    category = { name: group, schemas: [] };
                    categorizedSchemas.push(category);
                }

                category.schemas.push({ name: schema.name, url: schema.url });
            });
        })
    );

    return categorizedSchemas.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Tokenizes the input string and returns an array of tokens.
 *
 * @param {string} input - The input string to tokenize
 * @return {Array} An array of tokens
 */
function tokenize(input) {
    return input.split(/\W+/).filter(Boolean);
}

/**
 * Finds the closest matches for an input among the existing categories.
 *
 * @param {string} input - The input to find matches for
 * @param {Array} categories - The existing categories
 * @return {Array} The closest matches
 */
function findClosestMatches(input, categories) {
    const inputTokens = tokenize(input);

    // Find the closest matches using Levenshtein distance
    const closestMatches = categories.map(category => {
        const categoryTokens = tokenize(category);

        // Calculate the total distance between inputTokens and categoryTokens
        const dist = inputTokens.reduce((totalDistance, inputToken) => {
            const closestToken = categoryTokens.reduce((closest, categoryToken) => {
                const currentDistance = distance(inputToken.toLowerCase(), categoryToken.toLowerCase());
                return currentDistance < closest.distance ? { distance: currentDistance, token: categoryToken } : closest;
            }, { distance: Infinity, token: null });

            return totalDistance + closestToken.distance;
        }, 0);

        return { category, distance: dist };
    });

    // Sort by distance and return the category names
    return closestMatches
        .filter(match => match.distance <= input.length)
        .sort((a, b) => a.distance - b.distance)
        .map(match => match.category);
}

/**
 * Finds schemata based on input using inquirer-autocomplete.
 *
 * @param {string} input - The input to search schemata for.
 * @param {Array} categorizedSchemas - The array of categorized schemata.
 * @return {Array} The array of filtered schemata.
 */
function findSchema(input, categorizedSchemas) {
    if (!input) {
        return categorizedSchemas.map(schema => schema.name);
    }

    const allCategories = categorizedSchemas.map(schema => schema.name);
    const closestMatches = findClosestMatches(input, allCategories);

    return closestMatches;
}

/**
 * Fetches the schema from the schema store using autocomplete to select an entity.
 *
 * @return {Object} The selected schema object.
 */
async function fetchSchemaFromSchemaStore() {

    const { default: autocomplete } = await import(
        'inquirer-autocomplete-standalone'
    );

    const categorizedSchemas = await categorizeSchemas();

    const answer = await autocomplete({
        message: 'Which group would you want to download?',
        source: async (input) => {
            const filteredEntities = await findSchema(input, categorizedSchemas)
            return filteredEntities.map(schema => {
                return {
                    value: schema,
                    description: `${schema} selected`
                }
            })
        }
    });

    const result = categorizedSchemas.find(schema => schema.name === answer);

    console.log(`${answer} has ${result.schemas.length} ${result.schemas.length === 1 ? 'schema' : 'schemata'}.`);

    return result;
}

module.exports = {
    categorizeSchemas,
    findSchema,
    fetchSchemaFromSchemaStore
}