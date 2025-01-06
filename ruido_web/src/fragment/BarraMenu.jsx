import React, { useState } from 'react';
import { Navbar, Nav, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../logo.png';

const BarraMenu = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    return (
        <>
            <Navbar expand="lg" variant="fondo" className="navbar navbar-expand-lg">
                <div className='container-fluid'>
                    <img src={logo} alt="logo" style={{ height: '3rem' }} />
                    <Navbar.Brand className="navbar-brand" href="/">MONITOREO DE RUIDO</Navbar.Brand>
                    <Navbar className="navbar-toggler fas fa-bars" aria-controls="offcanvasNavbar" onClick={() => setShowOffcanvas(!showOffcanvas)} />
                    <div className="collapse navbar-collapse">
                        <NavLink classNameNav="navbar-nav ms-auto mb-2 mb-lg-0" />
                    </div>
                    <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="end" target="#offcanvasNavbar">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>OPCIONES</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="offcanvas-body">
                            <NavLink classNameNav="navbar-nav justify-content-end flex-grow-1 pe-3" />
                        </Offcanvas.Body>
                    </Offcanvas>
                </div>
            </Navbar>
        </>
    );
};

const NavLink = ({ classNameNav }) => {
    return (
        <Nav className={classNameNav}>
            <Nav.Link href="/" style={navLinkStyle}><i className="fas fa-chart-column"></i> Gráficas</Nav.Link>
            <Nav.Link href="/historial" style={navLinkStyle}><i className="fas fa-folder-open"></i> Historial</Nav.Link>
        </Nav>
    );
};

const navLinkStyle = {
    marginRight: '10px',
};

export default BarraMenu;
