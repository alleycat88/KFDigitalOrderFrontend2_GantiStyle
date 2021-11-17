import Header from './header';
import Footer from './footer';
import { CartDrawer } from 'containers/drawer/drawer';
import { DrawerBottom } from 'containers/drawer/drawer-bottom';

const Layout = (props) => (
  <main
    className="relative min-h-screen flex-grow"
    style={{
      minHeight: '-webkit-fill-available',
      WebkitOverflowScrolling: 'touch',
      ...props.style,
    }}
  >
    {/* <Drawer /> */}
    <Header isSearchbarHidden={props.isSearchbarHidden} isCartIconHidden={props.isCartIconHidden} />
    <div className="flex flex-col w-full h-full min-h-screen flex-grow">
      <div className="pt-90px px-3 pb-50px flex-auto md:px-35px" style={{backgroundColor: '#F2F3F7'}}>
        {props.children}
      </div>
      <Footer />
    </div>
    <CartDrawer />
    <DrawerBottom />
  </main>
);

export default Layout;
