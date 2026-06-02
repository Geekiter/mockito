import React, { FC, useState } from 'react';
import {
    Button,
    Code,
    Collapse,
    CopyButton,
    FileButton,
    Group,
    Stack,
    Tabs,
    Text,
    Textarea,
    UnstyledButton,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { TMock, TMockGroup } from '~/types';
import { ParsedData, parseMocks } from './parser';
import styles from './ImportMocksForm.module.css';

export type ImportMocksProps = {
    onSuccess: (mocks: TMock[], groups: TMockGroup[]) => void;
};

const AI_PROMPT = `请帮我生成符合 Mockiato Chrome 插件格式的 Mock 数据 JSON，直接输出 JSON，不要任何解释。

格式要求：
{
  "mocks": [
    {
      "id": "唯一字符串ID（用 nanoid 风格，8位字母数字）",
      "url": "完整接口 URL、正则表达式或包含子字符串",
      "urlType": "url",
      "httpMethod": "GET",
      "httpStatusCode": 200,
      "delay": 0,
      "responseType": "json",
      "isActive": true,
      "responseHeaders": [],
      "response": "{\\"code\\":0,\\"data\\":{}}",
      "comment": "可选备注",
      "groupId": "可选，对应 groups 里的 id"
    }
  ],
  "groups": [
    {
      "id": "分组唯一ID",
      "name": "分组名称"
    }
  ]
}

字段说明：
- urlType: "url"（精确/前缀匹配）、"regexp"（正则匹配）或 "contain"（包含匹配）
- httpMethod: GET / POST / PUT / PATCH / DELETE / OPTIONS / HEAD
- httpStatusCode: HTTP 状态码，如 200、401、500
- responseType: "json" / "text" / "none"
- response: 响应体字符串，JSON 类型时需 JSON.stringify 后的字符串
- delay: 模拟延迟毫秒数，0 表示不延迟
- groups 可为空数组 []

请根据我的需求生成 Mock 数据：【在此填写你的接口需求，例如：用户登录、获取商品列表等】

只输出合法的 JSON 对象，不要 markdown 代码块，不要任何说明文字。`;

export const ImportMocksForm: FC<ImportMocksProps> = ({ onSuccess }) => {
    // ── Tab 1: 上传文件 ──────────────────────────────────────────
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [errors, setErrors] = useState<string[] | null>(null);

    const handleFile = (file: File | null) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result as string;
            const result = parseMocks(text);
            setErrors(result.errors);
            setParsedData(result.parsed);
            setFileContent(text);
        };
        reader.onerror = () => {
            setErrors(['读取文件时发生错误']);
            setFileContent(null);
        };
        reader.readAsText(file);
    };

    const handleFileSubmit = () => {
        if (parsedData) {
            onSuccess(parsedData.mocks, parsedData.groups);
        }
    };

    // ── Tab 2: 粘贴 JSON ─────────────────────────────────────────
    const [textValue, setTextValue] = useState('');
    const [textParsed, setTextParsed] = useState<ParsedData | null>(null);
    const [textErrors, setTextErrors] = useState<string[] | null>(null);
    const [promptOpen, setPromptOpen] = useState(false);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.currentTarget.value;
        setTextValue(val);
        if (!val.trim()) {
            setTextParsed(null);
            setTextErrors(null);
            return;
        }
        const result = parseMocks(val);
        setTextErrors(result.errors);
        setTextParsed(result.parsed);
    };

    const handleTextSubmit = () => {
        if (textParsed) {
            onSuccess(textParsed.mocks, textParsed.groups);
        }
    };

    const canImportText = !!textParsed && !textErrors;

    return (
        <Tabs defaultValue="file">
            <Tabs.List mb="md">
                <Tabs.Tab value="file">上传文件</Tabs.Tab>
                <Tabs.Tab value="paste">粘贴 JSON</Tabs.Tab>
            </Tabs.List>

            {/* ── Tab 1 ─────────────────────────────────────────── */}
            <Tabs.Panel value="file">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleFileSubmit();
                    }}
                    className={styles.form}
                >
                    <Stack
                        justify="center"
                        align="center"
                        className={styles.fileUploader}
                        gap="xs"
                    >
                        <Text
                            size="sm"
                            c="gray"
                        >
                            选择 JSON 文件以导入 Mock 数据
                        </Text>

                        <FileButton
                            onChange={handleFile}
                            accept="application/json"
                        >
                            {(props) => (
                                <Button
                                    size="xs"
                                    {...props}
                                >
                                    选择文件
                                </Button>
                            )}
                        </FileButton>
                    </Stack>

                    {errors && (
                        <Stack
                            className={styles.errors}
                            gap={0}
                            align="start"
                        >
                            {errors.map((error) => (
                                <Text
                                    key={error}
                                    c="red"
                                    size="sm"
                                >
                                    {error}
                                </Text>
                            ))}
                        </Stack>
                    )}

                    {fileContent && (
                        <div>
                            <Text size="sm">文件预览</Text>
                            <Code
                                block
                                mt="sm"
                                className={styles.file}
                            >
                                {fileContent}
                            </Code>
                        </div>
                    )}

                    {parsedData != null && (
                        <Group
                            justify="right"
                            mt="md"
                            gap="xs"
                        >
                            <Button
                                type="submit"
                                size="xs"
                                disabled={errors !== null}
                            >
                                导入
                            </Button>
                        </Group>
                    )}
                </form>
            </Tabs.Panel>

            {/* ── Tab 2 ─────────────────────────────────────────── */}
            <Tabs.Panel value="paste">
                <Stack gap="sm">
                    <Textarea
                        placeholder={`粘贴 JSON 数组，例如：\n{\n  "mocks": [...],\n  "groups": [...]\n}`}
                        minRows={8}
                        autosize
                        value={textValue}
                        onChange={handleTextChange}
                        styles={{
                            input: {
                                borderColor:
                                    textErrors
                                        ? 'var(--mantine-color-red-6)'
                                        : undefined,
                            },
                        }}
                    />

                    {textErrors && (
                        <Stack
                            gap={2}
                            align="start"
                        >
                            {textErrors.map((err) => (
                                <Text
                                    key={err}
                                    c="red"
                                    size="xs"
                                >
                                    {err}
                                </Text>
                            ))}
                        </Stack>
                    )}

                    {textParsed && !textErrors && (
                        <Text
                            c="teal"
                            size="xs"
                        >
                            ✓ 解析成功，共 {textParsed.mocks.length} 条 Mock
                        </Text>
                    )}

                    {/* AI 提示词折叠区 */}
                    <Stack gap={4}>
                        <UnstyledButton
                            onClick={() => setPromptOpen((o) => !o)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                        >
                            <Text
                                size="xs"
                                c="dimmed"
                            >
                                用 AI 快速生成 Mock 数据
                            </Text>
                            {promptOpen ? (
                                <IconChevronUp
                                    size={12}
                                    color="var(--mantine-color-dimmed)"
                                />
                            ) : (
                                <IconChevronDown
                                    size={12}
                                    color="var(--mantine-color-dimmed)"
                                />
                            )}
                        </UnstyledButton>

                        <Collapse in={promptOpen}>
                            <Stack gap="xs">
                                <Textarea
                                    readOnly
                                    minRows={10}
                                    autosize
                                    value={AI_PROMPT}
                                    styles={{
                                        input: {
                                            fontFamily: 'var(--mantine-font-family-monospace)',
                                            fontSize: '0.72rem',
                                            color: 'var(--mantine-color-dimmed)',
                                            backgroundColor: 'var(--mantine-color-gray-0)',
                                        },
                                    }}
                                />
                                <Group justify="flex-end">
                                    <CopyButton
                                        value={AI_PROMPT}
                                        timeout={2000}
                                    >
                                        {({ copied, copy }) => (
                                            <Button
                                                size="xs"
                                                color={copied ? 'teal' : 'blue'}
                                                variant="light"
                                                onClick={copy}
                                            >
                                                {copied ? '已复制！' : '复制提示词'}
                                            </Button>
                                        )}
                                    </CopyButton>
                                </Group>
                            </Stack>
                        </Collapse>
                    </Stack>

                    <Group justify="flex-end">
                        <Button
                            size="xs"
                            disabled={!canImportText}
                            onClick={handleTextSubmit}
                        >
                            导入
                        </Button>
                    </Group>
                </Stack>
            </Tabs.Panel>
        </Tabs>
    );
};
