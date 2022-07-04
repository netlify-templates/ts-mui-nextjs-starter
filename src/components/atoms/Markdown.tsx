import { FC } from 'react';
import MarkdownToJsx from 'markdown-to-jsx';
import type * as types from 'types';

export type Props = { text: string; className?: string } & types.StackbitFieldPath;

export const Markdown: FC<Props> = (props) => {
    const { text, className, 'data-sb-field-path': fieldPath } = props;

    return (
        <MarkdownToJsx options={{ forceBlock: true, forceWrapper: true }} className={className} data-sb-field-path={fieldPath}>
            {text}
        </MarkdownToJsx>
    );
};
