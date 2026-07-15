import React from 'react'
import { Footer as FlowbiteFooter, FooterBrand, FooterLink, FooterLinkGroup, FooterDivider, FooterCopyright } from 'flowbite-react'
type Props = {}

export function Footer({ }: Props) {
    return (
        <FlowbiteFooter container>
            <div className="w-full text-center">
                <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                    <FooterBrand
                        href="/"
                        src="/carousel_images/Oura_Navbar_Logo_2.png"
                        alt="Oura Logo"
                        name="Oura-Shop"
                    />
                    <FooterLinkGroup>
                        <FooterLink href="/about">About</FooterLink>
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Licensing</FooterLink>
                        <FooterLink href="/contact">Contact</FooterLink>
                    </FooterLinkGroup>
                </div>
                <FooterDivider />
                <FooterCopyright href="#" by="Oura™" year={2026} />
            </div>
        </FlowbiteFooter>
    )
}

