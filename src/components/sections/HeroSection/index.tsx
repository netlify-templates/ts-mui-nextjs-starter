import * as React from 'react';
import { toFieldPath, pickDataAttrs } from '@stackbit/annotations';
import type * as types from 'types';

import MuiBox from '@mui/material/Box';
import MuiGrid from '@mui/material/Grid';
import MuiStack from '@mui/material/Stack';
import MuiTypography from '@mui/material/Typography';

import { Button } from '../../atoms/Button';
import { Markdown } from '../../atoms/Markdown';

export type Props = types.HeroSection;

export const HeroSection: React.FC<Props> = (props) => {
    const { title, subtitle, text, image, actions = [] } = props;
    const hasTextContent = !!title || !!subtitle || !!text || actions.length > 0;

    return (
        <MuiBox sx={{ py: { xs: 6, sm: 10 } }} {...pickDataAttrs(props)}>
            <MuiGrid container spacing={4}>
                {hasTextContent && (
                    <MuiGrid item xs={12} md={image?.url ? 6 : 12}>
                        {title && (
                            <MuiTypography component="h1" variant="h2" color="text.primary" {...toFieldPath('.title')}>
                                {title}
                            </MuiTypography>
                        )}
                        {subtitle && (
                            <MuiTypography component="p" variant="h5" color="text.primary" sx={{ ...(!!title && { mt: 1 }) }} {...toFieldPath('.subtitle')}>
                                {subtitle}
                            </MuiTypography>
                        )}
                        {text && (
                            <MuiTypography component="div" color="text.secondary" maxWidth="md">
                                <Markdown text={text} {...toFieldPath('.text')} />
                            </MuiTypography>
                        )}
                        {actions.length > 0 && (
                            <MuiStack
                                sx={{ ...(!!(title || subtitle || text) && { mt: 4 }) }}
                                direction="row"
                                alignItems="center"
                                justifyContent="flex-start"
                                flexWrap="wrap"
                                {...toFieldPath('.actions')}
                            >
                                {actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        {...action}
                                        {...toFieldPath(`.${index}`)}
                                        sx={{
                                            mr: 2,
                                            mb: 2
                                        }}
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
                            {...toFieldPath('.image', '.image.url#@src', '.image.altText#@alt')}
                        />
                    </MuiGrid>
                )}
            </MuiGrid>
        </MuiBox>
    );
};
