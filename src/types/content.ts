export type AllTypes = DocumentTypes | NestedTypes;
export type AllTypeNames = DocumentTypeNames | NestedTypeNames;

export type DocumentTypes = Config | Page ;
export type DocumentTypeNames =
    | 'Config'
    | 'Page'

export type NestedTypes =
    | Button
    | Card
    | CardsSection
    | Footer
    | Header
    | HeroSection
    | Image
    | Link;

export type NestedTypeNames =
    | 'Button'
    | 'Card'
    | 'CardsSection'
    | 'Footer'
    | 'Header'
    | 'HeroSection'
    | 'Image'
    | 'Link';

export type Sections =
    | CardsSection
    | HeroSection;

/** Document types */
export type Config = {
    __id: string;
    __url: string | null;
    type: 'Config';
    favicon?: string;
    header?: Header;
    footer?: Footer;
};

export type Page = {
    __id: string;
    __url: string;
    type: 'Page';
    title: string;
    sections?: Sections[];
    body?: string;
};

/** Nested types */
export type Button = {
    type: 'Button';
    label: string;
    url: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'inherit' | 'primary' | 'secondary';
};

export type Card = {
    type: 'Card';
    title?: string;
    text?: string;
    image?: Image;
    actions?: Button[];
};

export type CardsSection = {
    type: 'CardsSection';
    title?: string;
    subtitle?: string;
    items?: Card[];
};

export type Footer = {
    type: 'Footer';
    copyrightText?: string;
    navLinks?: Link[];
};

export type Header = {
    type: 'Header';
    title?: string;
    navLinks?: Link[];
};

export type HeroSection = {
    type: 'HeroSection';
    title?: string;
    subtitle?: string;
    text?: string;
    actions?: Button[];
    image?: Image ;
};

export type Image = {
    type: 'Image';
    url?: string;
    altText?: string;
};

export type Link = {
    type: 'Link';
    label: string;
    url: string;
    underline?: 'always' | 'hover' | 'none';
    color?: 'inherit' | 'primary' | 'secondary';
};
