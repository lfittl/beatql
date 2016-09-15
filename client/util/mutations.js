import { forEach, partial } from 'lodash';
import { graphql } from 'react-apollo';

export function withMutations(component, mutations) {
  let result = component;

  forEach(mutations, (v, k) => {
    result = graphql(v.gql, {
      props: ({ mutate }) => ({
        [k]: partial(v.prop, mutate),
      }),
    })(result);
  });

  return result;
}
