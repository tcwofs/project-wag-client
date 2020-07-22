import { createMount } from '@material-ui/core/test-utils';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import RoomView from './RoomView';

let mount;
let wrapper;
let location;

describe('<RoomView />', () => {
  beforeEach(() => {
    mount = createMount();
    location = {
      state: {
        username: 'Test',
        roomname: 'Room',
        service: {
          name: 'Service',
          type: 'Type',
        },
      },
    };
  });

  afterEach(() => {
    mount.cleanUp();
  });

  it('should work', () => {
    wrapper = mount(<RoomView location={location} />);
  });

  test('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
