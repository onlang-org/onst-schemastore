const natural = require('natural');
// Initialize the natural library
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

const {closest} = require('fastest-levenshtein')

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
 * Tokenizes the input name, performs stemming and filtering, uses fuzzy matching to find best-matching group for each word, and filters out matches below a certain similarity threshold.
 *
 * @param {string} name - The input name to process
 * @return {Array} An array of matched groups with duplicates removed
 */
function getGroups(name) {
    const nameWords = tokenizer.tokenize(name.toLowerCase()).map(word => stemmer.stem(word)).filter(word => word.length > 1);

    // Combine and filter out duplicates
    const words = Array.from(new Set([...nameWords]));

    // Use fuzzy matching to find the best-matching group for each word
    const bestMatches = words.map(word =>
        closest(word, words)
    );

    return Array.from(new Set(bestMatches)); // Remove duplicates
}

/**
 * Asynchronously categorizes schemas based on groups.
 *
 * @return {Array} The categorized schemas sorted by name.
 */
async function categorizeSchemas() {

    const catalog = await getCatalog();
    const categorizedSchemas = [];

    catalog.forEach(async schema => {
        const groups = await getGroups(schema.name);

        groups.forEach(group => {
            let category = categorizedSchemas.find(cat => cat.name === group);

            if (!category) {
                category = { name: group, schema: [] };
                categorizedSchemas.push(category);
            }

            category.schema.push({ name: schema.name, url: schema.url });
        });
    });

    return categorizedSchemas.sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
    categorizeSchemas
}