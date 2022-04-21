import React from 'react';
import styled from 'styled-components';

const NavbarWrapper = styled.div`
  width: 100%;
  background-color: black;
  display: flex;
  flex-flow: row;
`;

const LogoWrapper = styled.div`
  font-size: 2em;
  padding: 1em 1.5em;
`;

const LinkWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: flex-end;
`;

const Link = styled.div`
  padding: 1em 2em;
  font-size: 1.5em;
`;

const Navbar = (props) => {
  return (
    <NavbarWrapper>
      {props.logo && <LogoWrapper>{props.logo}</LogoWrapper>}
      {props.links.length > 0 && (
        <LinkWrapper>
          {props.links.map((linkObject) => (
            <Link key={linkObject.text}>{linkObject.text}</Link>
          ))}
        </LinkWrapper>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
