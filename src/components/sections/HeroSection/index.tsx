import * as React from 'react';
import type * as types from 'types';
import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';

import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';

export type Props = types.HeroSection & types.StackbitFieldPath;

export const HeroSection: React.FC<Props> = (props) => {
    const { title, subtitle, text, image, actions = [], 'data-sb-field-path': fieldPath } = props;
    const hasTextContent = !!title || !!subtitle || !!text || actions.length > 0;

    return (
        <MuiBox sx={{ py: { xs: 6, sm: 10 } }} data-sb-field-path={fieldPath}>
            <MuiGrid container spacing={4}>
                {hasTextContent && (
                    <MuiGrid item xs={12} md={image?.url ? 6 : 12}>
                        {title && (
                            <MuiTypography component="h1" variant="h2" color="text.primary" data-sb-field-path=".title">
                                {title}
                            </MuiTypography>
                        )}
                        {subtitle && (
                            <MuiTypography component="p" variant="h5" color="text.primary" sx={{ ...(!!title && { mt: 1 }) }} data-sb-field-path=".subtitle">
                                {subtitle}
                            </MuiTypography>
                        )}
                        {text && (
                            <MuiTypography component="div" color="text.secondary" maxWidth="md">
                                <Markdown text={text} data-sb-field-path=".text" />
                            </MuiTypography>
                        )}
                        {actions.length > 0 && (
                            <MuiStack
                                sx={{ ...(!!(title || subtitle || text) && { mt: 4 }) }}
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                                flexWrap="wrap"
                                data-sb-field-path=".actions"
                            >
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        {...action}
                                        sx={{
                                            mr: 2,
                                            mb: 2
                                        }}
                                        data-sb-field-path={`.${index}`}
                                    />
                                ))}
                            </MuiStack>
                        )}
                    </MuiGrid>
                )}
                {image?.url && (
                    <MuiGrid item xs={12} md={hasTextContent ? 6 : 12}>
                        <MuiBox
                            component="img"
                            sx={{
                                height: 'auto',
                                maxWidth: '100%',
                                width: '100%'
                            }}
                            alt={image?.altText}
                            src={image?.url}
                            data-sb-field-path=".image .image.url#@src .image.altText#@alt"
                        />
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiBox>
    );
};
