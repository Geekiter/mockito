import React, { FC } from 'react';
import {
    Box, ColorSwatch, Group, useMantineTheme,
} from '@mantine/core';
import { THeadersProfileStatus } from '../../../../../../types';

interface ProfileLabelProps {
    name: string
    status: THeadersProfileStatus
}

export const ProfileLabel: FC<ProfileLabelProps> = ({ name, status }) => {
    const theme = useMantineTheme();

    return (
        <Group
            wrap="nowrap"
            title={`\u914d\u7f6e\u6587\u4ef6\u300a${name}\u300b\u72b6\u6001\uff1a${status === 'enabled' ? '\u5df2\u542f\u7528' : '\u5df2\u7981\u7528'}`}
            gap="0.4rem"
        >
            <Box>{name}</Box>
            <ColorSwatch
                color={status === 'enabled' ? theme.colors.green[6] : theme.colors.gray[6]}
                size={8}
            />
        </Group>
    );
};
