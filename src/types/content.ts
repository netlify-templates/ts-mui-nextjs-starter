export type Metadata = {
    id: string;
    urlPath: string;
    relSourcePath: string;
};

export type AllTypes = DocumentTypes | NestedTypes;
export type AllTypeNames = DocumentTypeNames | NestedTypeNames;

export type DocumentTypes = Config | PageLayout ;
export type DocumentTypeNames =
    | 'Config'
    | 'PageLayout'

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
    /** File path relative to `contentDirPath` */
    __metadata: Metadata;
    type: 'Config';
    favicon?: string;
    header?: Header;
    footer?: Footer;
};

export type PageLayout = {
    /** File path relative to `contentDirPath` */
    __metadata: Metadata;
    type: 'PageLayout';
    title: string;
    sections?: Sections[];
};

/** Nested types */
export type Button = {
    /** File path relative to `contentDirPath` */
    type: 'Button';
    label: string;
    url: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'inherit' | 'primary' | 'secondary';
};

export type Card = {
    /** File path relative to `contentDirPath` */
    type: 'Card';
    title?: string;
    text?: string;
    image?: Image;
    actions?: Button[];
};

export type CardsSection = {
    /** File path relative to `contentDirPath` */
    type: 'CardsSection';
    title?: string;
    subtitle?: string;
    items?: Card[];
};

export type Footer = {
    /** File path relative to `contentDirPath` */
    type: 'Footer';
    copyrightText?: string;
    navLinks?: Link[];
};

export type Header = {
    /** File path relative to `contentDirPath` */
    type: 'Header';
    title?: string;
    navLinks?: Link[];
};

export type HeroSection = {
    /** File path relative to `contentDirPath` */
    type: 'HeroSection';
    title?: string;
    subtitle?: string;
    text?: string;
    actions?: Button[];
    image?: Image ;
};

export type Image = {
    /** File path relative to `contentDirPath` */
    type: 'Image';
    url?: string;
    altText?: string;
};

export type Link = {
    /** File path relative to `contentDirPath` */
    type: 'Link';
    label: string;
    url: string;
    underline?: 'always' | 'hover' | 'none';
    color?: 'inherit' | 'primary' | 'secondary';
};
