import React, { ChangeEventHandler, FC } from 'react';
import { Group, SegmentedControl, Text, TextInput, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { type UrlType } from '~/types';

export type UrlInputProps = {
    valueType: UrlType;
    value?: string;
    onChange?: ChangeEventHandler;
    onChangeValueType: (value: UrlType) => void;
};

export const UrlInput: FC<UrlInputProps> = ({ value, valueType, onChange, onChangeValueType }) => {
    return (
        <>
            <TextInput
                label="URL"
                size="xs"
                value={value}
                required
                onChange={onChange}
            />

            <SegmentedControl
                size="xs"
                fullWidth
                mt="xs"
                value={valueType}
                data={[
                    { label: 'URL', value: 'url' },
                    { label: '正则', value: 'regexp' },
                    { label: '包含', value: 'contain' },
                ]}
                onChange={(v) => onChangeValueType(v as UrlType)}
            />

            {valueType === 'regexp' && (
                <Group
                    gap="xs"
                    mt="xs"
                >
                    <Tooltip
                        multiline
                        maw={400}
                        withArrow
                        position="bottom"
                        transitionProps={{ transition: 'scale-y' }}
                        label={
                            <div>
                                <Text
                                    size="xs"
                                    fw={600}
                                    mb="xs"
                                >
                                    常用正则示例：
                                </Text>
                                <Text size="xs">\/api\/v\d+\/.* — 匹配 /api/v1/… 等版本接口</Text>
                                <Text size="xs">.*\/users\/\d+.* — 匹配用户详情页</Text>
                                <Text size="xs">https?:\/\/.*\.example\.com.* — 匹配特定域名</Text>
                                <Text size="xs">.*\.(jpg|png|gif)$ — 匹配图片请求</Text>
                                <Text size="xs">.*\/(login|logout).* — 匹配登录/登出接口</Text>
                            </div>
                        }
                    >
                        <Group gap="xs">
                            <IconInfoCircle
                                size={16}
                                color="#9775fa"
                            />
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                正则帮助
                            </Text>
                        </Group>
                    </Tooltip>
                </Group>
            )}
        </>
    );
};
