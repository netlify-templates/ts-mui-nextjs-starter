import { FC } from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import { pickDataAttrs, StackbitFieldPath } from '@stackbit/annotations';

export type Props = { text: string; className?: string } & StackbitFieldPath;

export const Markdown: FC<Props> = ({ text, className, ...rest }) => {
    return (
        <MarkdownToJsx options={{ forceBlock: true, forceWrapper: true }} className={className} {...pickDataAttrs(rest)}>
            {text}
        </MarkdownToJsx>
    );
};
