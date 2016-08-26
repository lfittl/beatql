import {compact, uniq, flatMap, map, invert} from 'lodash';
import DataLoader from 'dataloader';

export function loadOne(db, model, id, info) {
  let fields = determineFields(model, info);

  return new Promise(function(resolve, reject) {
    if (!fields) {
      fields = new Array();
    }
    fields.push(model.primaryKey);
    db.any("SELECT " + fields.join(', ') + " FROM " + model.tableName + " WHERE " + model.primaryKey + " = $1", [id])
      .then(function (data) {
        resolve(new model(data[0]));
      })
      .catch(function (error) {
        console.error(error);
        reject(error);
      });
  });
}

export function loadMany(db, model) {
  return new DataLoader(idsAndFields => {
    var ids = flatMap(idsAndFields, i => i[0]);
    var fields = uniq(flatMap(idsAndFields, i => i[1]));

    fields.push(model.primaryKey);
    fields.push(model.foreignKey);

    return new Promise(function(resolve, reject) {
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

// https://github.com/graphql/graphql-js/issues/96#issuecomment-138134315
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
        // We could do a more creative mapping here, but for now just ignore "id" and nested types
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
