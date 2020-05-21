import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Memberships from '.././components/lists-module/memberships';
import renderer from 'react-test-renderer';

Enzyme.configure({ adpater: new Adapter() });

it('should render Membership Page correctly', () => {
    const component = renderer.create(<Memberships />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});