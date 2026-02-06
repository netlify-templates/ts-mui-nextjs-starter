import { FC } from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import type * as types from 'types';

export type Props = { text: string; className?: string };

export const Markdown: FC<Props> = (props) => {
    const { text, className } = props;

    return (
        <MarkdownToJsx options={{ forceBlock: true, forceWrapper: true }} className={className}>
            {text}
        </MarkdownToJsx>
    );
};
