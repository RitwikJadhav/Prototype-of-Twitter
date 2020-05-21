import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProfileLikes from '.././components/profile-module/profileLikes';
import renderer from 'react-test-renderer';

Enzyme.configure({ adpater: new Adapter() });

it('should render Profile Page correctly', () => {
    const component = renderer.create(<ProfileLikes />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});