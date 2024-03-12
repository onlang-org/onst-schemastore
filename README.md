[npm]: https://www.npmjs.com/package/@onlang-org/onst-schemastore
[github]: https://github.com/onlang-org/onst-schemastore
[readme]: https://github.com/onlang-org/onst-schemastore/blob/main/README.md

<img src="https://raw.githubusercontent.com/rajatasusual/rajatasusual/master/onlang_shorthand.png" alt="onlang_shorthand" height="100">

# onst-schemastore

Fetch schemata from [SchemaStore](https://schemastore.org/) catalog interactively. The package fetches and categorises the catalog into searchable topics that can be fetched in groups. (eg. All AWS schemata can be downloaded from groups AWS or Amazon). The package can be used in typescript and JS projects as a module or used via standalone CLI command onst-ss. 

[![CodeQL](https://github.com/onlang-org/onst-schemastore/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/onlang-org/onst-schemastore/actions/workflows/github-code-scanning/codeql)
[![npm version](https://img.shields.io/npm/v/@onlang-org/onst-schemastore.svg)](https://www.npmjs.com/package/@onlang-org/onst-schemastore)
[![npm downloads](https://img.shields.io/npm/dm/@onlang-org/onst-schemastore.svg)](https://www.npmjs.com/package/@onlang-org/onst-schemastore)
[![license](https://img.shields.io/github/license/onlang-org/onst-schemastore.svg)](https://github.com/onlang-org/onst-schemastore/blob/main/LICENSE.md)
[![forks](https://img.shields.io/github/forks/onlang-org/onst-schemastore.svg)](https://github.com/onlang-org/onst-schemastore/network)

> Built for [ONLang](https://github.com/onlang-org/ONLang)

A utility library bundled with superfast CLI for categorizing [SchemaStore](https://schemastore.org/) catalog into entities and list them. The catalog is broken into different entities based on similarity using [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance) and [Spelling Distance](https://en.wikipedia.org/wiki/Spelling_distance). This is achieved by using the [fastest-levenshtein](https://www.npmjs.com/package/fastest-levenshtein) package. 

> The objective is to provide schema from many systems on the fly.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
    - [Fetch Schema From SchemaStore](#fetch-schema-from-schemastore)
    - [CLI usage](#cli-usage)
- [License](#license)
- [Contributing](#contributing)

## Installation

```bash
npm install -g @onlang-org/onst-schemastore
```

## Usage

### Fetch Schema From SchemaStore

```javascript
const { fetchSchemaFromSchemaStore } = require('@onlang-org/onst-schemastore');

async function exampleUsage() {
  
  try {
    const result = await fetchSchemaFromSchemaStore();
    console.log(`${answer} has ${result.schema.length} ${result.schema.length === 1 ? 'schema' : 'schemata'}.`);

    result.schema.forEach(schema => {
        console.log(`- ${schema.name} - ${schema.url}`);
    })

  } catch (error) {
    console.error(`Error fetching schema for ${schemaName}:`, error.message);
  }
}

exampleUsage();
```

### Search Schema
```javascript

const filteredEntities = await findSchema(input, categorizedSchemas)
  return filteredEntities.map(schema => {
      return {
        value: schema,
        description: `${schema} selected`
      }
  })

```

### CLI usage
```
> onst-ss

> ? Which entity would you want to download? AWS

> AWS has 4 schemata.
  - AWS CDK cdk.json - https://json.schemastore.org/cdk.json
  - AWS CloudFormation - https://raw.githubusercontent.com/awslabs/goformation/master/schema/cloudformation.schema.json
  - AWS CloudFormation Serverless Application Model (SAM) - https://raw.githubusercontent.com/aws/serverless-application-model/main/samtranslator/schema/schema.json
  - AWS SAM CLI Samconfig - https://raw.githubusercontent.com/aws/aws-sam-cli/master/schema/samcli.json

```

## License

Copyright (c) 2024 ONLang.org <https://github.com/onlang-org> (rajatasusual <https://github.com/rajatasusual>)
Read more about the [license](https://github.com/onlang-org/onst-schemastore/blob/main/LICENSE.md).

## Contributing

Thank you for considering contributing to @onlang-org/onst-schemastore! Your contributions help improve the functionality and usability of this tool.
For more details, please refer to [CONTRIBUTING.md](CONTRIBUTING.md).
