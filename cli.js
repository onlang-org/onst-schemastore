#!/usr/bin/env node

const { fetchSchemaFromSchemaStore } = require('./main');

async function main() {

    const result = await fetchSchemaFromSchemaStore();
    
    result.schemas.forEach(schema => {
        console.log(`- ${schema.name} - ${schema.url}`);
    })

}

main();