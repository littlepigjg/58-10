const EventBus = (() => {
    const events = {};

    function subscribe(event, callback) {
        if (!events[event]) {
            events[event] = [];
        }
        events[event].push(callback);
        return function() {
            events[event] = events[event].filter(function(cb) { return cb !== callback; });
        };
    }

    function publish(event, data) {
        if (!events[event]) return;
        events[event].forEach(function(callback) {
            try {
                callback(data);
            } catch (e) {
                console.error('EventBus callback error:', e);
            }
        });
    }

    function unsubscribe(event, callback) {
        if (!events[event]) return;
        events[event] = events[event].filter(function(cb) { return cb !== callback; });
    }

    return { subscribe, publish, unsubscribe };
})();

const GlobalStyleMapping = {
    cssVarMap: {
        primaryColor: '--primary-color',
        textColor: '--text-color',
        secondaryTextColor: '--secondary-text-color',
        fontFamily: '--default-font-family',
        headingFontSize: '--heading-font-size',
        bodyFontSize: '--body-font-size',
        defaultPaddingTop: '--default-padding-top',
        defaultPaddingRight: '--default-padding-right',
        defaultPaddingBottom: '--default-padding-bottom',
        defaultPaddingLeft: '--default-padding-left',
        dividerColor: '--divider-color',
        linkColor: '--link-color'
    },
    componentFields: {
        heading: ['color', 'fontSize', 'fontFamily', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        paragraph: ['color', 'fontSize', 'fontFamily', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        button: ['backgroundColor', 'color', 'fontSize', 'fontFamily'],
        image: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'],
        divider: ['color', 'paddingTop', 'paddingBottom'],
        columns: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
    },
    fieldToCssVar: {
        heading: {
            color: '--text-color',
            fontSize: '--heading-font-size',
            fontFamily: '--default-font-family',
            paddingTop: '--default-padding-top',
            paddingRight: '--default-padding-right',
            paddingBottom: '--default-padding-bottom',
            paddingLeft: '--default-padding-left'
        },
        paragraph: {
            color: '--secondary-text-color',
            fontSize: '--body-font-size',
            fontFamily: '--default-font-family',
            paddingTop: '--default-padding-top',
            paddingRight: '--default-padding-right',
            paddingBottom: '--default-padding-bottom',
            paddingLeft: '--default-padding-left'
        },
        button: {
            backgroundColor: '--primary-color',
            color: null,
            fontSize: '--body-font-size',
            fontFamily: '--default-font-family'
        },
        image: {
            paddingTop: '--default-padding-top',
            paddingRight: '--default-padding-right',
            paddingBottom: '--default-padding-bottom',
            paddingLeft: '--default-padding-left'
        },
        divider: {
            color: '--divider-color',
            paddingTop: '--default-padding-top',
            paddingBottom: '--default-padding-bottom'
        },
        columns: {
            paddingTop: '--default-padding-top',
            paddingRight: '--default-padding-right',
            paddingBottom: '--default-padding-bottom',
            paddingLeft: '--default-padding-left'
        }
    }
};

const ComponentLibrary = (() => {

    const PARAGRAPH_DEFAULTS = {
        text: '这里是段落文字，点击编辑内容。支持多行文本，可以展示邮件的主要内容。',
        fontSize: 14,
        lineHeight: 1.6,
        color: '#4b5563',
        align: 'left',
        paddingTop: 8,
        paddingBottom: 12,
        paddingLeft: 20,
        paddingRight: 20
    };

    const COMPONENTS = {
        heading: {
            type: 'heading',
            label: '标题',
            icon: '📝',
            defaults: {
                text: '这是一个标题',
                level: 1,
                fontSize: 28,
                color: '#1f2937',
                align: 'center',
                fontWeight: 'bold',
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 20,
                paddingRight: 20
            },
            fields: [
                { key: 'text', label: '文字内容', type: 'textarea' },
                { key: 'level', label: '级别', type: 'select', options: [
                    { value: 1, label: 'H1' },
                    { value: 2, label: 'H2' },
                    { value: 3, label: 'H3' }
                ]},
                { key: 'fontSize', label: '字号(px)', type: 'number' },
                { key: 'fontWeight', label: '字重', type: 'select', options: [
                    { value: 'normal', label: '正常' },
                    { value: 'bold', label: '粗体' }
                ]},
                { key: 'color', label: '文字颜色', type: 'color' },
                { key: 'align', label: '对齐', type: 'select', options: [
                    { value: 'left', label: '左对齐' },
                    { value: 'center', label: '居中' },
                    { value: 'right', label: '右对齐' }
                ]},
                { type: 'group', label: '内边距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingRight', label: '右', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' },
                    { key: 'paddingLeft', label: '左', type: 'number' }
                ]}
            ]
        },

        paragraph: {
            type: 'paragraph',
            label: '段落',
            icon: '📄',
            defaults: PARAGRAPH_DEFAULTS,
            fields: [
                { key: 'text', label: '文字内容', type: 'textarea' },
                { key: 'fontSize', label: '字号(px)', type: 'number' },
                { key: 'lineHeight', label: '行高', type: 'number', step: 0.1 },
                { key: 'color', label: '文字颜色', type: 'color' },
                { key: 'align', label: '对齐', type: 'select', options: [
                    { value: 'left', label: '左对齐' },
                    { value: 'center', label: '居中' },
                    { value: 'right', label: '右对齐' }
                ]},
                { type: 'group', label: '内边距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingRight', label: '右', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' },
                    { key: 'paddingLeft', label: '左', type: 'number' }
                ]}
            ]
        },

        image: {
            type: 'image',
            label: '图片',
            icon: '🖼️',
            defaults: {
                src: 'https://picsum.photos/600/200',
                alt: '图片描述',
                href: '',
                width: 100,
                align: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 20,
                paddingRight: 20
            },
            fields: [
                { key: 'src', label: '图片地址', type: 'text' },
                { key: 'alt', label: '替代文字', type: 'text' },
                { key: 'href', label: '链接地址(可选)', type: 'text' },
                { key: 'width', label: '宽度(%)', type: 'number' },
                { key: 'align', label: '对齐', type: 'select', options: [
                    { value: 'left', label: '左对齐' },
                    { value: 'center', label: '居中' },
                    { value: 'right', label: '右对齐' }
                ]},
                { type: 'group', label: '内边距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingRight', label: '右', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' },
                    { key: 'paddingLeft', label: '左', type: 'number' }
                ]}
            ]
        },

        button: {
            type: 'button',
            label: '按钮',
            icon: '🔘',
            defaults: {
                text: '点击了解更多',
                href: 'https://example.com',
                backgroundColor: '#667eea',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 'bold',
                borderRadius: 6,
                paddingHorizontal: 28,
                paddingVertical: 12,
                align: 'center',
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 20,
                paddingRight: 20
            },
            fields: [
                { key: 'text', label: '按钮文字', type: 'text' },
                { key: 'href', label: '链接地址', type: 'text' },
                { key: 'backgroundColor', label: '背景颜色', type: 'color' },
                { key: 'color', label: '文字颜色', type: 'color' },
                { key: 'fontSize', label: '字号(px)', type: 'number' },
                { key: 'borderRadius', label: '圆角(px)', type: 'number' },
                { type: 'group', label: '按钮内边距', fields: [
                    { key: 'paddingVertical', label: '上下', type: 'number' },
                    { key: 'paddingHorizontal', label: '左右', type: 'number' }
                ]},
                { key: 'align', label: '对齐', type: 'select', options: [
                    { value: 'left', label: '左对齐' },
                    { value: 'center', label: '居中' },
                    { value: 'right', label: '右对齐' }
                ]},
                { type: 'group', label: '外边距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' }
                ]}
            ]
        },

        divider: {
            type: 'divider',
            label: '分隔线',
            icon: '➖',
            defaults: {
                style: 'solid',
                color: '#e5e7eb',
                thickness: 1,
                width: 100,
                paddingTop: 16,
                paddingBottom: 16,
                paddingLeft: 20,
                paddingRight: 20
            },
            fields: [
                { key: 'style', label: '线条样式', type: 'select', options: [
                    { value: 'solid', label: '实线' },
                    { value: 'dashed', label: '虚线' },
                    { value: 'dotted', label: '点线' }
                ]},
                { key: 'color', label: '线条颜色', type: 'color' },
                { key: 'thickness', label: '粗细(px)', type: 'number' },
                { key: 'width', label: '宽度(%)', type: 'number' },
                { type: 'group', label: '上下间距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' }
                ]}
            ]
        },

        columns: {
            type: 'columns',
            label: '多栏布局',
            icon: '📊',
            defaults: {
                columns: 2,
                paddingTop: 12,
                paddingBottom: 12,
                paddingLeft: 20,
                paddingRight: 20,
                children: []
            },
            fields: [
                { key: 'columns', label: '栏数', type: 'select', options: [
                    { value: 2, label: '2 栏' },
                    { value: 3, label: '3 栏' }
                ]},
                { type: 'group', label: '外边距', fields: [
                    { key: 'paddingTop', label: '上', type: 'number' },
                    { key: 'paddingBottom', label: '下', type: 'number' }
                ]}
            ],
            isContainer: true
        }
    };

    function getComponent(type) {
        return COMPONENTS[type];
    }

    function getAllComponents() {
        return Object.values(COMPONENTS);
    }

    function createBlock(type) {
        const comp = COMPONENTS[type];
        if (!comp) return null;

        const defaults = JSON.parse(JSON.stringify(comp.defaults));

        if (type === 'columns') {
            defaults.children = [];
            for (let i = 0; i < defaults.columns; i++) {
                defaults.children.push({
                    id: 'col_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    blocks: []
                });
            }
        }

        return {
            id: 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            data: defaults
        };
    }

    function createColumnItem() {
        return {
            id: 'colitem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            type: 'paragraph',
            data: JSON.parse(JSON.stringify(PARAGRAPH_DEFAULTS))
        };
    }

    return {
        getComponent,
        getAllComponents,
        createBlock,
        createColumnItem,
        COMPONENTS
    };
})();

const GlobalConfigSchema = [
    { key: 'backgroundColor', label: '页面背景色', type: 'color' },
    { key: 'contentBgColor', label: '内容区背景色', type: 'color' },
    { key: 'primaryColor', label: '主色调', type: 'color' },
    { key: 'textColor', label: '标题文字色', type: 'color' },
    { key: 'secondaryTextColor', label: '正文文字色', type: 'color' },
    { key: 'dividerColor', label: '分隔线颜色', type: 'color' },
    { key: 'linkColor', label: '链接颜色', type: 'color' },
    { key: 'fontFamily', label: '字体族', type: 'select', options: [
        { value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif', label: '系统默认字体' },
        { value: '"Helvetica Neue", Helvetica, Arial, sans-serif', label: 'Helvetica' },
        { value: '"Microsoft YaHei", "微软雅黑", sans-serif', label: '微软雅黑' },
        { value: '"PingFang SC", "Hiragino Sans GB", sans-serif', label: '苹方' },
        { value: 'Georgia, "Times New Roman", Times, serif', label: 'Georgia 衬线' },
        { value: '"Courier New", Courier, monospace', label: '等宽字体' }
    ]},
    { key: 'headingFontSize', label: '标题字号(px)', type: 'number' },
    { key: 'bodyFontSize', label: '正文字号(px)', type: 'number' },
    { type: 'group', label: '默认内边距', fields: [
        { key: 'defaultPaddingTop', label: '上(px)', type: 'number' },
        { key: 'defaultPaddingRight', label: '右(px)', type: 'number' },
        { key: 'defaultPaddingBottom', label: '下(px)', type: 'number' },
        { key: 'defaultPaddingLeft', label: '左(px)', type: 'number' }
    ]}
];
