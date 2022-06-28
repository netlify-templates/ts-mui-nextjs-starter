import * as React from 'react';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiCard from '@mui/material/Card';
import MuiCardActions from '@mui/material/CardActions';
import MuiCardContent from '@mui/material/CardContent';
import MuiCardMedia from '@mui/material/CardMedia';
import MuiGrid from '@mui/material/Grid';
import MuiTypography from '@mui/material/Typography';

export type Props = types.CardsSection & types.StackbitFieldPath;

export const CardsSection: React.FC<Props> = (props) => {
    const { title, subtitle, items = [], 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiBox sx={{ py: { xs: 6, sm: 10 } }} data-sb-field-path={fieldPath}>
            {title && (
                <MuiTypography component="h2" variant="h2" align="center" color="text.primary" data-sb-field-path=".title">
                    {title}
                </MuiTypography>
            )}
            {subtitle && (
                <MuiTypography component="p" variant="h5" align="center" color="text.primary" sx={{ ...(!!title && { mt: 1 }) }} data-sb-field-path=".subtitle">
                    {subtitle}
                </MuiTypography>
            )}
            {items.length > 0 && (
                <MuiGrid container spacing={4} sx={{ ...(!!(title || subtitle) && { pt: 6 }) }} data-sb-field-path=".items">
                    {items.map((item, index) => (
                        <CardsSectionItem key={index} {...item} titleTag={title ? 'h3' : 'h2'} data-sb-field-path={`.${index}`} />
                    ))}
                </MuiGrid>
            )}
        </MuiBox>
    );
};

const CardsSectionItem: React.FC<types.Card & types.StackbitFieldPath & { titleTag?: 'h3' | 'h2' }> = (props) => {
    const { title, text, image, actions = [], titleTag = 'h3', 'data-sb-field-path': fieldPath } = props;
    return (
        <MuiGrid item xs={12} sm={6} md={4}>
            <MuiCard sx={{ height: '100%' }} data-sb-field-path={fieldPath}>
                {image?.url && (
                    <MuiCardMedia component="img" image={image.url} alt={image.altText} data-sb-field-path=".image .image.url#@src .image.altText#@alt" />
                )}
                {(title || text) && (
                    <MuiCardContent>
                        {title && (
                            <MuiTypography component={titleTag} variant="h5" color="text.primary" data-sb-field-path=".title">
                                {title}
                            </MuiTypography>
                        )}
                        {text && (
                            <MuiTypography component="div" color="text.secondary">
                                <Markdown text={text} data-sb-field-path=".text" />
                            </MuiTypography>
                        )}
                    </MuiCardContent>
                )}
                {actions.length > 0 && (
                    <MuiCardActions data-sb-field-path=".actions">
                        {actions.map((action, index) => (
                            <Button key={index} {...action} data-sb-field-path={`.${index}`} />
                        ))}
                    </MuiCardActions>
                )}
            </MuiCard>
        </MuiGrid>
    );
};
