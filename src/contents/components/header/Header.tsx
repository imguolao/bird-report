import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from '@nextui-org/react';
import Logo from './Logo';
import { IFRAME_ID } from '../../const';

export default function Header() {

  const handleClose = () => {
    window.parent.postMessage({
      type: IFRAME_ID,
      open: false,
    }, '*');
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Logo />
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <span className="text-[20px]">Bird Report Query</span>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button
          color="default"
          variant="flat"
          onClick={handleClose}>
          CLOSE
        </Button>
      </NavbarContent>
    </Navbar>
  )
}
