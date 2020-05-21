import React from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ListTweets from '.././components/lists-module/listTweets';
import renderer from 'react-test-renderer';

Enzyme.configure({ adpater: new Adapter() });

it('should render List Tweets Page correctly', () => {
    const component = renderer.create(<ListTweets />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});