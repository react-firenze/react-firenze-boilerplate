import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router';

import About from '../../About';

test('About should match snapshot', () => {
  const component = renderer.create(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
  const tree = component.toJSON();

  expect(tree).toMatchSnapshot();
});
