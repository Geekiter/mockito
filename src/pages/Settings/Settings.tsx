import React, { useMemo } from 'react';
import { Button, Stack, Switch, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useStore } from '~/hooks/useStore';
import { isEmpty } from '~/utils/isEmpty';
import { Header } from '~/components/Header';

export const Settings = () => {
    const [logs, setLogs] = useStore('logs');
    const [mocks, setMocks] = useStore('mocks');
    const [network, setNetworks] = useStore('network');
    const [headersProfiles, setHeadersProfiles] = useStore('headersProfiles');
    const [settings, setSettings] = useStore('settings');

    const isClearLogsDisabled = useMemo(() => logs === null || logs.length === 0, [logs]);
    const isClearMocksDisabled = useMemo(() => mocks === null || mocks.length === 0, [mocks]);
    const isClearNetworkDisabled = useMemo(() => network === null || network.length === 0, [network]);
    const isHeadersDisabled = useMemo(() => headersProfiles === null || isEmpty(headersProfiles), [headersProfiles]);

    const handleClearAllLogs = () => {
        modals.openConfirmModal({
            title: '确认清空所有日志？',
            children: <Text size="sm">所有站点的日志将被永久删除。</Text>,
            labels: { confirm: '清空日志', cancel: '取消' },
            confirmProps: { color: 'red', size: 'xs' },
            cancelProps: {
                size: 'xs',
                variant: 'subtle',
                color: 'gray',
            },
            onConfirm: () => setLogs([]),
        });
    };

    const handleClearAllMocks = () => {
        modals.openConfirmModal({
            title: '确认清空所有 Mock？',
            children: <Text size="sm">所有 Mock 将被永久删除。</Text>,
            labels: { confirm: '清空 Mock', cancel: '取消' },
            confirmProps: { color: 'red', size: 'xs' },
            cancelProps: {
                size: 'xs',
                variant: 'subtle',
                color: 'gray',
            },
            onConfirm: () => setMocks([]),
        });
    };

    const handleDeleteProfiles = () => {
        modals.openConfirmModal({
            title: '确认删除所有请求头配置？',
            children: <Text size="sm">所有请求头配置文件及其数据将被永久删除。</Text>,
            labels: { confirm: '删除', cancel: '取消' },
            confirmProps: { color: 'red', size: 'xs' },
            cancelProps: {
                size: 'xs',
                variant: 'subtle',
                color: 'gray',
            },
            onConfirm: () => setHeadersProfiles({}),
        });
    };

    const handleDeleteNetwork = () => {
        modals.openConfirmModal({
            title: '确认清空所有网络日志？',
            children: <Text size="sm">所有网络日志将被永久删除。</Text>,
            labels: { confirm: '删除', cancel: '取消' },
            confirmProps: { color: 'red', size: 'xs' },
            cancelProps: {
                size: 'xs',
                variant: 'subtle',
                color: 'gray',
            },
            onConfirm: () => setNetworks([]),
        });
    };

    const handleToggleNotifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) {
            return;
        }

        await setSettings({
            ...settings,
            showNotifications: e.target.checked,
        });
    };

    const handleToggleActiveStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) {
            return;
        }

        await setSettings({
            ...settings,
            showActiveStatus: e.target.checked,
        });
    };

    const handleToggleCommentDisplayMode = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) {
            return;
        }

        await setSettings({
            ...settings,
            commentDisplayMode: e.target.checked ? 'inline' : 'tooltip',
        });
    };

    if (!settings) {
        return null;
    }

    return (
        <>
            <Header
                title={
                    <Text
                        fz="sm"
                        fw={500}
                    >
                        设置
                    </Text>
                }
            />

            <Stack gap="xl">
                <div>
                    <Text
                        size="sm"
                        fw={500}
                    >
                        Mock 数据
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        所有站点的 Mock 数据
                    </Text>

                    <Button
                        mt="xs"
                        size="xs"
                        variant="light"
                        color="red"
                        rightSection={<IconTrash size={12} />}
                        disabled={isClearMocksDisabled}
                        onClick={handleClearAllMocks}
                    >
                        清空
                    </Button>
                </div>

                <div>
                    <Text
                        size="sm"
                        fw={500}
                    >
                        Mock 日志
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        所有站点中被拦截并替换为 Mock 的请求记录
                    </Text>

                    <Button
                        mt="xs"
                        size="xs"
                        variant="light"
                        color="red"
                        rightSection={<IconTrash size={12} />}
                        disabled={isClearLogsDisabled}
                        onClick={handleClearAllLogs}
                    >
                        清空
                    </Button>
                </div>

                <div>
                    <Text
                        size="sm"
                        fw={500}
                    >
                        网络日志
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        删除所有网络日志
                    </Text>

                    <Button
                        mt="xs"
                        size="xs"
                        variant="light"
                        color="red"
                        rightSection={<IconTrash size={12} />}
                        disabled={isClearNetworkDisabled}
                        onClick={handleDeleteNetwork}
                    >
                        清空
                    </Button>
                </div>

                <div>
                    <Text
                        size="sm"
                        fw={500}
                    >
                        请求头配置文件
                    </Text>
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        可替换请求和响应中请求头的配置文件
                    </Text>

                    <Button
                        mt="xs"
                        size="xs"
                        variant="light"
                        color="red"
                        rightSection={<IconTrash size={12} />}
                        disabled={isHeadersDisabled}
                        onClick={handleDeleteProfiles}
                    >
                        清空
                    </Button>
                </div>

                <div>
                    <Switch
                        size="xs"
                        onLabel="ON"
                        offLabel="OFF"
                        label="显示通知"
                        checked={settings?.showNotifications}
                        onChange={handleToggleNotifications}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        启用后，拦截到请求时将在页面上显示通知。
                    </Text>
                </div>

                <div>
                    <Switch
                        size="xs"
                        onLabel="ON"
                        offLabel="OFF"
                        label="显示运行状态"
                        checked={settings?.showActiveStatus}
                        onChange={handleToggleActiveStatus}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        启用后，页面将显示 Mockiato 的运行状态。
                    </Text>
                </div>

                <div>
                    <Switch
                        size="xs"
                        onLabel="ON"
                        offLabel="OFF"
                        label="行内显示备注"
                        checked={settings?.commentDisplayMode === 'inline'}
                        onChange={handleToggleCommentDisplayMode}
                    />
                    <Text
                        size="xs"
                        c="dimmed"
                    >
                        在 Mock 列表中以行内文本显示备注，而不是悬停提示。
                    </Text>
                </div>
            </Stack>
        </>
    );
};
