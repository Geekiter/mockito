import React, { FC } from 'react';
import { ActionIcon, Menu, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconDotsVertical, IconUserPlus, IconTrash, IconUser, IconUserOff } from '@tabler/icons-react';
import { THeadersProfile, THeaderStatus } from '~/types';
import { iconSize } from '~/contstant';

type ProfileMenuProps = Omit<THeadersProfile, 'headers' | 'lastActive'> & {
    onAdd: () => void;
    onDelete: (id: string) => void;
    onChangeStatus: (id: string, status: THeaderStatus) => void;
};

export const ProfileMenu: FC<ProfileMenuProps> = ({ id, name, status, onAdd, onDelete, onChangeStatus }) => {
    const handleDelete = (): void => {
        modals.openConfirmModal({
            title: `删除配置文件《${name}》`,
            children: (
                <Text size="sm">
                    确认要删除该配置文件？此操作将移除所有相关请求头设置。
                </Text>
            ),
            labels: { confirm: '删除', cancel: '取消' },
            confirmProps: { color: 'red', size: 'xs' },
            cancelProps: {
                size: 'xs',
                variant: 'subtle',
                color: 'gray',
            },
            onConfirm: () => onDelete(id),
        });
    };

    const handleChangeStatus = (): void => {
        const newStatus: THeaderStatus = status === 'enabled' ? 'disabled' : 'enabled';
        onChangeStatus(id, newStatus);
    };

    return (
        <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            styles={{
                item: { fontSize: '0.75rem', padding: '0.5rem' },
            }}
        >
            <Menu.Target>
                <ActionIcon
                    variant="default"
                    color="blue"
                    size="sm"
                    radius="sm"
                >
                    <IconDotsVertical size={14} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    leftSection={<IconUserPlus size={iconSize} />}
                    onClick={onAdd}
                >
                    新增配置文件
                </Menu.Item>

                <Menu.Item
                    leftSection={status === 'enabled' ? <IconUserOff size={iconSize} /> : <IconUser size={iconSize} />}
                    onClick={handleChangeStatus}
                >
                    {status === 'enabled' ? '禁用' : '启用'}配置文件
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>危险操作</Menu.Label>
                <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={handleDelete}
                >
                    删除配置文件
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
