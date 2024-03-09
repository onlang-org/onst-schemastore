#!/usr/bin/env node

const { categorizeSchemas, findSchema } = require('./main');

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
        message: 'Which entity would you want to download?',
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

    console.log(`${answer} has ${result.schema.length} ${result.schema.length === 1 ? 'schema' : 'schemata'}.`);

    result.schema.forEach(schema => {
        console.log(`- ${schema.name} - ${schema.url}`);
    })

}

fetchSchemaFromSchemaStore();