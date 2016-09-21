/*!
 Many documentation snippets below are taken verbatim from the JSON Schema spec:
 http://json-schema.org/documentation.html
 */

/**
 Returns one of the seven primitive JSON schema types, or 'undefined':
 array, boolean, integer, number, null, object, string, undefined
 (Except it does not actually ever return 'integer'.)
 */
function primitiveType (value) {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }
  if (Array.isArray(value)) {
    return 'array';
  }
    // TODO: Ensure that the only other possibilities are 'object', 'boolean', 'number', and 'string'
  return typeof value;
}
function typeMatches (instanceType, schemaType) {
  if (schemaType === undefined) {
    return false;
  }
  else if (Array.isArray(schemaType)) {
    return schemaType.indexOf(instanceType) > -1;
  }
  else {
    return instanceType === schemaType;
  }
}
/**
 Assumes that schemaType does not already equal or include instanceType.
 */
function addType (instanceType, schemaType) {
  if (schemaType === undefined) {
        // if we are adding a type to an empty schema, its type will be undefined
    return instanceType;
  }
  else if (Array.isArray(schemaType)) {
    return schemaType.concat(instanceType);
  }
  else {
    return [schemaType, instanceType];
  }
}
/**
 union takes a potentially insufficiently general schema, and an instance that
 the schema must be extended to include, and returns a new schema that matches
 everything the original schema did, as well as the new instance.
 */
function union (schema, instance) {
  var type = primitiveType(instance);
  if (type == 'undefined') {
        // TODO: handle this case. What should I do with an array of values like
        // `['laugh', 100, undefined]`? change all of the schemas to optional?
        // schemas.forEach(schema => schema.optional = true);
    return schema;
  }
  else if (type == 'object') {
        // TODO: clone the schema instead of mutating it
    var objectSchema = schema;
    if (!typeMatches(type, objectSchema.type)) {
            // the schema does not currently handle objects, so we need to add the type
      objectSchema.type = addType(type, objectSchema.type);
            // and the appropriate field
      objectSchema.properties = {};
    }
        // now we can merge the object's fields
    for (var key in instance) {
            // should we do a `hasOwnProperty` check?
      objectSchema.properties[key] = union(objectSchema.properties[key] || {}, instance[key]);
    }
    return objectSchema;
  }
  else if (type == 'array') {
        // TODO: support tuple-type arrays?
        // TODO: clone the existing schema
    var arraySchema_1 = schema;
    if (!typeMatches(type, arraySchema_1.type)) {
            // the schema does not currently handle arrays, so we need to add the type
      arraySchema_1.type = addType(type, arraySchema_1.type);
            // and the appropriate field
      arraySchema_1.items = {};
    }
        // now we can merge the array's schema
    instance.forEach(function (item) {
      arraySchema_1.items = union(arraySchema_1.items, item);
    });
    return arraySchema_1;
  }
  else {
    if (!typeMatches(type, schema.type)) {
      schema.type = addType(type, schema.type);
    }
        // only the nested types, object and array, require merging. otherwise, nothing needs to be done.
    return schema;
  }
}

function generalizeFrom () {
  var instances = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    instances[_i] = arguments[_i];
  }
  return instances.reduce(function (schema, instance) {
    return union(schema, instance);
  }, {});
}

module.exports = generalizeFrom;
