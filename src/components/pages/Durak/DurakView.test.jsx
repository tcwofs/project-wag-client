import { createMount } from '@material-ui/core/test-utils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import DurakView from './DurakView';

let mount;
let wrapper;
let location;

describe('<DurakViFew />', () => {
  beforeEach(() => {
    mount = createMount();
    location = {
      state: {
        username: 'Test',
        roomname: 'Room',
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    wrapper = mount(<DurakView location={location} />);
  });

  test('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
