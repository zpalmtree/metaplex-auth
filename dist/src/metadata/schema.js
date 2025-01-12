const fileSchema = {
  type: 'object',
  properties: {
    uri: { type: 'string' },
    type: { type: 'string' },
    cdn: { type: 'boolean', nullable: true },
  },
  required: ['uri', 'type'],
}
const attributeSchema = {
  type: 'object',
  properties: {
    trait_type: { type: 'string' },
    value: {
      anyOf: [{ type: 'string' }, { type: 'number' }],
    },
    display_type: {
      type: 'string',
      nullable: true,
    },
    max_value: {
      type: 'number',
      nullable: true,
    },
    trait_count: {
      type: 'number',
      nullable: true,
    },
  },
  required: ['trait_type', 'value'],
}
const creatorSchema = {
  type: 'object',
  properties: {
    address: { type: 'string' },
    share: { type: 'number' },
  },
  required: ['address', 'share'],
}
export const metadataSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    symbol: { type: 'string', nullable: true },
    description: { type: 'string', nullable: true },
    seller_fee_basis_points: { type: 'number', nullable: true },
    image: { type: 'string' },
    animation_url: { type: 'string', nullable: true },
    external_url: { type: 'string', nullable: true },
    attributes: {
      type: 'array',
      nullable: true,
      items: attributeSchema,
    },
    properties: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: fileSchema,
        },
        category: { type: 'string', nullable: true },
        creators: {
          type: 'array',
          items: creatorSchema,
          nullable: true,
        },
      },
      additionalProperties: true,
      required: ['files'],
    },
    collection: {
      type: 'object',
      nullable: true,
      properties: {
        name: { type: 'string' },
        family: { type: 'string' },
      },
      required: ['name', 'family'],
    },
  },
  required: ['name', 'image', 'properties'],
}
