import {compact, uniq, flatMap, map, invert, values} from 'lodash';
import DataLoader from 'dataloader';

export function loadOne(db, model, id, info) {
  return new Promise(function(resolve, reject) {
    let fields = determineFields(model, info);
    if (!fields) {
      fields = new Array();
    }
    fields.push(model.primaryKey);
    db.any("SELECT " + fields.join(', ') + " FROM " + model.tableName + " WHERE " + model.primaryKey + " = $1", [id])
    .then(data => {
      if (data.length == 0) {
        reject('Record not found');
      } else {
        resolve(new model(data[0]));
      }
    })
    .catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

export function createOne(db, model, attrs, info) {
  return new Promise((resolve, reject) => {
    let fields = determineFields(model, info);
    if (!fields) {
      fields = new Array();
    }
    fields.push(model.primaryKey);

    let queryResult = null;
    if (Object.keys(attrs).length == 0) {
      queryResult = db.one("INSERT INTO ${table~} DEFAULT VALUES RETURNING ${fields~}", {
        table: model.tableName, fields,
      })
    } else {
      const attrKeys = map(attrs, (_,k) => model.fieldToColumn[k]);
      const attrValues = values(attrs);

      queryResult = db.one("INSERT INTO ${table~}(${attrKeys~}) VALUES(${attrValues:csv}) RETURNING ${fields~}", {
        table: model.tableName, attrValues, attrKeys, fields,
      })
    }

    queryResult
    .then(result => {
      resolve(new model(result));
    })
    .catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

export function updateOne(db, model, id, attrs, info) {
  return new Promise((resolve, reject) => {
    const attrKeys = map(attrs, (_,k) => model.fieldToColumn[k]);
    const attrValues = values(attrs);

    db.query("UPDATE ${table~} SET (${attrKeys~}) = (${attrValues:csv}) WHERE ${idColumn~} = ${id}", {
      table: model.tableName, idColumn: model.primaryKey, id, attrValues, attrKeys,
    })
    .then(result => {
      loadOne(db, model, id, info)
      .then(record => resolve(record))
      .catch(error => reject(error));
    })
    .catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

export function deleteOne(db, model, id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM ${table~} WHERE ${idColumn~} = ${id}", { table: model.tableName, idColumn: model.primaryKey, id })
    .then(() => resolve({ id }))
    .catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

export function loadAll(db, model, info) {
  return new Promise(function(resolve, reject) {
    let fields = determineFields(model, info);
    if (!fields) {
      fields = new Array();
    }
    fields.push(model.primaryKey);
    db.any("SELECT ${fields~} FROM ${table~}", {
      fields: fields.join(', '), table: model.tableName,
    })
    .then(data => {
      resolve(map(data, d => new model(d)));
    })
    .catch(function (error) {
      console.error(error);
      reject(error);
    });
  });
}

export function loadMany(db, model) {
  return new DataLoader(idsAndFields => {
    return new Promise(function(resolve, reject) {
      var ids = flatMap(idsAndFields, i => i[0]);
      var fields = uniq(flatMap(idsAndFields, i => i[1]));

      fields.push(model.primaryKey);
      fields.push(model.foreignKey);

      db.any("SELECT " + fields.join(', ') + " FROM " + model.tableName + " WHERE " + model.foreignKey + " = ANY($1::uuid[])", [ids])
        .then(function (data) {
          var output = map(idsAndFields, i => {
            return map(data.filter((d) => d[model.foreignKey] == i[0]), record => new model(record));
          });
          resolve(output);
        })
        .catch(function (error) {
          console.error(error);
          reject(error);
        });
    });
  }, { cache: false });
}

export function loaderFirstPass(model, obj, info) {
  return [obj[invert(model.fieldToColumn)[model.foreignKey]], determineFields(model, info)];
}

function determineFields(model, info) {
  return compact(map(Object.keys(getFieldList(info)), f => model.fieldToColumn[f]));
}

// Heavily inspired by https://github.com/graphql/graphql-js/issues/96#issuecomment-138134315
function getFieldList(context, asts = context.fieldASTs) {
  if (!Array.isArray(asts)) asts = [asts];

  var selections = asts.reduce((selections, source) => {
    selections.push(...source.selectionSet.selections);
    return selections;
  }, []);

  return selections.reduce((list, ast) => {
    switch (ast.kind) {
      case 'Field':
        if (ast.name.value == 'edges' || ast.name.value == 'node') {
          return {
            ...list,
            ...getFieldList(context, ast)
          };
        }

        if (ast.selectionSet == null) {
          list[ast.name.value] = true;
        }
        return list;
      case 'InlineFragment':
        return {
          ...list,
          ...getFieldList(context, ast)
        };
      case 'FragmentSpread':
        return {
          ...list,
          ...getFieldList(context, context.fragments[ast.name.value])
        };
      default:
        throw new Error('Unsupported query selection');
    }
  }, {});
}
