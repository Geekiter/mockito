import React, { FC, useMemo } from 'react';
import {
    Button,
    Divider,
    Grid,
    Group,
    NumberInput,
    SegmentedControl,
    Select,
    Tabs,
    Text,
    Textarea,
} from '@mantine/core';
import { nanoid } from 'nanoid';
import { isNotEmpty } from '@mantine/form';
import { HttpMethodType, TMock } from '~/types';
import { useStore } from '~/hooks/useStore';
import { UrlInput, type UrlInputProps } from '~/components/UrlInput';
import { Response } from './components/Response';
import { Headers } from './components/Headers';
import { MockFormProvider, useMockForm } from './context';
import styles from './MockForm.module.css';

type MockFormProps = {
    mock?: TMock;
    onClose: () => void;
    onSubmit: (mock: TMock) => void;
};

const initialValues: TMock = {
    id: '',
    url: '',
    urlType: 'url',
    httpMethod: HttpMethodType.GET,
    httpStatusCode: 200,
    delay: 0,
    responseType: 'json',
    responseHeaders: [],
    isActive: true,
};

const maxDelay = 999999;
const httpMethods = Object.values(HttpMethodType);
const headerKeyRegexp = /^[a-zA-Z0-9_-]+$/;
const headerKeyError = '仅支持英文字母、数字及 "-" "_" 符号';

export const MockForm: FC<MockFormProps> = ({ mock, onClose, onSubmit }) => {
    const [groups] = useStore('mockGroups');

    const form = useMockForm({
        initialValues: mock ?? {
            ...initialValues,
            id: nanoid(),
        },
        validate: {
            url: isNotEmpty('请输入 URL'),
            responseHeaders: {
                key: (value) => (!value.match(headerKeyRegexp) ? headerKeyError : null),
            },
        },
    });

    const handleChangeStatus = (value: string): void => {
        if (value === 'enabled') {
            form.setFieldValue('isActive', true);
        } else {
            form.setFieldValue('isActive', false);
        }
    };

    const handleChangeUrlType: UrlInputProps['onChangeValueType'] = (valueType) => {
        form.setFieldValue('urlType', valueType);
    };

    const groupsOptions = useMemo(() => {
        return (groups ?? []).map((g) => ({
            value: g.id,
            label: g.name,
        }));
    }, [groups]);

    return (
        <MockFormProvider form={form}>
            <form
                className={styles.form}
                onSubmit={form.onSubmit(onSubmit)}
            >
                <Group justify="space-between">
                    <Text>{mock?.id ? '编辑 Mock' : '新增 Mock'}</Text>

                    <Group
                        justify="right"
                        gap="xs"
                    >
                        <Button
                            variant="subtle"
                            color="gray"
                            size="xs"
                            onClick={onClose}
                        >
                            取消
                        </Button>

                        <Button
                            type="submit"
                            size="xs"
                        >
                            保存
                        </Button>
                    </Group>
                </Group>

                <Divider mb="xs" />

                <Grid align="flex-start">
                    <Grid.Col span={8}>
                        <UrlInput
                            valueType={form.values.urlType}
                            onChangeValueType={handleChangeUrlType}
                            {...form.getInputProps('url')}
                        />
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <Text
                            size="xs"
                            mb="0.3rem"
                        >
                            状态
                        </Text>

                        <SegmentedControl
                            size="xs"
                            fullWidth
                            color={form.values.isActive ? 'blue' : 'gray'}
                            value={form.values.isActive ? 'enabled' : 'disabled'}
                            data={[
                                {
                                    label: '已启用',
                                    value: 'enabled',
                                },
                                {
                                    label: '已禁用',
                                    value: 'disabled',
                                },
                            ]}
                            onChange={handleChangeStatus}
                        />
                    </Grid.Col>
                </Grid>

                <Grid>
                    <Grid.Col span={4}>
                        <Select
                            required
                            label="请求方法"
                            data={httpMethods}
                            size="xs"
                            {...form.getInputProps('httpMethod')}
                        />
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <NumberInput
                            required
                            label="响应状态码"
                            min={100}
                            max={599}
                            size="xs"
                            {...form.getInputProps('httpStatusCode')}
                        />
                    </Grid.Col>

                    <Grid.Col span={4}>
                        <NumberInput
                            label="延迟 (ms)"
                            min={0}
                            max={maxDelay}
                            size="xs"
                            {...form.getInputProps('delay')}
                        />
                    </Grid.Col>
                </Grid>

                <Select
                    label="分组"
                    size="xs"
                    data={groupsOptions}
                    searchable
                    disabled={groups?.length === 0}
                    {...form.getInputProps('groupId')}
                />

                <Tabs
                    mt="xs"
                    variant="outline"
                    className={styles.tabs}
                    defaultValue="response"
                    styles={() => ({
                        panel: {
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflowY: 'auto',
                        },
                    })}
                >
                    <Tabs.List>
                        <Tabs.Tab
                            value="response"
                            className={styles.tab}
                        >
                            响应体
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="headers"
                            className={styles.tab}
                        >
                            响应头
                        </Tabs.Tab>
                        <Tabs.Tab
                            value="comments"
                            className={styles.tab}
                        >
                            备注
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel
                        value="response"
                        pt="xs"
                    >
                        <Response />
                    </Tabs.Panel>

                    <Tabs.Panel
                        value="headers"
                        pt="xs"
                    >
                        <Headers />
                    </Tabs.Panel>

                    <Tabs.Panel
                        value="comments"
                        pt="xs"
                    >
                        <Textarea
                            size="xs"
                            autosize
                            minRows={5}
                            {...form.getInputProps('comment')}
                        />
                    </Tabs.Panel>
                </Tabs>
            </form>
        </MockFormProvider>
    );
};
